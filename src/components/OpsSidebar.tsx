"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "Mapa de Operaciones", icon: "🗺️", href: "/ops" },
  { label: "Gestión de Rutas", icon: "🛣️", href: "/ops/routes" },
  { label: "Conductores", icon: "🧑‍✈️", href: "/ops/drivers" },
  { label: "Flota", icon: "🚌", href: "/ops/fleet" },
  { label: "Desempeño", icon: "📈", href: "/ops/performance", soon: true },
  { label: "Alertas de Seguridad", icon: "⚠️", href: "/ops/safety", soon: true },
];

export default function OpsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 bg-surface-container-low border-r border-outline-variant flex flex-col">
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-black">
          R
        </div>
        <div>
          <Link href="/" className="block text-headline-md font-bold text-primary">
            Rumbo
          </Link>
          <p className="text-label-md text-on-surface-variant">
            Central de Operaciones
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          if (item.soon) {
            return (
              <span
                key={item.label}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-label-lg font-semibold text-outline/60 cursor-not-allowed"
                title="Próximamente"
              >
                <span aria-hidden>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                <span className="text-[9px] uppercase tracking-wider bg-surface-container-high px-1.5 py-0.5 rounded">
                  pronto
                </span>
              </span>
            );
          }
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-label-lg font-semibold transition-colors ${
                active
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-outline-variant flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold">
          AC
        </div>
        <div>
          <p className="text-label-lg font-bold">Alex Chen</p>
          <p className="text-[10px] uppercase tracking-widest text-outline">
            Despachador
          </p>
        </div>
      </div>
    </aside>
  );
}
