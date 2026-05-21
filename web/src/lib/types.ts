export interface LatLng {
  lat: number;
  lng: number;
}

export type BusStatus = "on_time" | "delayed" | "stale";

export interface Bus {
  id: string;
  routeNumber: string;
  routeName: string;
  position: LatLng;
  heading: number; // degrees 0-360
  speed: number; // km/h
  status: BusStatus;
  etaMinutes: number;
  capacity: "low" | "medium" | "high";
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
  frequency: number; // minutes between buses
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
