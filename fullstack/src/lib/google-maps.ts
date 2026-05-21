import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let configured = false;

function configure() {
  if (configured) return;
  setOptions({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    v: "weekly",
  });
  configured = true;
}

/**
 * Loads the Maps + Marker libraries (functional API of
 * @googlemaps/js-api-loader v2). Returns the Maps library which exposes
 * `Map`, `InfoWindow`, `Polyline`, etc. Importing "marker" also makes
 * `google.maps.Marker` / `SymbolPath` available on the global namespace.
 */
export async function loadMaps(): Promise<google.maps.MapsLibrary> {
  configure();
  const [maps] = await Promise.all([
    importLibrary("maps"),
    importLibrary("marker"),
  ]);
  return maps;
}

/** Directions service to snap a route path to actual roads. */
export async function loadDirections(): Promise<google.maps.DirectionsService> {
  configure();
  const { DirectionsService } = await importLibrary("routes");
  return new DirectionsService();
}

/** Greater Metropolitan Area (San José, CR) — default map center. */
export const GAM_CENTER = { lat: 9.9333, lng: -84.0833 };
