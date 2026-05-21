"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import LiveMap from "@/components/LiveMap";
import { useVehicleLocations } from "@/hooks/useVehicleLocations";
import type { SafetyReport } from "@/lib/supabase/types";

const severityStyle: Record<string, string> = {
  critical: "bg-error text-on-error",
  high: "bg-safety-emergency text-white",
  medium: "bg-status-delayed text-on-surface",
  low: "bg-surface-container-high text-on-surface-variant",
};

type FleetMeta = {
  code: string;
  plate: string | null;
  driver: string | null;
  routeName: string | null;
};

export default function OpsPage() {
  const { vehicles, loading } = useVehicleLocations();
  const [fleet, setFleet] = useState<Map<string, FleetMeta>>(new Map());
  const [counts, setCounts] = useState({ units: 0, routes: 0, drivers: 0 });
  const [reports, setReports] = useState<SafetyReport[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: units }, { count: routesCount }, { count: driversCount }, { data: rep }] =
        await Promise.all([
          supabase.from("units").select("id, code, plate, drivers(full_name), routes(name)"),
          supabase.from("routes").select("*", { count: "exact", head: true }),
          supabase.from("drivers").select("*", { count: "exact", head: true }),
          supabase
            .from("safety_reports")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);
      if (units) {
        const m = new Map<string, FleetMeta>();
        for (const u of units) {
          const dr = u.drivers as { full_name: string } | null;
          const r = u.routes as { name: string } | null;
          m.set(u.id, {
            code: u.code,
            plate: u.plate,
            driver: dr?.full_name ?? null,
            routeName: r?.name ?? null,
          });
        }
        setFleet(m);
        setCounts({
          units: units.length,
          routes: routesCount ?? 0,
          drivers: driversCount ?? 0,
        });
      }
      if (rep) setReports(rep);
    })();

    const channel = supabase
      .channel("rumbo-ops-safety")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "safety_reports" },
        (payload) =>
          setReports((prev) => [payload.new as SafetyReport, ...prev].slice(0, 5))
      )
      .subscribe();
    return () => void supabase.removeChannel(channel);
  }, []);

  const liveUnits = vehicles.filter((v) => !v.stale).length;
  const punctuality = vehicles.length
    ? Math.round((liveUnits / vehicles.length) * 100)
    : 0;

  return (
    <>
      <header className="h-16 shrink-0 border-b border-outline-variant bg-surface/80 backdrop-blur flex items-center justify-between px-8">
        <h1 className="text-headline-md font-extrabold text-primary">
          Dashboard de Operaciones
        </h1>
        <button className="bg-safety-emergency text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:brightness-90">
          🚨 Emergencia
        </button>
      </header>

      <div className="flex-1 flex min-h-0">
          {/* Map */}
          <div className="flex-1 relative map-grid">
            <LiveMap vehicles={vehicles} className="absolute inset-0" zoom={12} />
            <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur px-4 py-2 rounded-lg shadow border border-outline-variant text-sm font-semibold">
              {loading ? "Cargando flota…" : `${vehicles.length} unidades en el mapa`}
            </div>
          </div>

          {/* Right panel */}
          <aside className="w-96 shrink-0 bg-surface-container-low border-l border-outline-variant p-6 overflow-y-auto space-y-6">
            <div>
              <h2 className="text-headline-md font-bold">Resumen de Operaciones</h2>
              <p className="text-sm text-on-surface-variant">
                Estado en vivo de la flota
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Metric label="UNIDADES EN VIVO" value={liveUnits} color="text-primary" />
              <Metric
                label="DISPONIBILIDAD"
                value={`${punctuality}%`}
                color="text-status-on-time"
              />
              <div className="col-span-2 bg-surface p-4 rounded-xl border border-outline-variant flex justify-between">
                <FleetStat value={counts.units} label="BUSES" />
                <FleetStat value={counts.routes} label="RUTAS" />
                <FleetStat value={counts.drivers} label="CONDUCTORES" />
              </div>
            </div>

            <div>
              <h3 className="text-label-lg font-bold mb-3">Unidades activas</h3>
              <div className="space-y-2">
                {vehicles.length === 0 && (
                  <p className="text-sm text-outline">
                    Ninguna unidad transmitiendo. Abrí{" "}
                    <Link href="/driver" className="text-primary underline">
                      /driver
                    </Link>{" "}
                    para empezar.
                  </p>
                )}
                {vehicles.map((v) => {
                  const meta = fleet.get(v.unitId);
                  return (
                    <div
                      key={v.unitId}
                      className="flex items-center justify-between bg-surface p-3 rounded-lg border border-outline-variant"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-sm">
                          {v.unitCode ?? meta?.code ?? "—"}
                          {meta?.plate && (
                            <span className="ml-2 text-label-md font-normal text-outline">
                              {meta.plate}
                            </span>
                          )}
                        </p>
                        <p className="text-label-md text-on-surface-variant truncate">
                          {v.routeName ?? meta?.routeName ?? "Sin ruta"}
                          {meta?.driver && ` · ${meta.driver}`}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 text-label-md font-semibold px-2 py-0.5 rounded-full ${
                          v.stale
                            ? "bg-surface-container-high text-status-stale"
                            : "bg-status-on-time/10 text-status-on-time"
                        }`}
                      >
                        {v.stale ? "Señal perdida" : "En vivo"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-label-lg font-bold mb-3">Reportes de seguridad</h3>
              {reports.length === 0 ? (
                <p className="text-sm text-outline">Sin reportes recientes.</p>
              ) : (
                <div className="space-y-2">
                  {reports.map((r) => (
                    <div
                      key={r.id}
                      className="bg-surface p-3 rounded-lg border border-outline-variant"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm capitalize">{r.type}</p>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                            severityStyle[r.severity] ?? severityStyle.low
                          }`}
                        >
                          {r.severity}
                        </span>
                      </div>
                      {r.description && (
                        <p className="text-label-md text-on-surface-variant mt-1">
                          {r.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
    </>
  );
}

function Metric({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-surface p-4 rounded-xl border border-outline-variant">
      <span className={`text-eta-display font-extrabold ${color}`}>{value}</span>
      <p className="text-label-md text-outline">{label}</p>
    </div>
  );
}

function FleetStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <span className="block text-headline-md font-extrabold">{value}</span>
      <span className="text-[10px] text-outline uppercase tracking-wide">{label}</span>
    </div>
  );
}
