"use client";

import type { Bus } from "@/lib/types";

const STATUS_COLORS = {
  on_time: { bg: "#1b6b43", text: "#ffffff" },
  delayed: { bg: "#c66b00", text: "#ffffff" },
  stale: { bg: "#757575", text: "#ffffff" },
};

interface BusMarkerProps {
  bus: Bus;
  selected: boolean;
}

export default function BusMarker({ bus, selected }: BusMarkerProps) {
  const colors = STATUS_COLORS[bus.status];

  return (
    // relative is required so the pulse-ring (absolute inset-0) positions correctly
    <div className="relative cursor-pointer select-none">
      {selected && (
        <div
          className="absolute inset-0 rounded-full pulse-ring"
          style={{ background: colors.bg, opacity: 0.3 }}
        />
      )}
      <div
        className="relative flex items-center gap-1 px-2 py-1 rounded-full shadow-lg border-2 transition-smooth"
        style={{
          background: colors.bg,
          color: colors.text,
          borderColor: selected ? "#ffffff" : "transparent",
          boxShadow: selected
            ? `0 0 0 3px ${colors.bg}40, 0 4px 12px rgba(0,0,0,0.3)`
            : "0 2px 8px rgba(0,0,0,0.25)",
          transform: selected ? "scale(1.15)" : "scale(1)",
        }}
      >
        <span style={{ fontSize: "11px", letterSpacing: "0.06em" }} className="font-bold">
          {bus.routeNumber}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ transform: `rotate(${bus.heading}deg)`, flexShrink: 0 }}
        >
          <path d="M12 2L4 20l8-4 8 4L12 2z" />
        </svg>
      </div>
    </div>
  );
}
