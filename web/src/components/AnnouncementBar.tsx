"use client";
import { useState, useEffect } from "react";

const ADS = [
  {
    id: "imperial",
    accent: "#c8963e",
    bg: "#fffbf2",
    emoji: "🍺",
    brand: "Imperial",
    tagline: "La más costarricense. Siempre.",
  },
  {
    id: "hospital_universal",
    accent: "#0284c7",
    bg: "#f0f9ff",
    emoji: "🏥",
    brand: "Hospital Universal",
    tagline: "Tu salud, nuestra prioridad.",
  },
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ADS.length);
        setVisible(true);
      }, 350);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const ad = ADS[index];

  return (
    <>
      <style>{`@keyframes adprogress { from { width: 0% } to { width: 100% } }`}</style>
      <div
        className="mx-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(5px)",
          transition: "opacity 0.35s ease, transform 0.35s ease",
        }}
      >
        <div
          className="flex items-center rounded-2xl shadow-md overflow-hidden"
          style={{ background: ad.bg, border: `1.5px solid ${ad.accent}33` }}
        >
          {/* Brand accent column */}
          <div
            className="w-14 self-stretch flex items-center justify-center text-2xl shrink-0"
            style={{ background: `${ad.accent}28` }}
          >
            {ad.emoji}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 px-3 py-3">
            <p className="font-bold text-sm text-[#1a1c1e] leading-tight">{ad.brand}</p>
            <p className="text-xs text-[#4d4356] mt-0.5">{ad.tagline}</p>
          </div>

          {/* Pub label */}
          <span className="text-[10px] text-[#7e7388] font-medium uppercase tracking-wide pr-3 shrink-0">
            Pub.
          </span>
        </div>

        {/* Progress bar */}
        <div className="mx-2 mt-1.5 h-[2px] bg-[#e8e8ea] rounded-full overflow-hidden">
          <div
            key={`${index}-bar`}
            className="h-full rounded-full"
            style={{ background: ad.accent, animation: "adprogress 4.5s linear forwards" }}
          />
        </div>
      </div>
    </>
  );
}
