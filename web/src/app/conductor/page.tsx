"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Radio,
  MapPin,
  Battery,
  Wifi,
  WifiOff,
  ChevronDown,
  Bus,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

const ROUTES = ["1 - San José – Alajuela", "200 - San José – Pavas", "330 - San José – Escazú", "400 - San José – Zapote"];
const UNITS = ["Bus 1042", "Bus 1073", "Bus 1098", "Bus 1155", "Bus 1202"];

export default function ConductorPage() {
  const [tracking, setTracking] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(ROUTES[0]);
  const [selectedUnit, setSelectedUnit] = useState(UNITS[0]);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [transmissions, setTransmissions] = useState(0);
  const [connected, setConnected] = useState(true);
  const [battery, setBattery] = useState(78);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const wakeLock = useRef<WakeLockSentinel | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Request wake lock when tracking starts
  useEffect(() => {
    if (!tracking) {
      wakeLock.current?.release().catch(() => {});
      return;
    }
    if ("wakeLock" in navigator) {
      navigator.wakeLock.request("screen").then((lock) => {
        wakeLock.current = lock;
      }).catch(() => {});
    }
    return () => {
      wakeLock.current?.release().catch(() => {});
    };
  }, [tracking]);

  // GPS tracking simulation
  useEffect(() => {
    if (!tracking) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      return;
    }

    // Request real geolocation
    let watchId: number | null = null;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGpsAccuracy(Math.round(pos.coords.accuracy));
        },
        () => {
          // Simulate position for demo
          setPosition({ lat: 9.9281 + (Math.random() - 0.5) * 0.01, lng: -84.0907 + (Math.random() - 0.5) * 0.01 });
          setGpsAccuracy(Math.round(8 + Math.random() * 15));
        },
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    }

    // Simulate transmissions every 10s
    intervalRef.current = setInterval(() => {
      setTransmissions((t) => t + 1);
      setConnected(Math.random() > 0.05);
      // Simulate GPS accuracy varying
      setGpsAccuracy((prev) => {
        if (prev === null) return 12;
        return Math.max(4, Math.min(30, prev + (Math.random() - 0.5) * 5));
      });
    }, 10000);

    // Elapsed timer
    elapsedRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [tracking]);

  // Simulate battery drain
  useEffect(() => {
    if (!tracking) return;
    const t = setInterval(() => setBattery((b) => Math.max(0, b - 0.1)), 60000);
    return () => clearInterval(t);
  }, [tracking]);

  const formatElapsed = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const batteryColor =
    battery < 20 ? "#eb0000" : battery < 40 ? "#c66b00" : "#1b6b43";

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ background: tracking ? "#0d0d14" : "#f9f9fc" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-4 pt-safe"
        style={{ background: tracking ? "#111120" : "#6e00c7" }}
      >
        <Link href="/pasajero" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <ArrowLeft size={20} className="text-white" />
        </Link>
        <div className="flex-1">
          <h1 className="text-white font-bold text-lg leading-tight">Rumbo Driver</h1>
          <p className="text-white/60 text-xs">Interfaz del conductor</p>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <Wifi size={16} className="text-[#44ddc1]" />
          ) : (
            <WifiOff size={16} className="text-[#eb0000]" />
          )}
          <div className="flex items-center gap-1">
            <Battery size={16} style={{ color: batteryColor }} />
            <span className="text-xs font-medium" style={{ color: batteryColor }}>
              {Math.round(battery)}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Battery warning */}
        {battery < 20 && (
          <div className="flex items-center gap-2 bg-[#ffdad6] rounded-xl p-3">
            <AlertTriangle size={16} className="text-[#ba1a1a] shrink-0" />
            <p className="text-xs font-semibold text-[#ba1a1a]">
              Batería baja ({Math.round(battery)}%). Conecte el cargador.
            </p>
          </div>
        )}

        {/* Route + Unit selectors */}
        {!tracking && (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-[#4d4356] uppercase tracking-wider mb-1.5 block">
                Ruta
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-white border border-[#cfc2d9] rounded-xl px-4 py-3.5 text-sm font-medium text-[#1a1c1e] outline-none focus:border-[#6e00c7]"
                  value={selectedRoute}
                  onChange={(e) => setSelectedRoute(e.target.value)}
                >
                  {ROUTES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e7388] pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#4d4356] uppercase tracking-wider mb-1.5 block">
                Unidad
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-white border border-[#cfc2d9] rounded-xl px-4 py-3.5 text-sm font-medium text-[#1a1c1e] outline-none focus:border-[#6e00c7]"
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                >
                  {UNITS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e7388] pointer-events-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Status when tracking */}
        {tracking && (
          <div className="space-y-3">
            {/* Main status */}
            <div className="rounded-2xl p-4 border border-[#1b3a2e]" style={{ background: "#0d1f17" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#44ddc1] animate-pulse" />
                <span className="text-[#44ddc1] font-semibold text-sm">TRANSMITIENDO EN VIVO</span>
              </div>
              <p className="text-3xl font-bold text-white font-mono">
                {formatElapsed(elapsed)}
              </p>
              <p className="text-[#44ddc1]/60 text-xs mt-1">
                {transmissions} transmisiones · cada 10s
              </p>
            </div>

            {/* Route info */}
            <div
              className="rounded-2xl p-4 border"
              style={{ background: "#111120", borderColor: "#1e1e3a" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Bus size={16} className="text-[#dab9ff]" />
                <span className="text-white font-semibold text-sm">{selectedUnit}</span>
              </div>
              <p className="text-[#7e7388] text-xs mb-3">{selectedRoute}</p>

              {position && (
                <div className="flex items-center gap-1.5 text-xs text-[#7e7388]">
                  <MapPin size={12} className="text-[#dab9ff]" />
                  <span>
                    {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
                  </span>
                  {gpsAccuracy !== null && (
                    <span className="ml-auto text-[#44ddc1]">±{Math.round(gpsAccuracy)}m</span>
                  )}
                </div>
              )}
            </div>

            {/* Connection status */}
            <div
              className="rounded-2xl p-3 flex items-center gap-3 border"
              style={{ background: "#111120", borderColor: "#1e1e3a" }}
            >
              {connected ? (
                <>
                  <CheckCircle2 size={18} className="text-[#44ddc1] shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Conectado al servidor</p>
                    <p className="text-[#7e7388] text-xs">Última transmisión hace &lt;10s</p>
                  </div>
                </>
              ) : (
                <>
                  <WifiOff size={18} className="text-[#eb0000] shrink-0" />
                  <div>
                    <p className="text-[#eb0000] text-sm font-medium">Sin conexión</p>
                    <p className="text-[#7e7388] text-xs">Cola de datos guardada localmente</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* CTA button */}
        <button
          onClick={() => {
            setTracking((t) => !t);
            if (tracking) {
              setTransmissions(0);
              setElapsed(0);
            }
          }}
          className="w-full py-5 rounded-2xl font-bold text-lg text-white transition-all active:scale-95 flex items-center justify-center gap-3"
          style={{
            background: tracking ? "#b91c1c" : "#6e00c7",
            boxShadow: tracking
              ? "0 0 32px rgba(185, 28, 28, 0.4)"
              : "0 0 32px rgba(110, 0, 199, 0.4)",
          }}
        >
          <Radio size={22} className={tracking ? "animate-pulse" : ""} />
          {tracking ? "Detener transmisión" : "Iniciar transmisión GPS"}
        </button>

        {!tracking && (
          <p className="text-center text-xs text-[#7e7388]">
            Al iniciar, tu ubicación se transmitirá cada 10 segundos a los pasajeros de Rumbo.
          </p>
        )}
      </div>
    </div>
  );
}
