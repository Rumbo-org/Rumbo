import Link from "next/link";

const surfaces = [
  {
    href: "/passenger",
    title: "Pasajero",
    desc: "Buscá rutas, mirá el bus en vivo y calificá tu viaje.",
    icon: "🧍",
    accent: "bg-primary text-on-primary",
  },
  {
    href: "/driver",
    title: "Conductor",
    desc: "Transmití tu ubicación GPS desde el celular en un toque.",
    icon: "🚌",
    accent: "bg-tertiary text-on-tertiary",
  },
  {
    href: "/ops",
    title: "Operaciones",
    desc: "Dashboard central: flota en vivo, métricas y alertas.",
    icon: "🛰️",
    accent: "bg-secondary text-on-secondary",
  },
];

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-3xl w-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-lg bg-primary text-on-primary flex items-center justify-center text-xl font-black">
            R
          </div>
          <h1 className="text-headline-lg font-black text-primary">Rumbo</h1>
        </div>
        <p className="text-on-surface-variant text-lg mb-10 max-w-xl">
          Plataforma de movilidad en transporte público para Costa Rica.
          Rastreo GPS en tiempo real, planificación de rutas y operaciones.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {surfaces.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group rounded-lg border border-outline-variant bg-surface-container-lowest p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4 ${s.accent}`}
              >
                {s.icon}
              </div>
              <h2 className="text-headline-md font-bold mb-1">{s.title}</h2>
              <p className="text-sm text-on-surface-variant">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-label-lg font-semibold text-primary">
                Abrir
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-xs text-outline">
          MVP hackathon · Datos en vivo vía Supabase Realtime · Mapas por Google
          Maps
        </p>
      </div>
    </main>
  );
}
