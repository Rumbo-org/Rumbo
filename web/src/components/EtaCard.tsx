"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Clock, Users, Star, X, Navigation } from "lucide-react";
import type { Bus } from "@/lib/types";

interface EtaCardProps {
  bus: Bus;
  onClose: () => void;
  onFollow: () => void;
}

const STATUS_LABEL = {
  on_time: "A tiempo",
  delayed: "Retrasado",
  stale: "Sin señal",
};

const STATUS_COLORS = {
  on_time: "bg-[#e8f5ee] text-[#1b6b43]",
  delayed: "bg-[#fff3e0] text-[#c66b00]",
  stale: "bg-[#f5f5f5] text-[#757575]",
};

const CAPACITY_LABEL = {
  low: "Poca gente",
  medium: "Moderado",
  high: "Lleno",
};

const CAPACITY_ICON_COLOR = {
  low: "#1b6b43",
  medium: "#c66b00",
  high: "#bc0100",
};

export default function EtaCard({ bus, onClose, onFollow }: EtaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // startRef: clientX/Y minus posRef at drag start — makes move math trivial
  const startRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const dimsRef = useRef({ w: 0, h: 0 });
  const dragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  // Stable values — no Math.random() in render
  const rating = (parseInt(bus.id.replace("b", "")) % 5) + 1;
  const updatedSecondsAgo = (parseInt(bus.id.replace("b", "")) % 8) + 2;

  useEffect(() => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      dimsRef.current = { w: rect.width, h: rect.height };
    }
  }, []);

  const clamp = useCallback((x: number, y: number) => {
    const { w, h } = dimsRef.current;
    // Card natural position: top=72, left=12 (matches absolute positioning in pasajero/page.tsx)
    const natLeft = 12;
    const natTop = 72;
    return {
      x: Math.max(-natLeft, Math.min(x, window.innerWidth - natLeft - w)),
      y: Math.max(60 - natTop, Math.min(y, window.innerHeight - natTop - h - 20)),
    };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    };
    dragging.current = true;
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !cardRef.current) return;
    const { x, y } = clamp(
      e.clientX - startRef.current.x,
      e.clientY - startRef.current.y,
    );
    cardRef.current.style.transform = `translate(${x}px, ${y}px)`;
  }, [clamp]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !cardRef.current) return;
    const { x, y } = clamp(
      e.clientX - startRef.current.x,
      e.clientY - startRef.current.y,
    );
    posRef.current = { x, y };
    cardRef.current.style.transform = `translate(${x}px, ${y}px)`;
    dragging.current = false;
    setIsDragging(false);
  }, [clamp]);

  const handleDoubleClick = useCallback(() => {
    posRef.current = { x: 0, y: 0 };
    if (cardRef.current) {
      cardRef.current.style.transform = "translate(0px, 0px)";
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-white rounded-xl shadow-xl border border-[#e8e8ea] overflow-hidden"
      style={{ userSelect: "none", touchAction: "none" }}
    >
      {/* Drag handle */}
      <div
        className="flex justify-center items-center pt-2.5 pb-1"
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        aria-label="Arrastrar tarjeta"
      >
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-[#cfc2d9]" />
          <div className="w-1 h-1 rounded-full bg-[#cfc2d9]" />
          <div className="w-1 h-1 rounded-full bg-[#cfc2d9]" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between px-4 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
            style={{ background: bus.status === "delayed" ? "#c66b00" : "#6e00c7" }}
          >
            {bus.routeNumber}
          </div>
          <div>
            <p className="font-semibold text-[#1a1c1e] text-sm leading-tight">
              {bus.routeName}
            </p>
            <p className="text-xs text-[#4d4356] mt-0.5">Bus #{bus.id.replace("b", "0")}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[#eeeef0] transition-colors"
          aria-label="Cerrar"
        >
          <X size={16} className="text-[#4d4356]" />
        </button>
      </div>

      {/* ETA */}
      <div className="px-4 pb-3">
        <div className="flex items-baseline gap-2">
          <span
            className="font-extrabold text-[#1a1c1e]"
            style={{ fontSize: "42px", lineHeight: 1, letterSpacing: "-0.03em" }}
          >
            {bus.etaMinutes}
          </span>
          <span className="text-[#4d4356] text-base font-medium">min</span>
          <span
            className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[bus.status]}`}
          >
            {STATUS_LABEL[bus.status]}
          </span>
        </div>
        <p className="text-xs text-[#7e7388] mt-1 flex items-center gap-1">
          <Clock size={11} />
          Actualizado hace {updatedSecondsAgo}s · {bus.speed} km/h
        </p>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 px-4 pb-3">
        <div className="flex items-center gap-1.5 text-xs text-[#4d4356]">
          <Users size={13} style={{ color: CAPACITY_ICON_COLOR[bus.capacity] }} />
          {CAPACITY_LABEL[bus.capacity]}
        </div>
        <div className="w-px bg-[#e8e8ea]" />
        <div className="flex items-center gap-1.5 text-xs text-[#4d4356]">
          <Star size={13} className="fill-[#f59e0b] text-[#f59e0b]" />
          4.{rating} · 124 viajes
        </div>
      </div>

      {/* Action */}
      <div className="px-4 pb-4">
        <button
          onClick={onFollow}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ background: "#6e00c7" }}
        >
          <Navigation size={15} />
          Seguir esta unidad
        </button>
      </div>
    </div>
  );
}
