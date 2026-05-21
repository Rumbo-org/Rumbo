// ─────────────────────────────────────────────
// Primitivos compartidos
// ─────────────────────────────────────────────

export interface LatLng {
  lat: number;
  lng: number;
}

// ─────────────────────────────────────────────
// Mapa en vivo — buses y rutas
// ─────────────────────────────────────────────

export type BusStatus = "on_time" | "delayed" | "stale";

export type BusCapacity = "low" | "medium" | "high";

export interface Bus {
  id: string;
  routeNumber: string;
  routeName: string;
  position: LatLng;
  heading: number;      // grados 0-360
  speed: number;        // km/h
  status: BusStatus;
  etaMinutes: number;
  capacity: BusCapacity;
  lastUpdate: Date;
}

export interface Stop {
  id: string;
  name: string;
  position: LatLng;
  routes: string[];
}

export interface Route {
  id: string;
  number: string;
  name: string;
  origin: string;
  destination: string;
  waypoints: LatLng[];
  stops: Stop[];
  frequency: number;    // minutos entre buses
  status: BusStatus;
  activeBuses: number;
  rating: number;
}

export interface Trip {
  id: string;
  routeId: string;
  busId: string;
  boardingStop: Stop;
  alightingStop: Stop;
  startTime: Date;
  estimatedArrival: Date;
}

export interface Rating {
  cleanliness: number;
  punctuality: number;
  driverBehavior: number;
  comment?: string;
}

// ─────────────────────────────────────────────
// Favoritos — rutas y paradas guardadas
// ─────────────────────────────────────────────

export type RouteServiceType = "express" | "regular" | null;

export interface SavedStop {
  id: number;
  name: string;
  detail: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

export interface SavedRoute {
  id: number;
  code: string;
  name: string;
  path: string;
  nextBus: number;      // minutos
  status: BusStatus;
  type: RouteServiceType;
  codeBg: string;
  codeColor: string;
}

// ─────────────────────────────────────────────
// Seguridad
// ─────────────────────────────────────────────

export interface TrustedContact {
  id: number;
  initials: string;
  name: string;
  phone: string;
  verified: boolean;
  bg: string;           // color del avatar
  color: string;
}

export interface SafetyTip {
  icon: React.ElementType;
  title: string;
  desc: string;
}

export interface SafeZone {
  id: string;
  name: string;
  distance: number;     // metros
  position: LatLng;
}

export interface IncidentReport {
  type: string;
  description: string;
  anonymous: boolean;
  timestamp: Date;
}

// ─────────────────────────────────────────────
// Auth — login y registro
// ─────────────────────────────────────────────

export type LoginTab = "email" | "phone";

export type UserRole = "passenger" | "driver" | "operator";

export interface PasswordStrength {
  bars: number;         // 0-4
  label: string;
  color: string;
  icon: React.ReactNode;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
}

// ─────────────────────────────────────────────
// Conductor (driver)
// ─────────────────────────────────────────────

export type DriverStatus = "active" | "break" | "offline";

export interface DriverSession {
  driverId: string;
  busId: string;
  routeId: string;
  status: DriverStatus;
  startTime: Date;
  currentPosition: LatLng;
  heading: number;
  speed: number;
}

// ─────────────────────────────────────────────
// Operador (dashboard)
// ─────────────────────────────────────────────

export interface FleetStats {
  totalBuses: number;
  activeBuses: number;
  delayedBuses: number;
  punctualityRate: number;   // 0-100
  dailyPassengers: number;
  avgRating: number;         // 0-5
}

export interface RoutePerformance {
  routeId: string;
  routeNumber: string;
  punctuality: number;
  cleanliness: number;
  driverBehavior: number;
  totalRatings: number;
}
