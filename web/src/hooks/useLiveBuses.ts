"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Bus } from "@/lib/types";

// How long to wait before marking a bus position as stale (ms)
const STALE_THRESHOLD_MS = 60_000;

function positionToBus(
  unitId: string,
  routeNumber: string,
  routeName: string,
  lat: number,
  lng: number,
  speedKmh: number,
  heading: number,
  recordedAt: string
): Bus {
  const ageMs = Date.now() - new Date(recordedAt).getTime();
  const status: Bus["status"] = ageMs > STALE_THRESHOLD_MS ? "stale" : "on_time";

  return {
    id: unitId,
    routeNumber,
    routeName,
    position: { lat, lng },
    heading: heading ?? 0,
    speed: speedKmh ?? 0,
    status,
    etaMinutes: 0, // computed by server; show 0 when unavailable
    capacity: "medium",
    lastUpdate: new Date(recordedAt),
  };
}

interface ActivePosition {
  unit_id: string;
  lat: number;
  lng: number;
  speed_kmh: number;
  heading: number;
  recorded_at: string;
  // Supabase returns nested joins as arrays
  trips: Array<{ route_id: string; routes: Array<{ route_number: string; name: string }> }> | null;
}

export function useLiveBuses() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [connected, setConnected] = useState(false);
  const busMapRef = useRef<Map<string, Bus>>(new Map());

  // Load current positions on mount
  useEffect(() => {
    async function loadCurrentPositions() {
      const { data, error } = await supabase
        .from("gps_positions")
        .select(`
          unit_id,
          lat,
          lng,
          speed_kmh,
          heading,
          recorded_at,
          trips!inner (
            route_id,
            routes ( route_number, name )
          )
        `)
        .eq("trips.status", "active")
        // Only get the most recent position per unit
        .order("recorded_at", { ascending: false })
        .limit(100);

      if (error || !data || data.length === 0) return;

      const seenUnits = new Set<string>();
      const initial = new Map<string, Bus>();

      for (const row of data as ActivePosition[]) {
        if (seenUnits.has(row.unit_id)) continue;
        seenUnits.add(row.unit_id);

        const tripRow = Array.isArray(row.trips) ? row.trips[0] : row.trips;
        const routeRow = Array.isArray(tripRow?.routes) ? tripRow.routes[0] : tripRow?.routes;
        const routeNumber = routeRow?.route_number ?? "?";
        const routeName = routeRow?.name ?? "";

        initial.set(
          row.unit_id,
          positionToBus(
            row.unit_id,
            routeNumber,
            routeName,
            row.lat,
            row.lng,
            row.speed_kmh,
            row.heading,
            row.recorded_at
          )
        );
      }

      busMapRef.current = initial;
      setBuses(Array.from(initial.values()));
      setConnected(true);
    }

    loadCurrentPositions();
  }, []);

  // Subscribe to realtime inserts on gps_positions
  useEffect(() => {
    const channel = supabase
      .channel("live-buses")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "gps_positions",
        },
        async (payload) => {
          const row = payload.new as {
            unit_id: string;
            lat: number;
            lng: number;
            speed_kmh: number;
            heading: number;
            recorded_at: string;
            trip_id: string;
          };

          // Fetch route info for this trip (cached by browser after first call)
          const { data: tripData } = await supabase
            .from("trips")
            .select("route_id, routes ( route_number, name )")
            .eq("id", row.trip_id)
            .eq("status", "active")
            .maybeSingle();

          if (!tripData) return;

          const routeNumber =
            (tripData as { routes?: { route_number?: string } }).routes?.route_number ?? "?";
          const routeName =
            (tripData as { routes?: { name?: string } }).routes?.name ?? "";

          const updatedBus = positionToBus(
            row.unit_id,
            routeNumber,
            routeName,
            row.lat,
            row.lng,
            row.speed_kmh,
            row.heading,
            row.recorded_at
          );

          busMapRef.current.set(row.unit_id, updatedBus);
          setBuses(Array.from(busMapRef.current.values()));
          setConnected(true);
        }
      )
      .subscribe((status) => {
        setConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { buses, connected };
}
