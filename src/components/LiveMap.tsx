"use client";

import { useEffect, useRef } from "react";
import { loadMaps, GAM_CENTER } from "@/lib/google-maps";
import type { LiveVehicle } from "@/hooks/useVehicleLocations";

export type MapStop = { lat: number; lng: number; name: string };

type LiveMapProps = {
  vehicles: LiveVehicle[];
  center?: { lat: number; lng: number };
  zoom?: number;
  stops?: MapStop[];
  routePath?: { lat: number; lng: number }[];
  routeColor?: string;
  className?: string;
  /** Keep the map centered on the single vehicle (driver view). */
  followFirstVehicle?: boolean;
  onVehicleClick?: (unitId: string) => void;
};

// Desaturated "floor" style so vehicle markers pop (DESIGN.md elevation model).
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ saturation: -60 }, { lightness: 10 }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#dbe7ef" }] },
];

export default function LiveMap({
  vehicles,
  center = GAM_CENTER,
  zoom = 13,
  stops,
  routePath,
  routeColor = "#8f00ff",
  className,
  followFirstVehicle = false,
  onVehicleClick,
}: LiveMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const readyRef = useRef(false);

  // Init map once.
  useEffect(() => {
    let cancelled = false;
    loadMaps()
      .then(({ Map, InfoWindow }) => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        mapRef.current = new Map(containerRef.current, {
          center,
          zoom,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: MAP_STYLES,
          backgroundColor: "#f8f9fa",
        });
        infoRef.current = new InfoWindow();
        readyRef.current = true;
        drawStatic();
        drawVehicles();
      })
      .catch((err) => console.error("Google Maps load error:", err));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Draw stops + route polyline (static layer).
  function drawStatic() {
    const map = mapRef.current;
    if (!map) return;

    if (routePath && routePath.length > 1) {
      new google.maps.Polyline({
        path: routePath,
        map,
        strokeColor: routeColor,
        strokeOpacity: 0.7,
        strokeWeight: 4,
      });
    }

    if (stops) {
      for (const s of stops) {
        const marker = new google.maps.Marker({
          position: { lat: s.lat, lng: s.lng },
          map,
          title: s.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: "#ffffff",
            fillOpacity: 1,
            strokeColor: routeColor,
            strokeWeight: 2,
          },
          zIndex: 1,
        });
        marker.addListener("click", () => {
          if (!infoRef.current) return;
          infoRef.current.setContent(
            `<div style="font:600 13px Inter,sans-serif;color:#1a1c1e">${s.name}</div>`
          );
          infoRef.current.open(map, marker);
        });
      }
    }
  }

  // Sync vehicle markers whenever positions change.
  function drawVehicles() {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    const seen = new Set<string>();

    for (const v of vehicles) {
      seen.add(v.unitId);
      const color = v.stale ? "#757575" : v.routeColor ?? "#8f00ff";
      const position = { lat: v.lat, lng: v.lng };
      let marker = markersRef.current.get(v.unitId);

      const icon: google.maps.Symbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
        scale: 6,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
        rotation: v.heading ?? 0,
      };

      if (!marker) {
        marker = new google.maps.Marker({
          position,
          map,
          icon,
          label: {
            text: v.routeCode ?? v.unitCode ?? "•",
            color: "#1a1c1e",
            fontSize: "11px",
            fontWeight: "700",
            className: "rumbo-marker-label",
          },
          zIndex: 10,
        });
        marker.addListener("click", () => {
          onVehicleClick?.(v.unitId);
          if (!infoRef.current) return;
          const speedTxt =
            v.speed != null ? `${Math.round(v.speed * 3.6)} km/h` : "—";
          infoRef.current.setContent(
            `<div style="font:14px Inter,sans-serif;color:#1a1c1e;min-width:140px">
               <div style="font-weight:800">${v.unitCode ?? "Unidad"}</div>
               <div style="color:#4d4356">${v.routeName ?? "Sin ruta"}</div>
               <div style="margin-top:4px;color:${v.stale ? "#757575" : "#2e7d32"};font-weight:600">
                 ${v.stale ? "Señal perdida" : "En vivo"} · ${speedTxt}
               </div>
             </div>`
          );
          infoRef.current.open(map, marker!);
        });
        markersRef.current.set(v.unitId, marker);
      } else {
        marker.setPosition(position);
        marker.setIcon(icon);
      }
    }

    // Remove markers for vehicles no longer present.
    for (const [id, marker] of markersRef.current) {
      if (!seen.has(id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    }

    if (followFirstVehicle && vehicles[0]) {
      map.panTo({ lat: vehicles[0].lat, lng: vehicles[0].lng });
    }
  }

  // Redraw vehicles on data change.
  useEffect(() => {
    drawVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles]);

  return (
    <div
      ref={containerRef}
      className={className ?? "h-full w-full"}
      aria-label="Mapa en vivo de unidades de transporte"
    />
  );
}
