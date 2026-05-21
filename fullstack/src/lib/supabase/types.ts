export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      drivers: {
        Row: {
          created_at: string
          full_name: string
          id: string
          license_no: string | null
          phone: string | null
          profile_id: string | null
          status: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id?: string
          license_no?: string | null
          phone?: string | null
          profile_id?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          license_no?: string | null
          phone?: string | null
          profile_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
          relationship: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
          relationship?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
          relationship?: string | null
          user_id?: string
        }
        Relationships: []
      }
      favorite_routes: {
        Row: {
          created_at: string
          id: string
          route_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          route_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          route_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_routes_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          delays: boolean
          favorites: boolean
          schedule_changes: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          delays?: boolean
          favorites?: boolean
          schedule_changes?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          delays?: boolean
          favorites?: boolean
          schedule_changes?: boolean
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      ratings: {
        Row: {
          behavior: number
          cleanliness: number
          comment: string | null
          created_at: string
          created_by: string | null
          id: string
          punctuality: number
          route_id: string | null
          trip_id: string | null
          unit_id: string | null
        }
        Insert: {
          behavior: number
          cleanliness: number
          comment?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          punctuality: number
          route_id?: string | null
          trip_id?: string | null
          unit_id?: string | null
        }
        Update: {
          behavior?: number
          cleanliness?: number
          comment?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          punctuality?: number
          route_id?: string | null
          trip_id?: string | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ratings_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          code: string
          color: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          color?: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          color?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      safety_reports: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          lat: number | null
          lng: number | null
          route_id: string | null
          severity: string
          type: string
          unit_id: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          route_id?: string | null
          severity?: string
          type?: string
          unit_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          route_id?: string | null
          severity?: string
          type?: string
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safety_reports_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "safety_reports_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      stops: {
        Row: {
          created_at: string
          id: string
          lat: number
          lng: number
          name: string
          route_id: string
          sequence: number
        }
        Insert: {
          created_at?: string
          id?: string
          lat: number
          lng: number
          name: string
          route_id: string
          sequence: number
        }
        Update: {
          created_at?: string
          id?: string
          lat?: number
          lng?: number
          name?: string
          route_id?: string
          sequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_check_ins: {
        Row: {
          checked_in_at: string
          id: string
          trip_id: string
          user_id: string
        }
        Insert: {
          checked_in_at?: string
          id?: string
          trip_id: string
          user_id: string
        }
        Update: {
          checked_in_at?: string
          id?: string
          trip_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_check_ins_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          created_at: string
          driver_id: string | null
          ended_at: string | null
          id: string
          route_id: string
          started_at: string
          status: string
          unit_id: string
        }
        Insert: {
          created_at?: string
          driver_id?: string | null
          ended_at?: string | null
          id?: string
          route_id: string
          started_at?: string
          status?: string
          unit_id: string
        }
        Update: {
          created_at?: string
          driver_id?: string | null
          ended_at?: string | null
          id?: string
          route_id?: string
          started_at?: string
          status?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trips_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          code: string
          created_at: string
          driver_id: string | null
          id: string
          plate: string | null
          route_id: string | null
          status: string
        }
        Insert: {
          code: string
          created_at?: string
          driver_id?: string | null
          id?: string
          plate?: string | null
          route_id?: string | null
          status?: string
        }
        Update: {
          code?: string
          created_at?: string
          driver_id?: string | null
          id?: string
          plate?: string | null
          route_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_locations: {
        Row: {
          heading: number | null
          id: number
          lat: number
          lng: number
          recorded_at: string
          route_id: string | null
          speed: number | null
          trip_id: string | null
          unit_id: string
        }
        Insert: {
          heading?: number | null
          id?: never
          lat: number
          lng: number
          recorded_at?: string
          route_id?: string | null
          speed?: number | null
          trip_id?: string | null
          unit_id: string
        }
        Update: {
          heading?: number | null
          id?: never
          lat?: number
          lng?: number
          recorded_at?: string
          route_id?: string | null
          speed?: number | null
          trip_id?: string | null
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_locations_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_locations_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_locations_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      latest_vehicle_locations: {
        Row: {
          heading: number | null
          lat: number | null
          lng: number | null
          recorded_at: string | null
          route_code: string | null
          route_color: string | null
          route_id: string | null
          route_name: string | null
          speed: number | null
          unit_code: string | null
          unit_id: string | null
        }
        Relationships: []
      }
      route_rating_summary: {
        Row: {
          avg_behavior: number | null
          avg_cleanliness: number | null
          avg_overall: number | null
          avg_punctuality: number | null
          route_id: string | null
          total_ratings: number | null
        }
        Relationships: []
      }
      unit_rating_summary: {
        Row: {
          avg_behavior: number | null
          avg_cleanliness: number | null
          avg_overall: number | null
          avg_punctuality: number | null
          total_ratings: number | null
          unit_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "passenger" | "driver" | "operator"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database["public"]

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"]
export type Views<T extends keyof PublicSchema["Views"]> =
  PublicSchema["Views"][T]["Row"]
export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T]

// Convenience domain aliases
export type Profile = Tables<"profiles">
export type UserRole = Enums<"user_role">
export type Route = Tables<"routes">
export type Stop = Tables<"stops">
export type Unit = Tables<"units">
export type Driver = Tables<"drivers">
export type Trip = Tables<"trips">
export type TripCheckIn = Tables<"trip_check_ins">
export type VehicleLocation = Tables<"vehicle_locations">
export type SafetyReport = Tables<"safety_reports">
export type Rating = Tables<"ratings">
export type EmergencyContact = Tables<"emergency_contacts">
export type FavoriteRoute = Tables<"favorite_routes">
export type NotificationPreference = Tables<"notification_preferences">
export type LatestVehicleLocation = Views<"latest_vehicle_locations">
export type UnitRatingSummary = Views<"unit_rating_summary">
export type RouteRatingSummary = Views<"route_rating_summary">
