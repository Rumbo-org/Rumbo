"use client";

import { useCallback, useEffect, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Polyline,
  useApiLoadingStatus,
  APILoadingStatus,
} from "@vis.gl/react-google-maps";
import { MapPin, AlertCircle, RefreshCw } from "lucide-react";
import BusMarker from "./BusMarker";
import type { Bus, LatLng, Route } from "@/lib/types";
import { useVehicleLocations } from "@/hooks/useVehicleLocations";
import { SAN_JOSE_CENTER } from "@/lib/mockData";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

// ---------------------------------------------------------------------------
// Fallback components
// ---------------------------------------------------------------------------
function MapLoadingFallback() {
  return (
    <div className="w-full h-full bg-[#e8e8ea] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-3 border-[#6e00c7] border-t-transparent animate-spin" />
        <p className="text-sm font-medium text-[#4d4356]">Cargando mapa…</p>
      </div>
    </div>
  );
}

function MapErrorFallback({ isBilling }: { isBilling: boolean }) {
  return (
    <div className="w-full h-full bg-[#f3f3f6] flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-lg p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-[#fff0f0] flex items-center justify-center mx-auto mb-4">
          {isBilling ? (
            <AlertCircle size={28} className="text-[#bc0100]" />
          ) : (
            <MapPin size={28} className="text-[#7e7388]" />
          )}
        </div>
        <h3 className="font-bold text-[#1a1c1e] text-base mb-2">
          {isBilling ? "Facturación no habilitada" : "Error al cargar el mapa"}
        </h3>
        <p className="text-sm text-[#4d4356] leading-relaxed mb-4">
          {isBilling ? (
            <>
              La API key requiere que se habilite la facturación en{" "}
              <strong>Google Cloud Console</strong>.
            </>
          ) : (
            "No se pudo cargar el mapa. Verifica tu conexión e intenta de nuevo."
          )}
        </p>
        {isBilling ? (
          <a
            href="https://console.cloud.google.com/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#6e00c7" }}
          >
            Abrir Cloud Console
          </a>
        ) : (
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#6e00c7" }}
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MapContent — buses reales de Supabase + marcadores
// ---------------------------------------------------------------------------
interface MapContentProps {
  selectedBusId: string | null;
  onBusSelect: (bus: Bus | null) => void;
  userPosition: LatLng | null;
  routes: Route[];
}

function MapContent({ selectedBusId, onBusSelect, userPosition, routes }: MapContentProps) {
  const { vehicles } = useVehicleLocations();

  return (
    <>
      {/* Polylines de rutas usando paradas reales de Supabase */}
      {routes.map((route) =>
        route.waypoints.length >= 2 ? (
          <Polyline
            key={route.id}
            path={route.waypoints}
            strokeColor={route.status === "stale" ? "#9e9e9e" : "#6e00c7"}
            strokeOpacity={0.65}
            strokeWeight={3}
          />
        ) : null
      )}

      {/* Posición del usuario */}
      {userPosition && (
        <AdvancedMarker
          position={userPosition}
          title="Tu ubicación"
          anchorLeft="-50%"
          anchorTop="-50%"
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#6e00c7",
              border: "2.5px solid white",
              boxShadow: "0 0 0 6px rgba(110,0,199,0.18), 0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
        </AdvancedMarker>
      )}

      {/* Buses reales de Supabase */}
      {vehicles.map((bus) => {
        const selected = bus.id === selectedBusId;
        return (
          <AdvancedMarker
            key={bus.id}
            position={bus.position}
            title={`${bus.routeNumber} · ${bus.speed} km/h`}
            zIndex={selected ? 100 : 1}
            anchorLeft="-50%"
            anchorTop="-50%"
            clickable
            onClick={() => onBusSelect(selected ? null : bus)}
          >
            <BusMarker bus={bus} selected={selected} />
          </AdvancedMarker>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// MapStatus — renderiza Map o fallbacks según estado de la API
// ---------------------------------------------------------------------------
interface MapStatusProps extends MapContentProps {
  onMapError: (kind: string) => void;
}

function MapStatus({ selectedBusId, onBusSelect, userPosition, routes, onMapError }: MapStatusProps) {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.LOADING || status === APILoadingStatus.NOT_LOADED) {
    return <MapLoadingFallback />;
  }
  if (status === APILoadingStatus.FAILED) {
    onMapError("load");
    return null;
  }
  if (status === APILoadingStatus.AUTH_FAILURE) {
    onMapError("billing");
    return null;
  }

  return (
    <Map
      defaultCenter={SAN_JOSE_CENTER}
      defaultZoom={14}
      mapId="DEMO_MAP_ID"
      gestureHandling="greedy"
      className="w-full h-full"
      disableDefaultUI={false}
      fullscreenControl={false}
      streetViewControl={false}
      mapTypeControl={false}
      zoomControl
    >
      <MapContent
        selectedBusId={selectedBusId}
        onBusSelect={onBusSelect}
        userPosition={userPosition}
        routes={routes}
      />
    </Map>
  );
}

// ---------------------------------------------------------------------------
// MapView — API pública
// ---------------------------------------------------------------------------
interface MapViewProps {
  selectedBusId: string | null;
  onBusSelect: (bus: Bus | null) => void;
  userPosition: LatLng | null;
  routes: Route[];
}

export default function MapView({ selectedBusId, onBusSelect, userPosition, routes }: MapViewProps) {
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const prev = (window as { gm_authFailure?: () => void }).gm_authFailure;
    (window as { gm_authFailure?: () => void }).gm_authFailure = () => {
      setMapError("billing");
      prev?.();
    };
    return () => {
      (window as { gm_authFailure?: () => void }).gm_authFailure = prev;
    };
  }, []);

  const handleApiError = useCallback(() => { setMapError("load"); }, []);
  const handleMapError = useCallback((kind: string) => { setMapError(kind); }, []);

  if (mapError) return <MapErrorFallback isBilling={mapError === "billing"} />;

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} onError={handleApiError}>
      <MapStatus
        selectedBusId={selectedBusId}
        onBusSelect={onBusSelect}
        userPosition={userPosition}
        routes={routes}
        onMapError={handleMapError}
      />
    </APIProvider>
  );
}
