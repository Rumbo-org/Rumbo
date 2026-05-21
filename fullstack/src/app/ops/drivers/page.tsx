"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Driver, Unit } from "@/lib/supabase/types";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [draft, setDraft] = useState({ full_name: "", phone: "", license_no: "" });
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    const [{ data: d }, { data: u }] = await Promise.all([
      supabase.from("drivers").select("*").order("full_name"),
      supabase.from("units").select("*").order("code"),
    ]);
    if (d) setDrivers(d);
    if (u) setUnits(u);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createDriver() {
    if (!draft.full_name.trim()) {
      setStatus("El nombre es obligatorio");
      return;
    }
    const { error } = await supabase.from("drivers").insert({
      full_name: draft.full_name.trim(),
      phone: draft.phone.trim() || null,
      license_no: draft.license_no.trim() || null,
    });
    if (error) return setStatus(`Error: ${error.message}`);
    setDraft({ full_name: "", phone: "", license_no: "" });
    setStatus("Conductor creado");
    load();
  }

  async function updateDriver(id: string, payload: Partial<Driver>) {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, ...payload } : d)));
    await supabase.from("drivers").update(payload).eq("id", id);
  }

  async function deleteDriver(id: string) {
    if (!confirm("¿Borrar este conductor?")) return;
    await supabase.from("drivers").delete().eq("id", id);
    load();
  }

  const unitForDriver = (driverId: string) =>
    units.find((u) => u.driver_id === driverId) ?? null;

  return (
    <>
      <header className="h-16 shrink-0 border-b border-outline-variant bg-surface/80 backdrop-blur flex items-center px-8">
        <h1 className="text-headline-md font-extrabold text-primary">Conductores</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Create */}
        <div className="border border-outline-variant rounded-lg p-4 bg-surface-container-lowest">
          <h2 className="font-bold mb-3">Nuevo conductor</h2>
          <div className="flex flex-wrap gap-3 items-end">
            <Field label="Nombre completo">
              <input
                value={draft.full_name}
                onChange={(e) => setDraft((d) => ({ ...d, full_name: e.target.value }))}
                className="h-11 px-3 rounded-lg bg-surface-container-low border-2 border-transparent focus:border-primary outline-none w-56"
              />
            </Field>
            <Field label="Teléfono">
              <input
                value={draft.phone}
                onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                className="h-11 px-3 rounded-lg bg-surface-container-low border-2 border-transparent focus:border-primary outline-none w-40"
              />
            </Field>
            <Field label="Licencia">
              <input
                value={draft.license_no}
                onChange={(e) => setDraft((d) => ({ ...d, license_no: e.target.value }))}
                className="h-11 px-3 rounded-lg bg-surface-container-low border-2 border-transparent focus:border-primary outline-none w-40"
              />
            </Field>
            <button
              onClick={createDriver}
              className="h-11 px-5 bg-primary text-on-primary rounded-lg font-bold"
            >
              ＋ Crear
            </button>
          </div>
          {status && <p className="text-sm text-primary mt-2">{status}</p>}
        </div>

        {/* List */}
        <div className="border border-outline-variant rounded-lg overflow-hidden bg-surface-container-lowest">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr_auto] gap-3 px-4 py-2 bg-surface-container text-label-md font-bold text-on-surface-variant uppercase tracking-wide">
            <span>Nombre</span>
            <span>Teléfono</span>
            <span>Licencia</span>
            <span>Unidad asignada</span>
            <span>Estado</span>
            <span></span>
          </div>
          {drivers.length === 0 && (
            <p className="px-4 py-6 text-sm text-outline">No hay conductores todavía.</p>
          )}
          {drivers.map((d) => {
            const unit = unitForDriver(d.id);
            return (
              <div
                key={d.id}
                className="grid grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr_auto] gap-3 px-4 py-2 items-center border-t border-outline-variant"
              >
                <input
                  defaultValue={d.full_name}
                  onBlur={(e) =>
                    e.target.value !== d.full_name &&
                    updateDriver(d.id, { full_name: e.target.value })
                  }
                  className="bg-transparent font-semibold outline-none focus:bg-surface-container-low rounded px-1"
                />
                <input
                  defaultValue={d.phone ?? ""}
                  onBlur={(e) => updateDriver(d.id, { phone: e.target.value || null })}
                  className="bg-transparent text-sm outline-none focus:bg-surface-container-low rounded px-1"
                />
                <input
                  defaultValue={d.license_no ?? ""}
                  onBlur={(e) => updateDriver(d.id, { license_no: e.target.value || null })}
                  className="bg-transparent text-sm outline-none focus:bg-surface-container-low rounded px-1"
                />
                <span className="text-sm">
                  {unit ? (
                    <span className="font-semibold">
                      {unit.code}{" "}
                      <span className="text-outline font-normal">{unit.plate}</span>
                    </span>
                  ) : (
                    <span className="text-outline">— sin asignar</span>
                  )}
                </span>
                <select
                  value={d.status}
                  onChange={(e) => updateDriver(d.id, { status: e.target.value })}
                  className="bg-surface-container-low rounded px-2 py-1 text-sm"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
                <button
                  onClick={() => deleteDriver(d.id)}
                  className="text-error px-2"
                  aria-label="Borrar"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
        <p className="text-sm text-outline">
          La asignación conductor → unidad se hace desde{" "}
          <a href="/ops/fleet" className="text-primary underline">
            Flota
          </a>
          .
        </p>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-label-md text-outline">{label}</span>
      {children}
    </label>
  );
}
