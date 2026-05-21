"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Star,
  Users,
  MapPin,
  BarChart3,
  ArrowLeft,
  Activity,
} from "lucide-react";

const FLEET_DATA = [
  { id: "1042", route: "1", status: "on_time", speed: 48, driver: "Carlos M.", passengers: 32, battery: 87 },
  { id: "1073", route: "200", status: "on_time", speed: 29, driver: "Ana R.", passengers: 41, battery: 92 },
  { id: "1098", route: "330", status: "delayed", speed: 18, driver: "Marco V.", passengers: 15, battery: 64 },
  { id: "1155", route: "400", status: "on_time", speed: 33, driver: "Luis P.", passengers: 28, battery: 71 },
  { id: "1202", route: "1", status: "on_time", speed: 52, driver: "Roberto S.", passengers: 8, battery: 95 },
  { id: "1218", route: "200", status: "stale", speed: 0, driver: "María G.", passengers: 0, battery: 45 },
];

const STATS = [
  { label: "Unidades activas", value: "5", sub: "de 6 en flota", icon: Bus, trend: "up" },
  { label: "Pasajeros hoy", value: "1,247", sub: "+12% vs ayer", icon: Users, trend: "up" },
  { label: "Puntualidad", value: "83%", sub: "Meta: 85%", icon: Clock, trend: "down" },
  { label: "Calificación", value: "4.3", sub: "124 reseñas hoy", icon: Star, trend: "up" },
];

const ROUTE_PERFORMANCE = [
  { number: "1", name: "Alajuela", buses: 2, onTime: 100, rating: 4.2, passengers: 412 },
  { number: "200", name: "Pavas", buses: 2, onTime: 100, rating: 4.5, passengers: 518 },
  { number: "330", name: "Escazú", buses: 1, onTime: 0, rating: 3.8, passengers: 187 },
  { number: "400", name: "Zapote", buses: 1, onTime: 100, rating: 4.0, passengers: 130 },
];

const STATUS_CONFIG = {
  on_time: { label: "A tiempo", dot: "bg-[#1b6b43]", text: "text-[#1b6b43]", bg: "bg-[#e8f5ee]" },
  delayed: { label: "Retrasado", dot: "bg-[#c66b00]", text: "text-[#c66b00]", bg: "bg-[#fff3e0]" },
  stale: { label: "Sin señal", dot: "bg-[#757575]", text: "text-[#757575]", bg: "bg-[#f5f5f5]" },
} as const;

type BusStatus = keyof typeof STATUS_CONFIG;

export default function OperadorPage() {
  const [activeTab, setActiveTab] = useState<"flota" | "rutas" | "analitica">("flota");

  return (
    <div className="min-h-full flex flex-col bg-[#f3f3f6]">
      {/* Header */}
      <div style={{ background: "#1a1c1e" }} className="px-4 py-4 pt-safe">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/pasajero" className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} className="text-white" />
          </Link>
          <div className="flex-1">
            <h1 className="text-white font-bold text-lg">Dashboard Operador</h1>
            <p className="text-white/50 text-xs">Cooperativa El Paso · San José</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "#1b6b43" }}>
            <Activity size={12} className="text-white" />
            <span className="text-white text-xs font-semibold">En vivo</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl p-3" style={{ background: "#262630" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/50 mt-0.5">{stat.sub}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Icon size={16} className="text-[#dab9ff]" />
                    {stat.trend === "up" ? (
                      <TrendingUp size={12} className="text-[#44ddc1]" />
                    ) : (
                      <TrendingDown size={12} className="text-[#eb0000]" />
                    )}
                  </div>
                </div>
                <p className="text-white/40 text-xs mt-2">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-[#e8e8ea] sticky top-0 z-10">
        {(["flota", "rutas", "analitica"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 py-3 text-sm font-semibold capitalize transition-colors"
            style={{
              color: activeTab === tab ? "#6e00c7" : "#7e7388",
              borderBottom: activeTab === tab ? "2px solid #6e00c7" : "2px solid transparent",
            }}
          >
            {tab === "analitica" ? "Analítica" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3">
        {/* FLOTA TAB */}
        {activeTab === "flota" && (
          <>
            {/* Alert */}
            <div className="flex items-center gap-2 bg-[#fff3e0] border border-[#c66b00]/30 rounded-xl p-3">
              <AlertTriangle size={16} className="text-[#c66b00] shrink-0" />
              <p className="text-xs font-medium text-[#c66b00]">
                Bus 1098 (Ruta 330) con retraso de 8 min · Bus 1218 sin señal GPS
              </p>
            </div>

            {FLEET_DATA.map((bus) => {
              const st = STATUS_CONFIG[bus.status as BusStatus];
              return (
                <div key={bus.id} className="bg-white rounded-xl border border-[#e8e8ea] p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: bus.status === "stale" ? "#757575" : "#6e00c7" }}
                      >
                        {bus.route}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1c1e] text-sm">Bus {bus.id}</p>
                        <p className="text-xs text-[#4d4356]">{bus.driver}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${st.bg} ${st.text}`}>
                      {st.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center bg-[#f3f3f6] rounded-lg p-2">
                      <p className="text-base font-bold text-[#1a1c1e]">{bus.speed}</p>
                      <p className="text-[10px] text-[#7e7388]">km/h</p>
                    </div>
                    <div className="text-center bg-[#f3f3f6] rounded-lg p-2">
                      <p className="text-base font-bold text-[#1a1c1e]">{bus.passengers}</p>
                      <p className="text-[10px] text-[#7e7388]">pasajeros</p>
                    </div>
                    <div className="text-center bg-[#f3f3f6] rounded-lg p-2">
                      <p
                        className="text-base font-bold"
                        style={{
                          color: bus.battery < 30 ? "#eb0000" : bus.battery < 50 ? "#c66b00" : "#1b6b43",
                        }}
                      >
                        {bus.battery}%
                      </p>
                      <p className="text-[10px] text-[#7e7388]">batería</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* RUTAS TAB */}
        {activeTab === "rutas" && (
          <>
            {ROUTE_PERFORMANCE.map((route) => (
              <div key={route.number} className="bg-white rounded-xl border border-[#e8e8ea] p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: route.onTime === 0 ? "#c66b00" : "#6e00c7" }}
                  >
                    {route.number}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1a1c1e] text-sm">
                      San José – {route.name}
                    </p>
                    <p className="text-xs text-[#4d4356]">{route.buses} unidades en servicio</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star size={12} className="fill-[#f59e0b] text-[#f59e0b]" />
                      <span className="text-sm font-bold text-[#1a1c1e]">{route.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-[#f3f3f6] rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-[#1a1c1e]">{route.passengers}</p>
                    <p className="text-[10px] text-[#7e7388]">pasajeros</p>
                  </div>
                  <div className="bg-[#f3f3f6] rounded-lg p-2 text-center">
                    <p
                      className="text-sm font-bold"
                      style={{ color: route.onTime < 80 ? "#c66b00" : "#1b6b43" }}
                    >
                      {route.onTime}%
                    </p>
                    <p className="text-[10px] text-[#7e7388]">puntualidad</p>
                  </div>
                  <div className="bg-[#f3f3f6] rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-[#1a1c1e]">{route.buses}</p>
                    <p className="text-[10px] text-[#7e7388]">unidades</p>
                  </div>
                </div>

                {/* Puntuality bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-[#7e7388] mb-1">
                    <span>Puntualidad</span>
                    <span>{route.onTime}%</span>
                  </div>
                  <div className="h-1.5 bg-[#eeeef0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${route.onTime}%`,
                        background: route.onTime < 80 ? "#c66b00" : "#1b6b43",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* ANALÍTICA TAB */}
        {activeTab === "analitica" && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-[#e8e8ea] p-4">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 size={16} className="text-[#6e00c7]" />
                <h3 className="font-semibold text-[#1a1c1e] text-sm">Pasajeros por hora</h3>
              </div>
              <div className="flex items-end gap-1.5 h-24">
                {[28, 45, 62, 89, 134, 145, 122, 98, 76, 88, 110, 143].map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-sm transition-all"
                      style={{
                        height: `${(v / 145) * 80}px`,
                        background: i === 5 ? "#6e00c7" : "#dab9ff",
                      }}
                    />
                    <span className="text-[8px] text-[#7e7388]">
                      {(6 + i).toString().padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-[#e8e8ea] p-4">
                <p className="text-xs text-[#7e7388] mb-1">Ingreso estimado hoy</p>
                <p className="text-xl font-bold text-[#1a1c1e]">₡312,750</p>
                <p className="text-xs text-[#1b6b43] mt-1 flex items-center gap-1">
                  <TrendingUp size={11} />+8.2%
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#e8e8ea] p-4">
                <p className="text-xs text-[#7e7388] mb-1">Km recorridos</p>
                <p className="text-xl font-bold text-[#1a1c1e]">847</p>
                <p className="text-xs text-[#4d4356] mt-1">en 5 unidades</p>
              </div>
              <div className="bg-white rounded-xl border border-[#e8e8ea] p-4">
                <p className="text-xs text-[#7e7388] mb-1">Evasión de tarifa</p>
                <p className="text-xl font-bold text-[#c66b00]">3.2%</p>
                <p className="text-xs text-[#1b6b43] mt-1 flex items-center gap-1">
                  <TrendingDown size={11} />-1.1%
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#e8e8ea] p-4">
                <p className="text-xs text-[#7e7388] mb-1">NPS pasajeros</p>
                <p className="text-xl font-bold text-[#1a1c1e]">+42</p>
                <p className="text-xs text-[#4d4356] mt-1">124 encuestas</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#e8e8ea] p-4">
              <h3 className="font-semibold text-[#1a1c1e] text-sm mb-3">Paradas con mayor demanda</h3>
              {[
                { name: "Terminal 7-10", count: 312, pct: 100 },
                { name: "Sabana Norte", count: 198, pct: 64 },
                { name: "Pavas Centro", count: 156, pct: 50 },
                { name: "CCSS Central", count: 134, pct: 43 },
                { name: "Escazú Centro", count: 98, pct: 31 },
              ].map((stop) => (
                <div key={stop.name} className="flex items-center gap-3 mb-2.5 last:mb-0">
                  <MapPin size={12} className="text-[#6e00c7] shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-[#1a1c1e]">{stop.name}</span>
                      <span className="text-[#4d4356]">{stop.count}</span>
                    </div>
                    <div className="h-1.5 bg-[#eeeef0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${stop.pct}%`, background: "#6e00c7" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
