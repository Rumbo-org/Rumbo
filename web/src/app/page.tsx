import Link from "next/link";
import {
  MapPin,
  Clock,
  Shield,
  Star,
  Bus,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-full bg-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-[#e8e8ea]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#6e00c7" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 20l8-4 8 4L12 2z" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[#1a1c1e]">Rumbo</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/pasajero" className="text-sm text-[#4d4356] hover:text-[#6e00c7] transition-colors">
              Mapa
            </Link>
            <Link href="/favoritos" className="text-sm text-[#4d4356] hover:text-[#6e00c7] transition-colors">
              Favoritos
            </Link>
            <Link href="/seguridad" className="text-sm text-[#4d4356] hover:text-[#6e00c7] transition-colors">
              Seguridad
            </Link>
            <Link href="/operador" className="text-sm text-[#4d4356] hover:text-[#6e00c7] transition-colors">
              Operador
            </Link>
            <Link href="/conductor" className="text-sm text-[#4d4356] hover:text-[#6e00c7] transition-colors">
              Conductor
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden md:block px-4 py-2 text-sm font-semibold text-[#6e00c7] hover:bg-[#f9f7ff] rounded-lg transition-colors"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/pasajero"
              className="px-4 py-2 text-sm font-bold text-white rounded-lg transition-all hover:opacity-90"
              style={{ background: "#6e00c7" }}
            >
              Ver mapa
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2b0053 0%, #6e00c7 50%, #8f00ff 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full" style={{ background: "#dab9ff", filter: "blur(80px)" }} />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full" style={{ background: "#bc0100", filter: "blur(100px)" }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold" style={{ background: "rgba(255,255,255,0.15)", color: "#dab9ff" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#44ddc1] animate-pulse" />
              Costa Rica · GPS en tiempo real
            </div>
            <h1
              className="font-extrabold text-white mb-6 leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.02em" }}
            >
              Sé a dónde vas.
              <br />
              Llega con certeza.
            </h1>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Rumbo muestra la ubicación de los buses en tiempo real. Sin suposiciones,
              sin aplicaciones que instalar — solo abre el navegador y ve cuándo llega tu ruta.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pasajero"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[#6e00c7] transition-all hover:scale-105 shadow-lg"
                style={{ background: "#ffffff" }}
              >
                <MapPin size={18} />
                Abrir mapa en vivo
              </Link>
              <Link
                href="/registro"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white border border-white/30 hover:bg-white/10 transition-all"
              >
                Crear cuenta gratis
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Mock phone UI */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="w-60 bg-black rounded-3xl shadow-2xl overflow-hidden border-4 border-white/10" style={{ height: "460px" }}>
            <div className="h-full relative">
              <div className="flex-1 h-64 bg-[#dbe9d9] relative overflow-hidden">
                <div className="absolute inset-0" style={{
                  backgroundImage: "linear-gradient(#c5d5c0 1px, transparent 1px), linear-gradient(90deg, #c5d5c0 1px, transparent 1px)",
                  backgroundSize: "28px 28px"
                }} />
                {[
                  { x: "28%", y: "30%", num: "1", color: "#6e00c7" },
                  { x: "52%", y: "48%", num: "200", color: "#6e00c7" },
                  { x: "68%", y: "62%", num: "330", color: "#c66b00" },
                ].map((m) => (
                  <div
                    key={m.num}
                    className="absolute px-1.5 py-0.5 rounded-full text-white font-bold shadow"
                    style={{ left: m.x, top: m.y, background: m.color, fontSize: "9px" }}
                  >
                    {m.num}
                  </div>
                ))}
                <div className="absolute w-3 h-3 rounded-full border-2 border-white shadow" style={{ left: "44%", top: "44%", background: "#6e00c7" }} />
              </div>
              <div className="bg-white p-3 h-full">
                <div className="w-8 h-1 rounded-full bg-gray-200 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-800 mb-2">Rutas cercanas</p>
                {[
                  { num: "1", name: "Alajuela", eta: "4 min", ok: true },
                  { num: "200", name: "Pavas", eta: "2 min", ok: true },
                  { num: "330", name: "Escazú", eta: "15 min", ok: false },
                ].map((r) => (
                  <div key={r.num} className="flex items-center gap-2 py-2 border-b border-gray-100">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: r.ok ? "#6e00c7" : "#c66b00" }}>
                      <span style={{ fontSize: "8px", color: "white", fontWeight: "bold" }}>{r.num}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-800">{r.name}</p>
                      <p className="text-[10px] text-gray-500">{r.ok ? "A tiempo" : "Retrasado"}</p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: r.ok ? "#1b6b43" : "#c66b00" }}>{r.eta}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-8 border-b border-[#e8e8ea] bg-[#f9f9fc]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "48", label: "rutas cubiertas" },
              { value: "127", label: "buses activos" },
              { value: "4.4★", label: "calificación" },
              { value: "CR", label: "Costa Rica" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-extrabold text-[#6e00c7]">{s.value}</p>
                <p className="text-xs text-[#4d4356] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-[#1a1c1e] mb-3" style={{ letterSpacing: "-0.02em" }}>
            Todo lo que necesitas para moverte
          </h2>
          <p className="text-[#4d4356] max-w-xl mx-auto">
            Diseñado para funcionar en cualquier celular, sin instalación, incluso con mala señal.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: MapPin, title: "GPS en tiempo real", desc: "Ve exactamente dónde está cada bus en el mapa. Sin estimaciones — posición real actualizada cada 10 segundos.", color: "#6e00c7", bg: "#f3ebff" },
            { icon: Clock, title: "Tiempo de llegada preciso", desc: "Calculamos el ETA basado en la posición GPS actual del bus, el tráfico y el historial de la ruta.", color: "#c66b00", bg: "#fff6e8" },
            { icon: Star, title: "Evaluaciones verificadas", desc: "Solo pasajeros que tomaron el bus pueden calificar. Datos reales para tomar mejores decisiones.", color: "#1b6b43", bg: "#e8f5ee" },
            { icon: Shield, title: "Botón de seguridad", desc: "Un toque envía tu ubicación GPS a tus contactos de emergencia. Discreto, rápido y siempre accesible.", color: "#bc0100", bg: "#fff0f0" },
            { icon: Bus, title: "Sin app que instalar", desc: "Funciona directo en el navegador de tu celular. Sin espacio de almacenamiento, sin permisos extra.", color: "#6e00c7", bg: "#f3ebff" },
            { icon: BarChart3, title: "Para operadores", desc: "Dashboard completo de flota: monitoreo en tiempo real, análisis de demanda y reportes de puntualidad.", color: "#1a1c1e", bg: "#f3f3f6" },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="border border-[#e8e8ea] rounded-2xl p-6 hover:border-[#6e00c7] transition-colors">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: f.bg }}>
                  <Icon size={22} style={{ color: f.color }} />
                </div>
                <h3 className="font-bold text-[#1a1c1e] mb-2">{f.title}</h3>
                <p className="text-sm text-[#4d4356] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOR OPERATORS */}
      <section id="operators" className="py-20" style={{ background: "#f3f3f6" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: "#eeeef0", color: "#4d4356" }}>
                Para operadores de flota
              </div>
              <h2 className="text-3xl font-extrabold text-[#1a1c1e] mb-4" style={{ letterSpacing: "-0.02em" }}>
                Gestiona tu flota. Reduce costos. Mejora tu servicio.
              </h2>
              <p className="text-[#4d4356] mb-6 leading-relaxed">
                Rumbo instala datos GPS en tu flota y te da visibilidad completa de cada unidad
                en tiempo real. Identifica retrasos, optimiza frecuencias y justifica tus concesiones con datos objetivos.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Monitoreo GPS de toda tu flota en un solo mapa",
                  "Alertas automáticas de retrasos y desvíos",
                  "Análisis de demanda por parada y horario",
                  "Reportes de puntualidad para cumplimiento regulatorio",
                  "Detección de evasión de tarifa",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#1a1c1e]">
                    <CheckCircle2 size={16} className="text-[#6e00c7] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/operador"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
                style={{ background: "#1a1c1e" }}
              >
                Ver demo del dashboard
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-white rounded-2xl border border-[#e8e8ea] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-[#7e7388]">Flota activa ahora</p>
                  <p className="text-2xl font-extrabold text-[#1a1c1e]">5 de 6 unidades</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "#e8f5ee" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1b6b43]" />
                  <span className="text-xs font-semibold text-[#1b6b43]">En vivo</span>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {[
                  { id: "1042", route: "1", status: "on_time", speed: 48 },
                  { id: "1073", route: "200", status: "on_time", speed: 29 },
                  { id: "1098", route: "330", status: "delayed", speed: 18 },
                  { id: "1155", route: "400", status: "on_time", speed: 33 },
                ].map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#f9f9fc]">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: b.status === "delayed" ? "#c66b00" : "#6e00c7" }}>
                      {b.route}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-[#1a1c1e]">Bus {b.id}</p>
                      <p className="text-[10px] text-[#7e7388]">{b.speed} km/h</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: b.status === "delayed" ? "#fff3e0" : "#e8f5ee", color: b.status === "delayed" ? "#c66b00" : "#1b6b43" }}>
                      {b.status === "delayed" ? "Retraso" : "A tiempo"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#e8e8ea]">
                {[
                  { label: "Puntualidad", value: "83%" },
                  { label: "Pasajeros", value: "1,247" },
                  { label: "Calificación", value: "4.3★" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-base font-bold text-[#1a1c1e]">{s.value}</p>
                    <p className="text-[10px] text-[#7e7388]">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center" style={{ background: "linear-gradient(135deg, #2b0053 0%, #6e00c7 100%)" }}>
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-white mb-4" style={{ letterSpacing: "-0.02em" }}>
            Empieza ahora. Es gratis.
          </h2>
          <p className="text-white/70 mb-8">Sin tarjeta de crédito. Sin descargar nada. Solo abre el mapa.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/pasajero" className="px-8 py-4 rounded-xl font-bold text-[#6e00c7] bg-white transition-all hover:scale-105 shadow-xl">
              Abrir mapa en vivo
            </Link>
            <Link href="/registro" className="px-8 py-4 rounded-xl font-bold text-white border border-white/30 hover:bg-white/10 transition-all">
              Crear cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8" style={{ background: "#1a1c1e" }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#6e00c7" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 20l8-4 8 4L12 2z" fill="white" />
              </svg>
            </div>
            <span className="text-white font-bold">Rumbo</span>
          </div>
          <p className="text-[#7e7388] text-xs">© 2026 Rumbo · Movilidad inteligente para Costa Rica</p>
          <div className="flex items-center gap-4">
            <Link href="/conductor" className="text-[#7e7388] text-xs hover:text-white transition-colors">Conductores</Link>
            <Link href="/operador" className="text-[#7e7388] text-xs hover:text-white transition-colors">Operadores</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
