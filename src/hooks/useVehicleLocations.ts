"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { VehicleLocation } from "@/lib/supabase/types";

/** Position considered "stale" when the last ping is older than this (ms). */
export const STALE_AFTER_MS = 30_000;

export type LiveVehicle = {
  unitId: string;
  unitCode: string | null;
  routeId: string | null;
  routeCode: string | null;
  routeName: string | null;
  routeColor: string | null;
  lat: number;
  lng: number;
  heading: number | null;
  speed: number | null;
  recordedAt: string;
  stale: boolean;
};

type UnitMeta = {
  unitCode: string | null;
  routeId: string | null;
  routeCode: string | null;
  routeName: string | null;
  routeColor: string | null;
};

function isStale(recordedAt: string, now: number): boolean {
  return now - new Date(recordedAt).getTime() > STALE_AFTER_MS;
}

/**
 * Subscribes to live vehicle positions.
 * - Initial render from the `latest_vehicle_locations` view.
 * - Live updates via Supabase Realtime (INSERT on vehicle_locations),
 *   enriched with unit/route metadata loaded once on mount.
 * - Recomputes `stale` every 5s.
 *
 * @param routeId optional filter to a single route.
 */
export function useVehicleLocations(routeId?: string) {
  const [vehicles, setVehicles] = useState<Map<string, LiveVehicle>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const metaRef = useRef<Map<string, UnitMeta>>(new Map());

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      setLoading(true);

      // 1) Unit + route metadata lookup (to enrich realtime ping payloads).
      const { data: units, error: unitsErr } = await supabase
        .from("units")
        .select("id, code, route_id, routes(code, name, color)");

      if (unitsErr) {
        if (!cancelled) setError(unitsErr.message);
      } else if (units) {
        const meta = new Map<string, UnitMeta>();
        for (const u of units) {
          const r = u.routes as
            | { code: string; name: string; color: string }
            | null;
          meta.set(u.id, {
            unitCode: u.code,
            routeId: u.route_id,
            routeCode: r?.code ?? null,
            routeName: r?.name ?? null,
            routeColor: r?.color ?? null,
          });
        }
        metaRef.current = meta;
      }

      // 2) Latest known position per unit.
      let query = supabase.from("latest_vehicle_locations").select("*");
      if (routeId) query = query.eq("route_id", routeId);
      const { data: latest, error: latestErr } = await query;

      if (cancelled) return;
      if (latestErr) {
        setError(latestErr.message);
      } else if (latest) {
        const now = Date.now();
        const next = new Map<string, LiveVehicle>();
        for (const row of latest) {
          if (!row.unit_id || row.lat == null || row.lng == null) continue;
          next.set(row.unit_id, {
            unitId: row.unit_id,
            unitCode: row.unit_code,
            routeId: row.route_id,
            routeCode: row.route_code,
            routeName: row.route_name,
            routeColor: row.route_color,
            lat: row.lat,
            lng: row.lng,
            heading: row.heading,
            speed: row.speed,
            recordedAt: row.recorded_at ?? new Date().toISOString(),
            stale: row.recorded_at ? isStale(row.recorded_at, now) : true,
          });
        }
        setVehicles(next);
      }
      setLoading(false);
    }

    bootstrap();

    // 3) Realtime subscription for new pings.
    const channel = supabase
      .channel("rumbo-vehicle-locations")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "vehicle_locations" },
        (payload) => {
          const row = payload.new as VehicleLocation;
          if (routeId && row.route_id !== routeId) return;
          const meta = metaRef.current.get(row.unit_id);
          setVehicles((prev) => {
            const next = new Map(prev);
            next.set(row.unit_id, {
              unitId: row.unit_id,
              unitCode: meta?.unitCode ?? null,
              routeId: row.route_id,
              routeCode: meta?.routeCode ?? null,
              routeName: meta?.routeName ?? null,
              routeColor: meta?.routeColor ?? null,
              lat: row.lat,
              lng: row.lng,
              heading: row.heading,
              speed: row.speed,
              recordedAt: row.recorded_at,
              stale: false,
            });
            return next;
          });
        }
      )
      .subscribe();

    // 4) Re-evaluate staleness periodically.
    const interval = setInterval(() => {
      const now = Date.now();
      setVehicles((prev) => {
        let changed = false;
        const next = new Map(prev);
        for (const [id, v] of next) {
          const stale = isStale(v.recordedAt, now);
          if (stale !== v.stale) {
            next.set(id, { ...v, stale });
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 5_000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [routeId]);

  return {
    vehicles: Array.from(vehicles.values()),
    loading,
    error,
  };
}
