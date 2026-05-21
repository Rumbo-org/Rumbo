"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Driver, Route, Unit } from "@/lib/supabase/types";

const STATUSES = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" },
  { value: "maintenance", label: "Mantenimiento" },
];

export default function FleetPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [draft, setDraft] = useState({ code: "", plate: "" });
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    const [{ data: u }, { data: r }, { data: d }] = await Promise.all([
      supabase.from("units").select("*").order("code"),
      supabase.from("routes").select("*").order("code"),
      supabase.from("drivers").select("*").order("full_name"),
    ]);
    if (u) setUnits(u);
    if (r) setRoutes(r);
    if (d) setDrivers(d);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createUnit() {
    if (!draft.code.trim()) return setStatus("El código es obligatorio");
    const { error } = await supabase.from("units").insert({
      code: draft.code.trim(),
      plate: draft.plate.trim() || null,
    });
    if (error) return setStatus(`Error: ${error.message}`);
    setDraft({ code: "", plate: "" });
    setStatus("Unidad creada");
    load();
  }

  async function updateUnit(id: string, payload: Partial<Unit>) {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, ...payload } : u)));
    await supabase.from("units").update(payload).eq("id", id);
  }

  // A driver runs at most one unit: clear them elsewhere first.
  async function assignDriver(unitId: string, driverId: string | null) {
    if (driverId) {
      const others = units.filter((u) => u.driver_id === driverId && u.id !== unitId);
      for (const o of others) await updateUnit(o.id, { driver_id: null });
    }
    await updateUnit(unitId, { driver_id: driverId });
  }

  async function deleteUnit(id: string) {
    if (!confirm("¿Borrar esta unidad?")) return;
    await supabase.from("units").delete().eq("id", id);
    load();
  }

  return (
    <>
      <header className="h-16 shrink-0 border-b border-outline-variant bg-surface/80 backdrop-blur flex items-center px-8">
        <h1 className="text-headline-md font-extrabold text-primary">Flota</h1>
        <span className="ml-3 text-sm text-on-surface-variant">
          {units.length} unidades · {units.filter((u) => u.status === "active").length} activas
        </span>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Create */}
        <div className="border border-outline-variant rounded-lg p-4 bg-surface-container-lowest">
          <h2 className="font-bold mb-3">Nueva unidad</h2>
          <div className="flex flex-wrap gap-3 items-end">
            <label className="flex flex-col gap-1">
              <span className="text-label-md text-outline">Código</span>
              <input
                value={draft.code}
                placeholder="TX-211"
                onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value }))}
                className="h-11 px-3 rounded-lg bg-surface-container-low border-2 border-transparent focus:border-primary outline-none w-40"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-label-md text-outline">Placa</span>
              <input
                value={draft.plate}
                placeholder="SJB-1211"
                onChange={(e) => setDraft((d) => ({ ...d, plate: e.target.value }))}
                className="h-11 px-3 rounded-lg bg-surface-container-low border-2 border-transparent focus:border-primary outline-none w-40"
              />
            </label>
            <button
              onClick={createUnit}
              className="h-11 px-5 bg-primary text-on-primary rounded-lg font-bold"
            >
              ＋ Crear
            </button>
          </div>
          {status && <p className="text-sm text-primary mt-2">{status}</p>}
        </div>

        {/* List */}
        <div className="border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest">
          <div className="grid grid-cols-[0.8fr_1fr_1.4fr_1.4fr_1fr_auto] gap-3 px-4 py-2 bg-surface-container text-label-md font-bold text-on-surface-variant uppercase tracking-wide">
            <span>Código</span>
            <span>Placa</span>
            <span>Ruta</span>
            <span>Conductor</span>
            <span>Estado</span>
            <span></span>
          </div>
          {units.length === 0 && (
            <p className="px-4 py-6 text-sm text-outline">No hay unidades todavía.</p>
          )}
          {units.map((u) => {
            const route = routes.find((r) => r.id === u.route_id);
            return (
              <div
                key={u.id}
                className="grid grid-cols-[0.8fr_1fr_1.4fr_1.4fr_1fr_auto] gap-3 px-4 py-2 items-center border-t border-outline-variant"
              >
                <input
                  defaultValue={u.code}
                  onBlur={(e) =>
                    e.target.value !== u.code && updateUnit(u.id, { code: e.target.value })
                  }
                  className="bg-transparent font-bold outline-none focus:bg-surface-container-low rounded px-1"
                />
                <input
                  defaultValue={u.plate ?? ""}
                  onBlur={(e) => updateUnit(u.id, { plate: e.target.value || null })}
                  className="bg-transparent text-sm outline-none focus:bg-surface-container-low rounded px-1"
                />
                <select
                  value={u.route_id ?? ""}
                  onChange={(e) => updateUnit(u.id, { route_id: e.target.value || null })}
                  className="bg-surface-container-low rounded px-2 py-1 text-sm min-w-0"
                >
                  <option value="">— sin ruta</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.code} · {r.name}
                    </option>
                  ))}
                </select>
                <select
                  value={u.driver_id ?? ""}
                  onChange={(e) => assignDriver(u.id, e.target.value || null)}
                  className="bg-surface-container-low rounded px-2 py-1 text-sm min-w-0"
                >
                  <option value="">— sin conductor</option>
                  {drivers.map((dr) => (
                    <option key={dr.id} value={dr.id}>
                      {dr.full_name}
                    </option>
                  ))}
                </select>
                <select
                  value={u.status}
                  onChange={(e) => updateUnit(u.id, { status: e.target.value })}
                  className="bg-surface-container-low rounded px-2 py-1 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => deleteUnit(u.id)}
                  className="text-error px-2"
                  aria-label="Borrar"
                >
                  ✕
                </button>
                <span className="col-span-full text-label-md text-outline -mt-1">
                  {route ? `Ruta: ${route.name}` : "Sin ruta asignada"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
