"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Search,
  Plus,
  Map,
  Navigation,
  ChevronRight,
  AlertTriangle,
  Heart,
  ArrowRight,
  MoreVertical,
  LayoutGrid,
  List,
  GraduationCap,
  MapPin,
  Globe,
  HelpCircle,
  Radio,
  Bus,
} from "lucide-react";
import type { Bus as BusType } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const SAVED_STOPS = [
  { id: 1, name: "Av. Central / Calle 1", detail: "4 rutas pasan por aquí", icon: MapPin, color: "#bc0100", bg: "#fff0f0" },
  { id: 2, name: "UCR – Entrada Principal", detail: "R-42, 501, Línea Azul", icon: GraduationCap, color: "#00584b", bg: "#e6faf7" },
];

const SAVED_ROUTES = [
  {
    id: 1, code: "R-42", name: "Circuito Ribera", path: "Puente Miraflores → Puerto Viejo",
    nextBus: 18, status: "delayed", type: null,
    codeBg: "#ffdad6", codeColor: "#ba1a1a",
  },
  {
    id: 2, code: "204", name: "Conector Ciudad", path: "Multiplaza Oeste → Distrito Tecnológico",
    nextBus: 7, status: "on_time", type: "regular",
    codeBg: "#007363", codeColor: "#69fbdf",
  },
  {
    id: 3, code: "X9", name: "Shuttle Aeropuerto", path: "Centro Ciudad → Aeropuerto Internacional",
    nextBus: 32, status: "on_time", type: "express",
    codeBg: "#8f00ff", codeColor: "#efddff",
  },
];

export default function FavoritosPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [eta, setEta] = useState(4);
  const [search, setSearch] = useState("");
  const [selectedBus, setSelectedBus] = useState<BusType | null>(null);
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserPosition({ lat: 9.9281, lng: -84.0907 })
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => (prev > 1 ? prev - 1 : prev));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = SAVED_ROUTES.filter(
    (r) =>
      search === "" ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-full bg-[#f9f9fc] text-[#1a1c1e] font-[Inter,sans-serif]">
      {/* Top Nav */}
      <header className="bg-white border-b border-[#cfc2d9] sticky top-0 z-50 h-16">
        <div className="flex justify-between items-center w-full max-w-[1280px] mx-auto px-10 h-full">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#6e00c7" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 20l8-4 8 4L12 2z" fill="white" />
                </svg>
              </div>
              <span className="text-xl font-extrabold" style={{ color: "#6e00c7" }}>Rumbo</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link href="/pasajero" className="text-sm font-medium text-[#4d4356] hover:text-[#6e00c7] transition-colors">Rutas</Link>
              <Link href="/favoritos" className="text-sm font-bold border-b-2 pb-1" style={{ color: "#6e00c7", borderColor: "#6e00c7" }}>Favoritos</Link>
              <Link href="/seguridad" className="text-sm font-medium text-[#4d4356] hover:text-[#6e00c7] transition-colors">Seguridad</Link>
              <Link href="/pasajero" className="text-sm font-medium text-[#4d4356] hover:text-[#6e00c7] transition-colors">Ajustes</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7e7388]" />
              <input
                className="h-10 pl-9 pr-4 rounded-full bg-[#eeeef0] border-none outline-none focus:ring-2 w-64 text-sm transition-all"
                style={{ focusRingColor: "#6e00c7" } as React.CSSProperties}
                placeholder="Buscar rutas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link
              href="/login"
              className="px-6 py-2 rounded-full font-bold text-white text-sm hover:opacity-90 active:scale-95 transition-all"
              style={{ background: "#6e00c7" }}
            >
              Ingresar
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-10 py-12">
        {/* Welcome */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-[32px] font-bold leading-10 tracking-tight text-[#1a1c1e]">Tus Favoritos</h1>
            <p className="text-[#4d4356] text-lg mt-2">Administra tus rutas de bus y paradas más frecuentes.</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-[#7e7388] rounded-lg font-bold text-sm hover:bg-[#f3ebff] transition-colors" style={{ color: "#6e00c7" }}>
              <Plus size={18} />
              Agregar ruta
            </button>
            <Link href="/pasajero" className="flex items-center gap-2 px-4 py-2 border border-[#7e7388] rounded-lg font-bold text-sm hover:bg-[#f3ebff] transition-colors" style={{ color: "#6e00c7" }}>
              <Map size={18} />
              Ver mapa
            </Link>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4">
          {/* Active Tracking Card — 8 cols */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-[#cfc2d9] rounded-xl p-8 shadow-sm relative overflow-hidden group">
            {/* Background decoration */}
            <div
              className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none transition-opacity group-hover:opacity-10"
              style={{
                background: "linear-gradient(135deg, #6e00c7, #8f00ff)",
              }}
            />
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none opacity-5"
              style={{ background: "#6e00c7", filter: "blur(60px)", transform: "translate(30%, -30%)" }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full font-bold text-sm text-white" style={{ background: "#6e00c7" }}>L102</span>
                <span className="text-sm text-[#4d4356]">Viaje Activo</span>
              </div>
              <h2 className="text-[32px] font-bold leading-10 tracking-tight text-[#1a1c1e] mb-2">Expreso Centro</h2>
              <p className="text-[#4d4356] text-base mb-8">Estación Central → Terminal Norte</p>
              <div className="flex items-end gap-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#4d4356] mb-1">Próxima llegada</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[28px] font-extrabold leading-8 tracking-tight" style={{ color: "#6e00c7" }}>
                      {eta} min
                    </span>
                    <span className="flex items-center gap-1 text-sm font-bold" style={{ color: "#00584b" }}>
                      <Radio size={16} />
                      A tiempo
                    </span>
                  </div>
                </div>
                <div className="h-12 w-px bg-[#cfc2d9] mb-2" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#4d4356] mb-1">Siguiente bus</p>
                  <p className="text-xl font-semibold text-[#1a1c1e]">12 min</p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <Link
                href="/pasajero"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition-all"
                style={{ background: "#6e00c7" }}
              >
                <Navigation size={18} />
                Rastrear en vivo
              </Link>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-[#cfc2d9] hover:bg-[#eeeef0] transition-all text-[#1a1c1e]">
                Ver horario completo
              </button>
            </div>
          </div>

          {/* Right column — 4 cols */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            {/* Saved Stops */}
            <div className="bg-white border border-[#cfc2d9] rounded-xl p-6 shadow-sm flex-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-[#1a1c1e]">Paradas Guardadas</h3>
                <button className="text-[#7e7388] hover:text-[#1a1c1e] transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>
              <div className="space-y-1">
                {SAVED_STOPS.map((stop) => {
                  const Icon = stop.icon;
                  return (
                    <div
                      key={stop.id}
                      className="flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors hover:bg-[#eeeef0] group"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: stop.bg, color: stop.color }}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1a1c1e] text-sm truncate">{stop.name}</p>
                        <p className="text-xs text-[#4d4356]">{stop.detail}</p>
                      </div>
                      <ChevronRight size={18} className="text-[#7e7388] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Premium CTA */}
            <div
              className="border border-[#cfc2d9] rounded-xl p-6 shadow-sm flex items-center justify-between"
              style={{ background: "#8f00ff", color: "#efddff" }}
            >
              <div>
                <p className="font-bold text-sm">Servicio Premium</p>
                <p className="text-xs opacity-90 mt-0.5">Disponibilidad de asientos en tiempo real</p>
              </div>
              <button
                className="px-4 py-2 rounded-lg font-bold text-xs shrink-0"
                style={{ background: "#efddff", color: "#6e00c7" }}
              >
                Mejorar
              </button>
            </div>
          </div>

          {/* Other Saved Routes */}
          <div className="col-span-12 mt-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-[#1a1c1e]">Otras Rutas Guardadas</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className="p-2 border rounded-lg transition-colors"
                  style={{
                    borderColor: viewMode === "grid" ? "#6e00c7" : "#cfc2d9",
                    background: viewMode === "grid" ? "#f3ebff" : "transparent",
                    color: viewMode === "grid" ? "#6e00c7" : "#7e7388",
                  }}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className="p-2 border rounded-lg transition-colors"
                  style={{
                    borderColor: viewMode === "list" ? "#6e00c7" : "#cfc2d9",
                    background: viewMode === "list" ? "#f3ebff" : "transparent",
                    color: viewMode === "list" ? "#6e00c7" : "#7e7388",
                  }}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filtered.map((route) => (
                <RouteCard key={route.id} route={route} viewMode={viewMode} />
              ))}
              {filtered.length === 0 && (
                <div className="col-span-3 py-12 text-center text-[#7e7388]">
                  <Bus size={40} className="mx-auto mb-3 opacity-40" />
                  <p className="font-semibold">No se encontraron rutas</p>
                  <p className="text-sm mt-1">Intenta con otro término de búsqueda</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Preview — Google Maps real */}
          <div className="col-span-12 mt-12 rounded-xl overflow-hidden relative" style={{ height: "420px" }}>
            <MapView
              selectedBusId={selectedBus?.id ?? null}
              onBusSelect={setSelectedBus}
              userPosition={userPosition}
              routes={[]}
            />
            {/* Glass panel overlay */}
            <div
              className="absolute top-6 left-6 max-w-xs p-6 rounded-xl z-10 pointer-events-none"
              style={{
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
              }}
            >
              <h3 className="text-lg font-semibold text-[#1a1c1e] mb-2">Red en vivo</h3>
              <p className="text-sm text-[#4d4356] leading-relaxed mb-4">
                Posición actual de los buses en tus rutas guardadas.
              </p>
              <Link
                href="/pasajero"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-bold text-white text-sm hover:opacity-90 transition-all pointer-events-auto"
                style={{ background: "#6e00c7" }}
              >
                <Map size={16} />
                Abrir mapa completo
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#eeeef0] border-t border-[#cfc2d9] mt-12">
        <div className="w-full py-10 px-10 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <span className="font-bold text-[#1a1c1e]">Rumbo</span>
            <p className="text-xs text-[#4d4356]">© 2026 Rumbo Mobility. Todos los derechos reservados.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            {["Acerca de", "Términos de uso", "Privacidad", "Contacto", "Accesibilidad"].map((item) => (
              <a key={item} href="#" className="text-xs text-[#4d4356] hover:text-[#6e00c7] transition-colors font-medium">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex gap-3">
            <button className="w-10 h-10 rounded-full border border-[#cfc2d9] flex items-center justify-center text-[#7e7388] hover:text-[#6e00c7] transition-colors">
              <Globe size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-[#cfc2d9] flex items-center justify-center text-[#7e7388] hover:text-[#6e00c7] transition-colors">
              <HelpCircle size={18} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

type Route = (typeof SAVED_ROUTES)[0];

function RouteCard({ route, viewMode }: { route: Route; viewMode: "list" | "grid" }) {
  const isDelayed = route.status === "delayed";

  if (viewMode === "list") {
    return (
      <div className="bg-white border border-[#cfc2d9] rounded-xl px-6 py-4 flex items-center gap-6 hover:shadow-md transition-all group">
        <div
          className="font-bold text-sm px-3 py-1 rounded-lg shrink-0"
          style={{ background: route.codeBg, color: route.codeColor }}
        >
          {route.code}
        </div>
        <Heart size={18} className="text-[#ba1a1a] shrink-0" fill="#ba1a1a" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-[#1a1c1e] truncate">{route.name}</p>
          <p className="text-sm text-[#4d4356] truncate">{route.path}</p>
        </div>
        {isDelayed ? (
          <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded shrink-0" style={{ background: "#ffdad6", color: "#ba1a1a" }}>
            <AlertTriangle size={12} /> Retraso
          </span>
        ) : route.type === "express" ? (
          <span className="text-xs font-bold px-2 py-0.5 rounded shrink-0" style={{ background: "#f3ebff", color: "#6e00c7" }}>Express</span>
        ) : (
          <span className="text-xs font-bold px-2 py-0.5 rounded shrink-0" style={{ background: "#e6faf7", color: "#00584b" }}>Regular</span>
        )}
        <div className="text-right shrink-0">
          <p className="text-xs font-semibold uppercase text-[#4d4356] tracking-wider">Próximo</p>
          <p className="font-bold" style={{ color: isDelayed ? "#ba1a1a" : "#1a1c1e" }}>{route.nextBus} min</p>
        </div>
        <button
          className="w-10 h-10 rounded-full border border-[#cfc2d9] flex items-center justify-center text-[#7e7388] transition-all shrink-0 group-hover:border-[#6e00c7] group-hover:text-white"
          style={{ background: undefined }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#6e00c7"; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#7e7388"; }}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className="bg-white border border-[#cfc2d9] rounded-xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="font-bold text-sm px-3 py-1 rounded-lg" style={{ background: route.codeBg, color: route.codeColor }}>
            {route.code}
          </div>
          <Heart size={18} className="text-[#ba1a1a]" fill="#ba1a1a" />
        </div>
        {isDelayed ? (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded uppercase" style={{ background: "#ffdad6", color: "#ba1a1a" }}>
            <AlertTriangle size={11} /> Retraso
          </span>
        ) : route.type === "express" ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase" style={{ background: "#f3ebff", color: "#6e00c7" }}>Express</span>
        ) : route.type === "regular" ? (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase" style={{ background: "#e6faf7", color: "#00584b" }}>Regular</span>
        ) : null}
      </div>
      <h4 className="font-bold text-[#1a1c1e] text-lg mb-1">{route.name}</h4>
      <p className="text-sm text-[#4d4356] mb-6">{route.path}</p>
      <div className="flex items-center justify-between pt-4 border-t border-[#cfc2d9]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4d4356]">Próximo bus</p>
          <p className="font-bold" style={{ color: isDelayed ? "#ba1a1a" : "#1a1c1e" }}>{route.nextBus} min</p>
        </div>
        <button
          className="w-10 h-10 rounded-full border border-[#cfc2d9] flex items-center justify-center text-[#7e7388] transition-all"
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#6e00c7"; (e.currentTarget as HTMLButtonElement).style.color = "white"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#6e00c7"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#7e7388"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#cfc2d9"; }}
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
