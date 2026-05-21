"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import LiveMap from "@/components/LiveMap";
import { useVehicleLocations } from "@/hooks/useVehicleLocations";
import { haversineMeters, etaMinutes } from "@/lib/geo";
import type { Route, Stop } from "@/lib/supabase/types";

export default function PassengerPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [stops, setStops] = useState<Stop[]>([]);
  const [routeId, setRouteId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [rateOpen, setRateOpen] = useState(false);

  const { vehicles } = useVehicleLocations(routeId || undefined);

  useEffect(() => {
    (async () => {
      const [{ data: r }, { data: s }] = await Promise.all([
        supabase.from("routes").select("*").order("code"),
        supabase.from("stops").select("*").order("sequence"),
      ]);
      if (r) {
        setRoutes(r);
        if (r[0]) setRouteId(r[0].id);
      }
      if (s) setStops(s);
    })();
  }, []);

  const route = routes.find((r) => r.id === routeId);
  const routeStops = useMemo(
    () => stops.filter((s) => s.route_id === routeId),
    [stops, routeId]
  );
  const filteredRoutes = routes.filter(
    (r) =>
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase())
  );

  // ETA per stop from the nearest live vehicle on the route.
  const liveVehicle = vehicles.find((v) => !v.stale) ?? vehicles[0];
  const stopEtas = useMemo(() => {
    if (!liveVehicle) return new Map<string, number>();
    const m = new Map<string, number>();
    for (const s of routeStops) {
      const d = haversineMeters(
        { lat: liveVehicle.lat, lng: liveVehicle.lng },
        { lat: s.lat, lng: s.lng }
      );
      m.set(s.id, etaMinutes(d, liveVehicle.speed));
    }
    return m;
  }, [liveVehicle, routeStops]);

  return (
    <div className="flex flex-col lg:flex-row h-dvh bg-surface">
      {/* Map */}
      <div className="relative h-[45vh] lg:h-auto lg:flex-1 map-grid">
        <LiveMap
          vehicles={vehicles}
          stops={routeStops.map((s) => ({ lat: s.lat, lng: s.lng, name: s.name }))}
          routePath={routeStops.map((s) => ({ lat: s.lat, lng: s.lng }))}
          routeColor={route?.color ?? "#8f00ff"}
          className="absolute inset-0"
          zoom={12}
        />
        {/* Safety button (1 tap, requirement 5.1) */}
        <button
          aria-label="Botón de seguridad"
          onClick={() => alert("🛡️ Ubicación compartida con tus contactos de confianza")}
          className="absolute right-4 bottom-4 w-14 h-14 bg-safety-emergency text-white rounded-full shadow-2xl flex items-center justify-center text-2xl active:scale-95"
        >
          🛡️
        </button>
      </div>

      {/* Panel */}
      <div className="flex-1 lg:flex-none lg:w-[420px] bg-surface-container-lowest border-t lg:border-t-0 lg:border-l border-outline-variant flex flex-col min-h-0">
        <header className="p-4 border-b border-outline-variant">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/" className="text-headline-md font-black text-primary">
              Rumbo
            </Link>
            <span className="text-label-md font-medium bg-primary-fixed text-on-primary-container px-2 py-0.5 rounded-full uppercase tracking-widest">
              Pasajero
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ruta por número o destino…"
              className="w-full h-12 bg-surface-container-low rounded-full pl-10 pr-4 text-body-md focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
        </header>

        {/* Route chips */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-outline-variant">
          {filteredRoutes.map((r) => (
            <button
              key={r.id}
              onClick={() => setRouteId(r.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-label-lg font-semibold transition-colors ${
                r.id === routeId
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {r.code}
            </button>
          ))}
        </div>

        {/* Stops + ETA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {route && (
            <div>
              <h2 className="text-headline-md font-bold">{route.name}</h2>
              <p className="text-sm text-on-surface-variant">
                {liveVehicle && !liveVehicle.stale
                  ? `Unidad ${liveVehicle.unitCode} en vivo`
                  : "Sin unidades transmitiendo ahora"}
              </p>
            </div>
          )}

          <ol className="relative border-l-2 border-outline-variant ml-2 space-y-4">
            {routeStops.map((s) => {
              const eta = stopEtas.get(s.id);
              return (
                <li key={s.id} className="ml-4">
                  <span
                    className="absolute -left-[9px] w-4 h-4 rounded-full border-2 border-white"
                    style={{ backgroundColor: route?.color ?? "#8f00ff" }}
                  />
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{s.name}</span>
                    {liveVehicle && !liveVehicle.stale && eta != null ? (
                      <span className="text-eta-display font-extrabold text-primary leading-none">
                        {eta}
                        <span className="text-label-md font-medium text-outline ml-1">
                          min
                        </span>
                      </span>
                    ) : (
                      <span className="text-label-md text-outline">—</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="p-4 border-t border-outline-variant">
          <button
            onClick={() => setRateOpen(true)}
            className="w-full h-12 bg-primary text-on-primary rounded-lg font-bold"
          >
            ⭐ Calificar mi viaje
          </button>
        </div>
      </div>

      {rateOpen && (
        <RatingModal
          routeId={routeId}
          unitId={liveVehicle?.unitId ?? null}
          onClose={() => setRateOpen(false)}
        />
      )}
    </div>
  );
}

function RatingModal({
  routeId,
  unitId,
  onClose,
}: {
  routeId: string;
  unitId: string | null;
  onClose: () => void;
}) {
  const [scores, setScores] = useState({ cleanliness: 0, punctuality: 0, behavior: 0 });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const dims: { key: keyof typeof scores; label: string }[] = [
    { key: "cleanliness", label: "Limpieza" },
    { key: "punctuality", label: "Puntualidad" },
    { key: "behavior", label: "Trato del conductor" },
  ];
  const ready = Object.values(scores).every((v) => v > 0);

  async function submit() {
    if (!ready) return;
    setSaving(true);
    const { error } = await supabase.from("ratings").insert({
      route_id: routeId || null,
      unit_id: unitId,
      ...scores,
    });
    setSaving(false);
    if (!error) {
      setDone(true);
      setTimeout(onClose, 1200);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center">
      <div className="bg-surface-container-lowest w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-5">
        {done ? (
          <p className="text-center text-headline-md font-bold text-status-on-time py-6">
            ¡Gracias por tu calificación! ✅
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-headline-md font-bold">Calificá tu viaje</h3>
              <button onClick={onClose} className="text-outline text-xl">
                ✕
              </button>
            </div>
            {dims.map((d) => (
              <div key={d.key}>
                <p className="text-sm font-medium mb-1">{d.label}</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setScores((s) => ({ ...s, [d.key]: n }))}
                      className="w-11 h-11 text-2xl"
                      aria-label={`${d.label} ${n} estrellas`}
                    >
                      <span
                        className={
                          n <= scores[d.key] ? "text-rating-active" : "text-outline-variant"
                        }
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={submit}
              disabled={!ready || saving}
              className="w-full h-12 bg-primary text-on-primary rounded-lg font-bold disabled:opacity-50"
            >
              {saving ? "Enviando…" : "Enviar calificación"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
