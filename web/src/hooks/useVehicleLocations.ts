"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Bus } from "@/lib/types";
import type { LatestVehicleLocation } from "@/lib/supabase/types";

function rowToBus(row: LatestVehicleLocation): Bus | null {
  // Descartamos filas sin datos mínimos necesarios
  if (!row.unit_id || row.lat == null || row.lng == null) return null;

  const lastUpdate = row.recorded_at ? new Date(row.recorded_at) : new Date();
  const staleMs = Date.now() - lastUpdate.getTime();
  const status = staleMs > 30_000 ? "stale" : "on_time";

  return {
    id: row.unit_id,
    routeNumber: row.unit_code ?? row.route_code ?? "?",
    routeName: row.route_name ?? "",
    position: { lat: row.lat, lng: row.lng },
    heading: row.heading ?? 0,
    speed: row.speed ?? 0,
    status,
    etaMinutes: Math.max(1, Math.round((1 - Math.min(staleMs / 300_000, 1)) * 15)),
    capacity: "medium",
    lastUpdate,
  };
}

export function useVehicleLocations(routeId?: string) {
  const [vehicles, setVehicles] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLatest() {
      let q = supabase.from("latest_vehicle_locations").select("*");
      if (routeId) q = q.eq("route_id", routeId);
      const { data, error } = await q;
      if (error) { setError(error.message); setLoading(false); return; }
      setVehicles((data ?? []).map(rowToBus).filter(Boolean) as Bus[]);
      setLoading(false);
    }

    fetchLatest();

    // Realtime: re-fetch la vista cuando llega un nuevo ping GPS
    const channel = supabase
      .channel("vehicle-locations-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "vehicle_locations" },
        () => { fetchLatest(); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [routeId]);

  return { vehicles, loading, error };
}
