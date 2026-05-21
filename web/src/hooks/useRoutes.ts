"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Route } from "@/lib/types";

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      const [routesRes, tripsRes, stopsRes] = await Promise.all([
        supabase.from("routes").select("id, code, name, color").order("code"),
        supabase.from("trips").select("route_id").eq("status", "in_progress"),
        supabase.from("stops").select("route_id, name, lat, lng, sequence").order("sequence"),
      ]);

      if (routesRes.error) { setError(routesRes.error.message); setLoading(false); return; }

      // Cuenta buses activos por ruta
      const activeBusesByRoute: Record<string, number> = {};
      for (const trip of tripsRes.data ?? []) {
        activeBusesByRoute[trip.route_id] = (activeBusesByRoute[trip.route_id] ?? 0) + 1;
      }

      // Agrupa paradas por ruta para waypoints del mapa
      const stopsByRoute: Record<string, Array<{ lat: number; lng: number; name: string }>> = {};
      for (const stop of stopsRes.data ?? []) {
        if (!stopsByRoute[stop.route_id]) stopsByRoute[stop.route_id] = [];
        stopsByRoute[stop.route_id].push({ lat: stop.lat, lng: stop.lng, name: stop.name });
      }

      const mapped: Route[] = (routesRes.data ?? []).map((r) => {
        const stops = stopsByRoute[r.id] ?? [];
        const parts = r.name.split("–").map((s: string) => s.trim());
        const active = activeBusesByRoute[r.id] ?? 0;
        return {
          id: r.id,
          number: r.code,
          name: r.name,
          origin: parts[0] ?? r.name,
          destination: parts[1] ?? "",
          waypoints: stops.map((s) => ({ lat: s.lat, lng: s.lng })),
          stops: stops.map((s, i) => ({
            id: `${r.id}-${i}`,
            name: s.name,
            position: { lat: s.lat, lng: s.lng },
            routes: [r.code],
          })),
          frequency: 10,
          status: active > 0 ? "on_time" as const : "stale" as const,
          activeBuses: active,
          rating: 0,
        };
      });

      setRoutes(mapped);
      setLoading(false);
    }

    fetch();
  }, []);

  return { routes, loading, error };
}
