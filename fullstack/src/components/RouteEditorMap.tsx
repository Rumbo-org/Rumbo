"use client";

import { useEffect, useRef } from "react";
import { loadMaps, loadDirections, GAM_CENTER } from "@/lib/google-maps";

export type EditorStop = {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  sequence: number;
};

type Props = {
  stops: EditorStop[];
  routeColor?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  /** Called when the user clicks empty map to drop a new stop. */
  onAddStop?: (lat: number, lng: number) => void;
  /** Called when a stop marker is dragged to a new position. */
  onMoveStop?: (index: number, lat: number, lng: number) => void;
};

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ saturation: -40 }, { lightness: 10 }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
];

export default function RouteEditorMap({
  stops,
  routeColor = "#8f00ff",
  center = GAM_CENTER,
  zoom = 13,
  className,
  onAddStop,
  onMoveStop,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const lineRef = useRef<google.maps.Polyline | null>(null);
  const directionsRef = useRef<google.maps.DirectionsService | null>(null);
  const cbRef = useRef({ onAddStop, onMoveStop });
  const readyRef = useRef(false);

  // Keep latest callbacks reachable from the (once-bound) map click listener.
  cbRef.current = { onAddStop, onMoveStop };

  useEffect(() => {
    let cancelled = false;
    loadMaps()
      .then(({ Map }) => {
        if (cancelled || !containerRef.current || mapRef.current) return;
        const map = new Map(containerRef.current, {
          center,
          zoom,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "greedy",
          styles: MAP_STYLES,
          backgroundColor: "#f8f9fa",
          clickableIcons: false,
        });
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) cbRef.current.onAddStop?.(e.latLng.lat(), e.latLng.lng());
        });
        mapRef.current = map;
        readyRef.current = true;
        loadDirections()
          .then((svc) => {
            directionsRef.current = svc;
            draw();
          })
          .catch(() => draw());
      })
      .catch((err) => console.error("Maps load error:", err));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function draw() {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;

    // Clear previous overlays.
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    lineRef.current?.setMap(null);

    const ordered = [...stops].sort((a, b) => a.sequence - b.sequence);

    ordered.forEach((s, i) => {
      const marker = new google.maps.Marker({
        position: { lat: s.lat, lng: s.lng },
        map,
        draggable: Boolean(onMoveStop),
        label: { text: String(s.sequence), color: "#fff", fontSize: "11px", fontWeight: "700" },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 11,
          fillColor: routeColor,
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        title: s.name,
      });
      marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) cbRef.current.onMoveStop?.(i, e.latLng.lat(), e.latLng.lng());
      });
      markersRef.current.push(marker);
    });

    drawPath(ordered);
  }

  function setLine(path: google.maps.LatLng[] | google.maps.LatLngLiteral[]) {
    lineRef.current?.setMap(null);
    lineRef.current = new google.maps.Polyline({
      path,
      map: mapRef.current!,
      strokeColor: routeColor,
      strokeOpacity: 0.85,
      strokeWeight: 5,
    });
  }

  // Snap the path to roads via Directions; fall back to straight segments
  // if Directions is unavailable (API not enabled, too many waypoints, etc.).
  function drawPath(ordered: EditorStop[]) {
    const straight = ordered.map((s) => ({ lat: s.lat, lng: s.lng }));
    if (ordered.length < 2) {
      lineRef.current?.setMap(null);
      lineRef.current = null;
      return;
    }
    const svc = directionsRef.current;
    if (!svc || straight.length > 25) {
      setLine(straight);
      return;
    }
    svc.route(
      {
        origin: straight[0],
        destination: straight[straight.length - 1],
        waypoints: straight.slice(1, -1).map((location) => ({ location, stopover: true })),
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result?.routes[0]) {
          setLine(result.routes[0].overview_path);
        } else {
          setLine(straight);
        }
      }
    );
  }

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, routeColor]);

  return (
    <div
      ref={containerRef}
      className={className ?? "h-full w-full"}
      aria-label="Mapa editor de rutas — clic para agregar parada"
    />
  );
}
