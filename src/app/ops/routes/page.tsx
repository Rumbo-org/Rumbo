"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import RouteEditorMap, { type EditorStop } from "@/components/RouteEditorMap";
import type { Route } from "@/lib/supabase/types";

const PALETTE = ["#8f00ff", "#00584b", "#bc0100", "#003ec7", "#f9a825"];

export default function RouteManagementPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stops, setStops] = useState<EditorStop[]>([]);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ code: "", name: "", color: PALETTE[0] });
  const [status, setStatus] = useState("");

  const selected = routes.find((r) => r.id === selectedId) ?? null;

  const loadRoutes = useCallback(async () => {
    const { data } = await supabase.from("routes").select("*").order("code");
    if (data) setRoutes(data);
    return data ?? [];
  }, []);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  // Load stops when selection changes.
  useEffect(() => {
    if (!selectedId) {
      setStops([]);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("stops")
        .select("id, name, lat, lng, sequence")
        .eq("route_id", selectedId)
        .order("sequence");
      if (data) setStops(data as EditorStop[]);
    })();
  }, [selectedId]);

  // ---- Route CRUD ----
  async function createRoute() {
    if (!draft.code.trim() || !draft.name.trim()) {
      setStatus("Código y nombre son obligatorios");
      return;
    }
    const { data, error } = await supabase
      .from("routes")
      .insert({ code: draft.code.trim(), name: draft.name.trim(), color: draft.color })
      .select()
      .single();
    if (error) {
      setStatus(`Error: ${error.message}`);
      return;
    }
    await loadRoutes();
    setSelectedId(data!.id);
    setCreating(false);
    setDraft({ code: "", name: "", color: PALETTE[0] });
    setStatus(`Ruta ${data!.code} creada — hacé clic en el mapa para agregar paradas`);
  }

  async function updateRouteField(field: "name" | "color", value: string) {
    if (!selectedId) return;
    setRoutes((prev) =>
      prev.map((r) => (r.id === selectedId ? { ...r, [field]: value } : r))
    );
    const payload = field === "name" ? { name: value } : { color: value };
    await supabase.from("routes").update(payload).eq("id", selectedId);
  }

  async function deleteRoute() {
    if (!selectedId) return;
    if (!confirm(`¿Borrar la ruta ${selected?.code} y todas sus paradas?`)) return;
    await supabase.from("routes").delete().eq("id", selectedId);
    setSelectedId(null);
    await loadRoutes();
    setStatus("Ruta eliminada");
  }

  // ---- Stops ----
  async function addStop(lat: number, lng: number) {
    if (!selectedId) {
      setStatus("Seleccioná o creá una ruta antes de agregar paradas");
      return;
    }
    const sequence = stops.length + 1;
    const name = `Parada ${sequence}`;
    const { data, error } = await supabase
      .from("stops")
      .insert({ route_id: selectedId, name, lat, lng, sequence })
      .select("id, name, lat, lng, sequence")
      .single();
    if (error) {
      setStatus(`Error: ${error.message}`);
      return;
    }
    setStops((prev) => [...prev, data as EditorStop]);
    setStatus(`${name} agregada`);
  }

  async function renameStop(index: number, name: string) {
    const s = stops[index];
    setStops((prev) => prev.map((x, i) => (i === index ? { ...x, name } : x)));
    if (s.id) await supabase.from("stops").update({ name }).eq("id", s.id);
  }

  async function moveStop(index: number, lat: number, lng: number) {
    const s = stops[index];
    setStops((prev) => prev.map((x, i) => (i === index ? { ...x, lat, lng } : x)));
    if (s.id) await supabase.from("stops").update({ lat, lng }).eq("id", s.id);
  }

  // Renumber sequence to be contiguous and persist changed rows.
  async function persistOrder(next: EditorStop[]) {
    const renumbered = next.map((s, i) => ({ ...s, sequence: i + 1 }));
    setStops(renumbered);
    await Promise.all(
      renumbered
        .filter((s) => s.id)
        .map((s) => supabase.from("stops").update({ sequence: s.sequence }).eq("id", s.id!))
    );
  }

  async function deleteStop(index: number) {
    const s = stops[index];
    const next = stops.filter((_, i) => i !== index);
    if (s.id) await supabase.from("stops").delete().eq("id", s.id);
    await persistOrder(next);
  }

  function moveRow(index: number, dir: -1 | 1) {
    const j = index + dir;
    if (j < 0 || j >= stops.length) return;
    const next = [...stops];
    [next[index], next[j]] = [next[j], next[index]];
    persistOrder(next);
  }

  const editorColor = selected?.color ?? PALETTE[0];

  return (
    <>
      <header className="h-16 shrink-0 border-b border-outline-variant bg-surface/80 backdrop-blur flex items-center justify-between px-8">
        <h1 className="text-headline-md font-extrabold text-primary">
          Gestión de Rutas
        </h1>
        <button
          onClick={() => {
            setCreating(true);
            setSelectedId(null);
          }}
          className="bg-primary text-on-primary px-4 py-2 rounded-lg font-bold"
        >
          ＋ Nueva ruta
        </button>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Left config panel */}
        <aside className="w-[380px] shrink-0 bg-surface-container-low border-r border-outline-variant overflow-y-auto p-5 space-y-5">
          {/* Routes list */}
          <div>
            <h2 className="text-label-lg font-bold mb-2">Rutas</h2>
            <div className="space-y-1">
              {routes.length === 0 && (
                <p className="text-sm text-outline">Todavía no hay rutas.</p>
              )}
              {routes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedId(r.id);
                    setCreating(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    r.id === selectedId
                      ? "bg-primary text-on-primary"
                      : "hover:bg-surface-container-high"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: r.color }}
                  />
                  <span className="font-bold">{r.code}</span>
                  <span
                    className={`text-sm truncate ${
                      r.id === selectedId ? "text-on-primary/80" : "text-on-surface-variant"
                    }`}
                  >
                    {r.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* New route form */}
          {creating && (
            <div className="border border-outline-variant rounded-lg p-4 space-y-3 bg-surface">
              <h3 className="font-bold">Nueva ruta</h3>
              <input
                placeholder="Código (ej. C-N)"
                value={draft.code}
                onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value }))}
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low border-2 border-transparent focus:border-primary outline-none"
              />
              <input
                placeholder="Nombre (ej. San José – Heredia)"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="w-full h-11 px-3 rounded-lg bg-surface-container-low border-2 border-transparent focus:border-primary outline-none"
              />
              <ColorPicker
                value={draft.color}
                onChange={(c) => setDraft((d) => ({ ...d, color: c }))}
              />
              <div className="flex gap-2">
                <button
                  onClick={createRoute}
                  className="flex-1 h-11 bg-primary text-on-primary rounded-lg font-bold"
                >
                  Crear ruta
                </button>
                <button
                  onClick={() => setCreating(false)}
                  className="h-11 px-4 rounded-lg border border-outline-variant"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Selected route editor */}
          {selected && (
            <div className="border border-outline-variant rounded-lg p-4 space-y-4 bg-surface">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Editar {selected.code}</h3>
                <button
                  onClick={deleteRoute}
                  className="text-sm text-error font-semibold hover:underline"
                >
                  Borrar ruta
                </button>
              </div>
              <label className="block">
                <span className="text-label-md text-outline">Nombre</span>
                <input
                  value={selected.name}
                  onChange={(e) => updateRouteField("name", e.target.value)}
                  className="w-full h-11 px-3 mt-1 rounded-lg bg-surface-container-low border-2 border-transparent focus:border-primary outline-none"
                />
              </label>
              <div>
                <span className="text-label-md text-outline">Color</span>
                <ColorPicker
                  value={selected.color}
                  onChange={(c) => updateRouteField("color", c)}
                />
              </div>

              {/* Stops */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-label-lg font-bold">
                    Paradas ({stops.length})
                  </span>
                </div>
                <p className="text-label-md text-outline mb-2">
                  📍 Hacé clic en el mapa para agregar. Arrastrá un marcador para
                  moverlo.
                </p>
                <ol className="space-y-1">
                  {stops.map((s, i) => (
                    <li
                      key={s.id ?? i}
                      className="flex items-center gap-2 bg-surface-container-low rounded-lg px-2 py-1.5"
                    >
                      <span
                        className="w-5 h-5 shrink-0 rounded-full text-white text-[11px] font-bold flex items-center justify-center"
                        style={{ backgroundColor: editorColor }}
                      >
                        {i + 1}
                      </span>
                      <input
                        value={s.name}
                        onChange={(e) => renameStop(i, e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none min-w-0"
                      />
                      <button
                        onClick={() => moveRow(i, -1)}
                        disabled={i === 0}
                        className="text-outline disabled:opacity-30 px-1"
                        aria-label="Subir"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveRow(i, 1)}
                        disabled={i === stops.length - 1}
                        className="text-outline disabled:opacity-30 px-1"
                        aria-label="Bajar"
                      >
                        ▼
                      </button>
                      <button
                        onClick={() => deleteStop(i)}
                        className="text-error px-1"
                        aria-label="Borrar parada"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                  {stops.length === 0 && (
                    <li className="text-sm text-outline">
                      Sin paradas. Hacé clic en el mapa.
                    </li>
                  )}
                </ol>
              </div>
            </div>
          )}

          {!selected && !creating && (
            <p className="text-sm text-outline">
              Seleccioná una ruta para editarla o creá una nueva.
            </p>
          )}

          {status && <p className="text-sm text-primary">{status}</p>}
        </aside>

        {/* Map */}
        <div className="flex-1 relative map-grid">
          <RouteEditorMap
            stops={stops}
            routeColor={editorColor}
            onAddStop={addStop}
            onMoveStop={moveStop}
            className="absolute inset-0"
          />
          {!selected && !creating && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-surface/90 backdrop-blur px-5 py-3 rounded-lg shadow border border-outline-variant text-on-surface-variant">
                Seleccioná o creá una ruta para empezar a poner paradas
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex gap-2 mt-1">
      {PALETTE.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`w-7 h-7 rounded-full border-2 ${
            value === c ? "border-on-surface" : "border-transparent"
          }`}
          style={{ backgroundColor: c }}
          aria-label={`Color ${c}`}
        />
      ))}
    </div>
  );
}
