import type { NextRequest } from "next/server";

// Predefined origin/destination pairs for each bus route in San José, CR
const ROUTE_ENDPOINTS: Record<string, { origin: string; destination: string; waypoints?: string }> = {
  r1:   { origin: "9.9344,-84.0869", destination: "9.9990,-84.2116" },
  r200: { origin: "9.9344,-84.0869", destination: "9.9280,-84.1255" },
  r330: { origin: "9.9319,-84.0803", destination: "9.9150,-84.1364" },
  r400: { origin: "9.9301,-84.0847", destination: "9.9100,-84.0510" },
};

// Standard Google encoded polyline decoder — no external deps needed
function decodePolyline(encoded: string): Array<{ lat: number; lng: number }> {
  const result: Array<{ lat: number; lng: number }> = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result_val = 0;
    let b: number;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result_val |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result_val & 1 ? ~(result_val >> 1) : result_val >> 1;
    lat += dlat;

    shift = 0;
    result_val = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result_val |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result_val & 1 ? ~(result_val >> 1) : result_val >> 1;
    lng += dlng;

    result.push({ lat: lat / 1e5, lng: lng / 1e5 });
  }

  return result;
}

export async function GET(request: NextRequest) {
  const routeId = request.nextUrl.searchParams.get("routeId");

  if (!routeId || !ROUTE_ENDPOINTS[routeId]) {
    return Response.json({ error: "routeId inválido" }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_DIRECTIONS_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "GOOGLE_DIRECTIONS_API_KEY no configurada" }, { status: 503 });
  }

  const { origin, destination, waypoints } = ROUTE_ENDPOINTS[routeId];
  const params = new URLSearchParams({
    origin,
    destination,
    mode: "driving",
    key: apiKey,
  });
  if (waypoints) params.set("waypoints", waypoints);

  const url = `https://maps.googleapis.com/maps/api/directions/json?${params}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json() as {
      status: string;
      routes: Array<{ overview_polyline: { points: string } }>;
    };

    if (data.status !== "OK" || !data.routes?.[0]) {
      return Response.json({ error: `Directions API: ${data.status}` }, { status: 502 });
    }

    const encoded = data.routes[0].overview_polyline.points;
    const waypoints_decoded = decodePolyline(encoded);

    return Response.json({ waypoints: waypoints_decoded });
  } catch {
    return Response.json({ error: "Error de red al llamar Directions API" }, { status: 502 });
  }
}
