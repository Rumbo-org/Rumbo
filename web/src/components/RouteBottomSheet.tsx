"use client";

import { Clock, ChevronRight, Bus, Star, Heart } from "lucide-react";
import type { Route } from "@/lib/types";

interface RouteBottomSheetProps {
  routes: Route[];
  onSelectRoute: (route: Route) => void;
  favorites: Set<string>;
  onToggleFavorite: (routeId: string) => void;
}

const STATUS_CONFIG = {
  on_time: { label: "A tiempo", className: "bg-[#e8f5ee] text-[#1b6b43]" },
  delayed: { label: "Retrasado", className: "bg-[#fff3e0] text-[#c66b00]" },
  stale: { label: "Sin señal", className: "bg-[#f5f5f5] text-[#757575]" },
};

export default function RouteBottomSheet({
  routes,
  onSelectRoute,
  favorites,
  onToggleFavorite,
}: RouteBottomSheetProps) {
  return (
    <div className="bg-white bottom-sheet shadow-2xl flex flex-col max-h-[65vh] md:max-h-full md:rounded-xl md:shadow-xl">
      {/* Handle */}
      <div className="flex justify-center pt-3 pb-2 md:hidden">
        <div className="w-10 h-1 rounded-full bg-[#cfc2d9]" />
      </div>

      <div className="px-4 pb-2 pt-1 md:pt-4">
        <h2 className="text-base font-semibold text-[#1a1c1e]">Rutas cercanas</h2>
        <p className="text-xs text-[#4d4356] mt-0.5">
          {routes.filter((r) => r.status === "on_time").length} rutas operando normalmente
        </p>
      </div>

      <div className="overflow-y-auto flex-1 px-4 pb-4 space-y-2">
        {routes.map((route) => {
          const status = STATUS_CONFIG[route.status];
          return (
            <div
              key={route.id}
              className="border border-[#e8e8ea] rounded-xl p-3 hover:border-[#6e00c7] hover:bg-[#f9f7ff] transition-colors cursor-pointer"
              onClick={() => onSelectRoute(route)}
            >
              <div className="flex items-start gap-3">
                {/* Route number badge */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{
                    background:
                      route.status === "delayed" ? "#c66b00" : "#6e00c7",
                  }}
                >
                  {route.number}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-[#1a1c1e] text-sm truncate">
                      {route.name}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(route.id);
                      }}
                      className="shrink-0 p-1 rounded-full hover:bg-[#eeeef0] transition-colors"
                    >
                      <Heart
                        size={15}
                        className={
                          favorites.has(route.id)
                            ? "fill-[#bc0100] text-[#bc0100]"
                            : "text-[#cfc2d9]"
                        }
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#4d4356]">
                      <Clock size={11} />
                      cada {route.frequency} min
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#4d4356]">
                      <Bus size={11} />
                      {route.activeBuses} unidades
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-xs text-[#4d4356]">
                      <Star size={11} className="fill-[#f59e0b] text-[#f59e0b]" />
                      {route.rating.toFixed(1)}
                    </div>
                    <p className="text-xs text-[#7e7388] truncate">
                      {route.origin} → {route.destination}
                    </p>
                  </div>
                </div>

                <ChevronRight size={16} className="text-[#cfc2d9] shrink-0 mt-1" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
