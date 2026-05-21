"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import type { Bus, LatLng } from "@/lib/types";
import { INITIAL_BUSES, SAN_JOSE_CENTER, ROUTE_PATHS, MOCK_ROUTES } from "@/lib/mockData";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

// ---------------------------------------------------------------------------
// Path interpolation for bus animation
// ---------------------------------------------------------------------------
function interpolateAlongPath(
  path: LatLng[],
  progress: number
): { position: LatLng; heading: number } {
  if (path.length < 2) return { position: path[0], heading: 0 };

  const totalSegments = path.length - 1;
  const scaledProgress = progress * totalSegments;
  const segmentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
  const segmentProgress = scaledProgress - segmentIndex;

  const from = path[segmentIndex];
  const to = path[segmentIndex + 1];

  const lat = from.lat + (to.lat - from.lat) * segmentProgress;
  const lng = from.lng + (to.lng - from.lng) * segmentProgress;
  const heading =
    ((Math.atan2(to.lng - from.lng, to.lat - from.lat) * 180) / Math.PI + 360) % 360;

  return { position: { lat, lng }, heading };
}

const ROUTE_COLORS: Record<string, string> = {
  r1: "#6e00c7",
  r200: "#6e00c7",
  r330: "#c66b00",
  r400: "#6e00c7",
};

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
              <strong>Google Cloud Console</strong>. El tier gratuito cubre $200/mes —
              el costo para un demo será $0.
            </>
          ) : (
            "No se pudo cargar el mapa. Verifica tu conexión a internet e intenta de nuevo."
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
// MapContent — bus animation + markers (renders inside <Map>)
// ---------------------------------------------------------------------------
interface MapContentProps {
  selectedBusId: string | null;
  onBusSelect: (bus: Bus | null) => void;
  userPosition: LatLng | null;
}

function MapContent({ selectedBusId, onBusSelect, userPosition }: MapContentProps) {
  const [buses, setBuses] = useState<Bus[]>(INITIAL_BUSES);
  const progressRef = useRef<Record<string, number>>({});
  const speedRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const offsets: Record<string, number> = {
      b1: 0.35, b2: 0.6, b3: 0.45, b4: 0.75, b5: 0.5, b6: 0.3,
    };
    INITIAL_BUSES.forEach((bus) => {
      progressRef.current[bus.id] = offsets[bus.id] ?? 0;
      speedRef.current[bus.id] = 0.00008 + Math.random() * 0.00006;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => {
          const path = ROUTE_PATHS[bus.id];
          if (!path) return bus;

          let progress = progressRef.current[bus.id] ?? 0;
          progress += speedRef.current[bus.id] ?? 0.0001;
          if (progress > 1) progress = 0;
          progressRef.current[bus.id] = progress;

          const { position, heading } = interpolateAlongPath(path, progress);
          return {
            ...bus,
            position,
            heading,
            etaMinutes: Math.max(1, Math.round((1 - progress) * 20)),
            lastUpdate: new Date(),
          };
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Route polylines */}
      {MOCK_ROUTES.map((route) => (
        <Polyline
          key={route.id}
          path={route.waypoints}
          strokeColor={ROUTE_COLORS[route.id] ?? "#6e00c7"}
          strokeOpacity={route.status === "delayed" ? 0.45 : 0.65}
          strokeWeight={3}
        />
      ))}

      {/* User position — centered with anchorLeft/anchorTop */}
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

      {/* Bus markers — AdvancedMarker with BusMarker React children */}
      {buses.map((bus) => {
        const selected = bus.id === selectedBusId;
        return (
          <AdvancedMarker
            key={bus.id}
            position={bus.position}
            title={`Ruta ${bus.routeNumber} · ${bus.etaMinutes} min`}
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
// MapStatus — reads API loading status, renders Map or fallbacks
// Must be inside <APIProvider> to call useApiLoadingStatus()
// ---------------------------------------------------------------------------
interface MapStatusProps extends MapContentProps {
  onMapError: (kind: string) => void;
}

function MapStatus({ selectedBusId, onBusSelect, userPosition, onMapError }: MapStatusProps) {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.LOADING || status === APILoadingStatus.NOT_LOADED) {
    return <MapLoadingFallback />;
  }

  if (status === APILoadingStatus.FAILED) {
    onMapError("load");
    return null;
  }

  // AUTH_FAILURE: the Map component renders its own AuthFailureMessage internally
  // We additionally surface our own fallback
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
      />
    </Map>
  );
}

// ---------------------------------------------------------------------------
// MapView — public API
// ---------------------------------------------------------------------------
interface MapViewProps {
  selectedBusId: string | null;
  onBusSelect: (bus: Bus | null) => void;
  userPosition: LatLng | null;
}

export default function MapView({ selectedBusId, onBusSelect, userPosition }: MapViewProps) {
  const [mapError, setMapError] = useState<string | null>(null);

  // Google Maps API calls window.gm_authFailure() on billing/auth failures
  // (BillingNotEnabledMapError). This is the official runtime hook for detection.
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

  const handleApiError = useCallback(() => {
    setMapError("load");
  }, []);

  const handleMapError = useCallback((kind: string) => {
    setMapError(kind);
  }, []);

  if (mapError) {
    return <MapErrorFallback isBilling={mapError === "billing"} />;
  }

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY} onError={handleApiError}>
      <MapStatus
        selectedBusId={selectedBusId}
        onBusSelect={onBusSelect}
        userPosition={userPosition}
        onMapError={handleMapError}
      />
    </APIProvider>
  );
}
