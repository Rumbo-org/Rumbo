import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database row types (match the SQL schema)
export interface RouteRow {
  id: string;
  route_number: string;
  name: string;
  origin: string;
  destination: string;
  frequency_minutes: number;
  status: "on_time" | "delayed";
  active_buses: number;
  rating: number;
  active: boolean;
  waypoints: Array<{ lat: number; lng: number }>;
}

export interface StopRow {
  id: string;
  name: string;
  lat: number;
  lng: number;
  stop_code: string | null;
}

export interface RouteStopRow {
  route_id: string;
  stop_id: string;
  sequence: number;
  stops: StopRow;
}

export interface UnitRow {
  id: string;
  unit_number: string;
  operator_id: string;
}

export interface TripRow {
  id: string;
  route_id: string;
  unit_id: string;
  status: "active" | "completed" | "cancelled";
  started_at: string;
}

export interface GpsPositionRow {
  id: number;
  trip_id: string;
  unit_id: string;
  lat: number;
  lng: number;
  speed_kmh: number;
  heading: number;
  recorded_at: string;
  trips: { route_id: string } | null;
}
