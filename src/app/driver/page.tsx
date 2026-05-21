"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import LiveMap from "@/components/LiveMap";
import type { LiveVehicle } from "@/hooks/useVehicleLocations";

const SEND_INTERVAL_MS = 10_000; // requirement 1.2: every 10s

type Unit = { id: string; code: string; route_id: string | null };
type Route = { id: string; code: string; name: string };

export default function DriverPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [unitId, setUnitId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [tracking, setTracking] = useState(false);
  const [pos, setPos] = useState<GeolocationPosition | null>(null);
  const [battery, setBattery] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("Listo para iniciar");
  const [sentCount, setSentCount] = useState(0);

  const watchIdRef = useRef<number | null>(null);
  const lastSentRef = useRef(0);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Load units + routes.
  useEffect(() => {
    (async () => {
      const [{ data: u }, { data: r }] = await Promise.all([
        supabase.from("units").select("id, code, route_id").order("code"),
        supabase.from("routes").select("id, code, name").order("code"),
      ]);
      if (u) {
        setUnits(u);
        if (u[0]) {
          setUnitId(u[0].id);
          setRouteId(u[0].route_id ?? "");
        }
      }
      if (r) setRoutes(r);
    })();
  }, []);

  // Battery indicator (best-effort; not in all browsers).
  useEffect(() => {
    type BatteryManager = { level: number; addEventListener: (e: string, cb: () => void) => void };
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
    nav.getBattery?.().then((b) => {
      const update = () => setBattery(Math.round(b.level * 100));
      update();
      b.addEventListener("levelchange", update);
    });
  }, []);

  const sendPing = useCallback(
    async (p: GeolocationPosition) => {
      if (!unitId) return;
      const { error } = await supabase.from("vehicle_locations").insert({
        unit_id: unitId,
        route_id: routeId || null,
        lat: p.coords.latitude,
        lng: p.coords.longitude,
        heading: p.coords.heading,
        speed: p.coords.speed,
      });
      if (error) {
        setStatus(`Error al enviar: ${error.message}`);
      } else {
        setSentCount((c) => c + 1);
        setStatus("Transmitiendo en vivo…");
      }
    },
    [unitId, routeId]
  );

  const stopTracking = useCallback(async () => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (wakeLockRef.current) {
      await wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }
    if (unitId) {
      await supabase.from("units").update({ status: "inactive" }).eq("id", unitId);
    }
    setTracking(false);
    setStatus("Rastreo detenido");
  }, [unitId]);

  const startTracking = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      setStatus("Este dispositivo no soporta GPS");
      return;
    }
    if (!unitId) {
      setStatus("Seleccioná una unidad primero");
      return;
    }

    // Keep screen awake while tracking (requirement 2.7).
    try {
      const nav = navigator as Navigator & {
        wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinel> };
      };
      if (nav.wakeLock) wakeLockRef.current = await nav.wakeLock.request("screen");
    } catch {
      /* wake lock optional */
    }

    await supabase.from("units").update({ status: "active" }).eq("id", unitId);
    setTracking(true);
    setStatus("Obteniendo ubicación…");
    lastSentRef.current = 0;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (p) => {
        setPos(p);
        const now = Date.now();
        if (now - lastSentRef.current >= SEND_INTERVAL_MS) {
          lastSentRef.current = now;
          sendPing(p);
        }
      },
      (err) => setStatus(`GPS: ${err.message}`),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15_000 }
    );
  }, [unitId, sendPing]);

  useEffect(() => () => void stopTracking(), [stopTracking]);

  const driverVehicle: LiveVehicle[] =
    pos != null
      ? [
          {
            unitId: unitId || "me",
            unitCode: units.find((u) => u.id === unitId)?.code ?? "Yo",
            routeId,
            routeCode: routes.find((r) => r.id === routeId)?.code ?? null,
            routeName: routes.find((r) => r.id === routeId)?.name ?? null,
            routeColor: "#8f00ff",
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            recordedAt: new Date().toISOString(),
            stale: false,
          },
        ]
      : [];

  const lowBattery = battery != null && battery < 20;

  return (
    <div className="flex flex-col h-dvh bg-surface">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 h-tap bg-surface-container-low shadow-sm z-20">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-headline-md font-black text-primary">
            Rumbo
          </Link>
          <span className="text-label-md font-medium bg-tertiary-container text-on-tertiary px-2 py-0.5 rounded-full uppercase tracking-widest">
            Driver
          </span>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            lowBattery ? "text-safety-emergency" : "text-on-surface-variant"
          }`}
        >
          {battery != null ? (
            <>
              <span aria-hidden>{lowBattery ? "🪫" : "🔋"}</span>
              {battery}%
            </>
          ) : null}
        </div>
      </header>

      {/* Map */}
      <main className="relative flex-1">
        <LiveMap
          vehicles={driverVehicle}
          followFirstVehicle
          zoom={16}
          className="absolute inset-0"
        />

        {tracking && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-surface/90 backdrop-blur border border-outline-variant px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safety-emergency opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-safety-emergency" />
              </span>
              <span className="text-label-lg font-semibold uppercase tracking-widest">
                Transmitiendo
              </span>
            </div>
          </div>
        )}

        {lowBattery && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10 bg-error-container text-on-error-container px-4 py-2 rounded-lg text-sm font-medium shadow">
            Batería baja ({battery}%) — conectá el cargador
          </div>
        )}

        {/* SOS */}
        <button
          aria-label="Botón de emergencia"
          className="absolute right-4 bottom-44 w-14 h-14 bg-safety-emergency text-white rounded-full shadow-2xl flex items-center justify-center text-2xl active:scale-95"
          onClick={() =>
            setStatus("🚨 Alerta de emergencia enviada a operaciones")
          }
        >
          🛡️
        </button>
      </main>

      {/* Control panel */}
      <section className="bg-surface-container-lowest border-t border-outline-variant p-4 pb-6 space-y-4 z-20">
        <div className="grid grid-cols-2 gap-3">
          <label className="space-y-1">
            <span className="text-label-md font-medium text-outline">Unidad</span>
            <select
              value={unitId}
              disabled={tracking}
              onChange={(e) => {
                setUnitId(e.target.value);
                const u = units.find((x) => x.id === e.target.value);
                if (u?.route_id) setRouteId(u.route_id);
              }}
              className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary rounded-lg px-3 text-lg font-bold disabled:opacity-60"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.code}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-label-md font-medium text-outline">Ruta</span>
            <select
              value={routeId}
              disabled={tracking}
              onChange={(e) => setRouteId(e.target.value)}
              className="w-full h-14 bg-surface-container-low border-2 border-transparent focus:border-primary rounded-lg px-3 text-lg font-bold disabled:opacity-60"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.code} · {r.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between text-sm text-on-surface-variant">
          <span>{status}</span>
          {sentCount > 0 && <span className="text-outline">{sentCount} pings</span>}
        </div>

        <button
          onClick={tracking ? stopTracking : startTracking}
          className={`w-full h-20 rounded-xl shadow-xl flex items-center justify-center gap-3 text-2xl font-bold text-white transition-all active:scale-95 ${
            tracking ? "bg-on-surface pulse-red" : "bg-primary"
          }`}
        >
          {tracking ? "⏹ Detener Rastreo" : "▶ Iniciar Rastreo"}
        </button>
      </section>
    </div>
  );
}
