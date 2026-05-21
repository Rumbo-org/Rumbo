"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Search,
  Shield,
  MapPin,
  Menu,
  Locate,
  X,
  Bell,
  Navigation,
  LogOut,
} from "lucide-react";
import EtaCard from "@/components/EtaCard";
import RouteBottomSheet from "@/components/RouteBottomSheet";
import type { Bus, LatLng } from "@/lib/types";
import { SAN_JOSE_CENTER } from "@/lib/mockData";
import { useRoutes } from "@/hooks/useRoutes";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function PasajeroPage() {
  const { routes, loading: loadingRoutes } = useRoutes();
  const { user, profile } = useAuth();

  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showSOS, setShowSOS] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) { setUserPosition(SAN_JOSE_CENTER); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserPosition(SAN_JOSE_CENTER)
    );
  }, []);

  const handleBusSelect = useCallback((bus: Bus | null) => {
    setSelectedBus(bus);
    if (bus) setSheetExpanded(false);
  }, []);

  const handleFollowBus = useCallback(() => {
    if (!selectedBus) return;
    setNotification(`Siguiendo ${selectedBus.routeNumber}`);
    setTimeout(() => setNotification(null), 3000);
  }, [selectedBus]);

  const toggleFavorite = useCallback((routeId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(routeId) ? next.delete(routeId) : next.add(routeId);
      return next;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  }, []);

  const filteredRoutes = routes.filter(
    (r) =>
      searchQuery === "" ||
      r.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "Pasajero";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="h-full relative flex flex-col overflow-hidden bg-black">
      {/* ── MAP LAYER ── */}
      <div className="absolute inset-0">
        <MapView
          selectedBusId={selectedBus?.id ?? null}
          onBusSelect={handleBusSelect}
          userPosition={userPosition}
          routes={routes}
        />
      </div>

      {/* ── TOP BAR ── */}
      <div className="relative z-10 flex items-center gap-2 p-3 pt-safe">
        <button
          onClick={() => setMenuOpen(true)}
          className="w-11 h-11 bg-white rounded-xl shadow-md flex items-center justify-center shrink-0"
        >
          <Menu size={20} className="text-[#1a1c1e]" />
        </button>

        <div className="flex-1 bg-white rounded-xl shadow-md flex items-center gap-2 px-3 h-11">
          <Search size={16} className="text-[#7e7388] shrink-0" />
          <input
            type="text"
            placeholder="Buscar ruta o destino..."
            className="flex-1 text-sm text-[#1a1c1e] placeholder:text-[#7e7388] outline-none bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X size={14} className="text-[#7e7388]" />
            </button>
          )}
        </div>

        <button className="w-11 h-11 bg-white rounded-xl shadow-md flex items-center justify-center shrink-0 relative">
          <Bell size={18} className="text-[#1a1c1e]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#bc0100]" />
        </button>
      </div>

      {/* ── TOAST ── */}
      {notification && (
        <div className="relative z-20 mx-3 mt-2">
          <div className="bg-[#1a1c1e] text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2">
            <Navigation size={14} className="text-[#dab9ff]" />
            {notification}
          </div>
        </div>
      )}

      {/* ── ETA CARD ── */}
      {selectedBus && (
        <div className="relative z-10 mx-3 mt-2">
          <EtaCard
            bus={selectedBus}
            onClose={() => setSelectedBus(null)}
            onFollow={handleFollowBus}
          />
        </div>
      )}

      {/* ── LOCATE ME ── */}
      <div className="absolute right-3 z-10" style={{ bottom: sheetExpanded ? "65vh" : "260px" }}>
        <button
          onClick={() => setUserPosition(SAN_JOSE_CENTER)}
          className="w-11 h-11 bg-white rounded-xl shadow-md flex items-center justify-center"
        >
          <Locate size={18} className="text-[#6e00c7]" />
        </button>
      </div>

      {/* ── SOS ── */}
      <div className="absolute left-3 z-20" style={{ bottom: sheetExpanded ? "65vh" : "260px" }}>
        <button
          onClick={() => setShowSOS(true)}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl sos-pulse"
          style={{ background: "#eb0000" }}
        >
          <Shield size={24} className="text-white" />
        </button>
      </div>

      {/* ── BOTTOM SHEET ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 transition-smooth"
        onClick={() => !sheetExpanded && setSheetExpanded(true)}
      >
        {loadingRoutes ? (
          <div className="bg-white bottom-sheet shadow-2xl p-6 flex items-center justify-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#6e00c7] border-t-transparent animate-spin" />
            <p className="text-sm text-[#4d4356]">Cargando rutas...</p>
          </div>
        ) : (
          <RouteBottomSheet
            routes={filteredRoutes}
            onSelectRoute={(route) => {
              setNotification(`Ruta ${route.number} seleccionada`);
              setTimeout(() => setNotification(null), 3000);
            }}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </div>

      {/* ── SLIDE-IN MENU ── */}
      {menuOpen && (
        <div className="absolute inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col">
            <div className="p-5 pt-8" style={{ background: "#6e00c7" }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                  {initials}
                </div>
                <div>
                  <p className="text-white font-semibold">{displayName}</p>
                  <p className="text-white/70 text-xs">
                    {user ? profile?.role ?? "pasajero" : "Sin sesión"}
                  </p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <p className="text-white font-bold text-lg">{routes.length}</p>
                  <p className="text-white/70 text-xs">rutas activas</p>
                </div>
                <div className="bg-white/10 rounded-lg p-2 text-center">
                  <p className="text-white font-bold text-lg">{favorites.size}</p>
                  <p className="text-white/70 text-xs">favoritas</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {[
                { label: "Mis rutas favoritas", icon: "♥" },
                { label: "Historial de viajes", icon: "🕐" },
                { label: "Reportar incidente", icon: "⚠️" },
                { label: "Contactos de emergencia", icon: "🆘" },
                { label: "Notificaciones", icon: "🔔" },
                { label: "Configuración", icon: "⚙️" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-[#f3f3f6] text-left transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="text-lg w-6 text-center">{item.icon}</span>
                  <span className="text-sm font-medium text-[#1a1c1e]">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-[#e8e8ea] space-y-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#cfc2d9] text-xs font-semibold text-[#4d4356] hover:bg-[#f9f7ff] transition-colors"
                >
                  <LogOut size={14} />
                  Cerrar sesión
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block text-center py-2.5 rounded-lg border border-[#6e00c7] text-xs font-semibold text-[#6e00c7] hover:bg-[#f9f7ff] transition-colors"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── SOS MODAL ── */}
      {showSOS && (
        <div className="absolute inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSOS(false)}
          />
          <div className="relative w-full bg-white rounded-t-2xl p-6 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center sos-pulse"
                style={{ background: "#eb0000" }}
              >
                <Shield size={30} className="text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-[#1a1c1e] mb-1">
              Botón de Emergencia
            </h2>
            <p className="text-sm text-center text-[#4d4356] mb-6">
              Se enviará tu ubicación GPS a tus contactos de emergencia.
            </p>
            <button
              className="w-full py-4 rounded-xl text-white font-bold text-base mb-3 transition-opacity active:opacity-80"
              style={{ background: "#eb0000" }}
              onClick={() => {
                setNotification("Alerta enviada a contactos de emergencia");
                setShowSOS(false);
                setTimeout(() => setNotification(null), 4000);
              }}
            >
              Enviar Alerta de Emergencia
            </button>
            <button
              className="w-full py-3 rounded-xl text-[#4d4356] font-semibold text-sm bg-[#eeeef0]"
              onClick={() => setShowSOS(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
