"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  AlertOctagon,
  Share2,
  Users,
  Plus,
  CheckCircle2,
  Trash2,
  Radio,
  Lock,
  Lightbulb,
  Eye,
  Map,
  Bell,
  Megaphone,
  MapPin,
  Shield,
  Globe,
  Smartphone,
} from "lucide-react";

const TRUSTED_CONTACTS = [
  { id: 1, initials: "JD", name: "Jane Doe", phone: "+506 8000-1234", verified: true, bg: "#efdbff", color: "#6e00c7" },
  { id: 2, initials: "MS", name: "Mark Smith", phone: "+506 8000-5678", verified: false, bg: "#ffdad4", color: "#bc0100" },
];

const SAFETY_TIPS = [
  { icon: Eye, title: "Mantente alerta", desc: "Presta atención a tu entorno y evita distraerte con el celular por períodos prolongados." },
  { icon: Users, title: "Siéntate cerca de otros", desc: "En la noche, prefiere vagones bien iluminados o asientos cerca del conductor." },
  { icon: Map, title: "Planifica con anticipación", desc: "Revisa tu ruta y horarios antes de salir para minimizar el tiempo de espera en las paradas." },
  { icon: Bell, title: "Confía en tu instinto", desc: "Si una situación se siente incómoda, muévete a otra área o baja en la próxima parada segura." },
];

export default function SeguridadPage() {
  const [contacts, setContacts] = useState(TRUSTED_CONTACTS);
  const [checkInEnabled, setCheckInEnabled] = useState(true);
  const [privacyEnabled, setPrivacyEnabled] = useState(true);
  const [sosActive, setSosActive] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const handleSOS = () => {
    setSosActive(true);
    setTimeout(() => setSosActive(false), 3000);
  };

  const removeContact = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-full bg-[#f9f9fc] text-[#1a1c1e] font-[Inter,sans-serif] flex flex-col">
      {/* Top Nav */}
      <header className="bg-white border-b border-[#cfc2d9] sticky top-0 z-50 h-16">
        <div className="flex justify-between items-center w-full max-w-[1280px] mx-auto px-10 h-full">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#6e00c7" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 20l8-4 8 4L12 2z" fill="white" />
                </svg>
              </div>
              <span className="text-xl font-extrabold" style={{ color: "#6e00c7" }}>Rumbo</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/pasajero" className="text-sm font-medium text-[#4d4356] hover:text-[#6e00c7] transition-colors">Rutas</Link>
              <Link href="/favoritos" className="text-sm font-medium text-[#4d4356] hover:text-[#6e00c7] transition-colors">Favoritos</Link>
              <Link href="/seguridad" className="text-sm font-bold border-b-2 pb-1" style={{ color: "#6e00c7", borderColor: "#6e00c7" }}>Seguridad</Link>
              <Link href="/pasajero" className="text-sm font-medium text-[#4d4356] hover:text-[#6e00c7] transition-colors">Ajustes</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7e7388]" />
              <input
                className="pl-9 pr-4 py-2 rounded-full bg-[#eeeef0] border-none outline-none text-sm w-60 focus:ring-2"
                placeholder="Buscar rutas..."
              />
            </div>
            <Link href="/login" className="px-6 py-2 rounded-full font-bold text-white text-sm hover:opacity-90 transition-all active:scale-95" style={{ background: "#6e00c7" }}>
              Ingresar
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-10 py-10">
        {/* Hero / SOS Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-12">
          {/* Hero card — 8 cols */}
          <div className="lg:col-span-8 bg-[#f3f3f6] rounded-xl p-8 flex flex-col md:flex-row items-center justify-between border border-[#cfc2d9]">
            <div className="max-w-md">
              <h1 className="text-[32px] font-bold leading-10 tracking-tight text-[#1a1c1e] mb-2">
                Centro de Seguridad
              </h1>
              <p className="text-base text-[#4d4356] mb-6 leading-relaxed">
                Tu seguridad es nuestra prioridad. Accede a herramientas de emergencia y administra tu círculo de seguridad en un solo lugar.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleSOS}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white text-sm transition-all active:scale-95"
                  style={{
                    background: "#ba1a1a",
                    animation: sosActive ? "none" : "pulse-red 2s infinite",
                    boxShadow: sosActive ? "0 0 0 0 rgba(186,26,26,0)" : undefined,
                  }}
                >
                  <AlertOctagon size={18} />
                  {sosActive ? "¡SOS Enviado!" : "Emergencia SOS"}
                </button>
                <button
                  onClick={() => setSharing((s) => !s)}
                  className="flex items-center gap-2 border px-6 py-3 rounded-lg font-bold text-sm transition-all hover:bg-[#eeeef0]"
                  style={{ borderColor: "#7e7388", color: sharing ? "#6e00c7" : "#1a1c1e" }}
                >
                  <Share2 size={18} />
                  {sharing ? "Compartiendo viaje..." : "Compartir viaje"}
                </button>
              </div>
              {sosActive && (
                <p className="mt-4 text-sm font-semibold" style={{ color: "#ba1a1a" }}>
                  Notificando a tus contactos de confianza y servicios de emergencia...
                </p>
              )}
            </div>
            {/* Shield decoration */}
            <div className="hidden md:flex items-center justify-center w-56 h-56 shrink-0">
              <div className="w-56 h-56 rounded-full flex items-center justify-center" style={{ background: "rgba(110,0,199,0.05)" }}>
                <div className="w-44 h-44 rounded-full flex items-center justify-center" style={{ background: "rgba(110,0,199,0.08)" }}>
                  <Shield size={80} strokeWidth={1} style={{ color: "#6e00c7" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Report Incident card — 4 cols */}
          <div
            className="lg:col-span-4 rounded-xl p-8 flex flex-col justify-center border"
            style={{ background: "#eb0000", borderColor: "rgba(188,1,0,0.2)", color: "white" }}
          >
            <div className="mb-4">
              <Megaphone size={40} className="mb-2" />
              <h3 className="text-xl font-semibold">Reportar incidente</h3>
            </div>
            <p className="text-sm mb-6 opacity-90 leading-relaxed">
              Ayuda a mantener la comunidad segura. Reporta actividad sospechosa o problemas de seguridad de forma anónima.
            </p>
            <button
              onClick={() => setReportOpen(true)}
              className="w-full py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: "white", color: "#bc0100" }}
            >
              Iniciar reporte anónimo
            </button>
          </div>
        </section>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left column — 7 cols */}
          <div className="lg:col-span-7 space-y-4">
            {/* Trusted Contacts */}
            <div className="bg-white rounded-xl p-6 border border-[#cfc2d9] shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[#1a1c1e] flex items-center gap-2">
                  <Users size={20} style={{ color: "#6e00c7" }} />
                  Contactos de confianza
                </h2>
                <button className="flex items-center gap-1 text-sm font-bold hover:underline" style={{ color: "#6e00c7" }}>
                  <Plus size={18} />
                  Agregar
                </button>
              </div>
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-4 bg-[#f9f9fc] rounded-lg border border-[#e8e8ea]"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                        style={{ background: contact.bg, color: contact.color }}
                      >
                        {contact.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1c1e]">{contact.name}</p>
                        <p className="text-sm text-[#4d4356]">{contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {contact.verified ? (
                        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#68fadd", color: "#00201a" }}>
                          <CheckCircle2 size={12} />
                          Verificado
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#e8e8ea", color: "#4d4356" }}>
                          Pendiente
                        </span>
                      )}
                      <button
                        onClick={() => removeContact(contact.id)}
                        className="p-2 text-[#7e7388] hover:text-[#ba1a1a] transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {contacts.length === 0 && (
                  <div className="py-8 text-center text-[#7e7388]">
                    <Users size={36} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No tienes contactos de confianza aún</p>
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm text-[#4d4356] italic">
                Tus contactos serán notificados automáticamente si activas el SOS o compartes tu viaje.
              </p>
            </div>

            {/* Feature toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleCard
                icon={<Radio size={28} style={{ color: "#6e00c7" }} />}
                title="Check-in automático"
                desc="Recibe un aviso para confirmar que llegaste bien si el sistema detecta una parada inesperada."
                enabled={checkInEnabled}
                onToggle={() => setCheckInEnabled((v) => !v)}
              />
              <ToggleCard
                icon={<Lock size={28} style={{ color: "#6e00c7" }} />}
                title="Bloqueo de privacidad"
                desc="Oculta tu historial de destinos y lugares favoritos de vistas de perfil público."
                enabled={privacyEnabled}
                onToggle={() => setPrivacyEnabled((v) => !v)}
              />
            </div>
          </div>

          {/* Right column — 5 cols */}
          <div className="lg:col-span-5 space-y-4">
            {/* Safety tips */}
            <div className="bg-[#e2e2e5] rounded-xl overflow-hidden border border-[#cfc2d9] shadow-sm">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#1a1c1e] mb-6 flex items-center gap-2">
                  <Lightbulb size={20} style={{ color: "#6e00c7" }} />
                  Consejos de seguridad en el transporte
                </h2>
                <ul className="space-y-4">
                  {SAFETY_TIPS.map((tip) => {
                    const Icon = tip.icon;
                    return (
                      <li key={tip.title} className="flex gap-4">
                        <div className="p-2 rounded-lg h-fit shrink-0" style={{ background: "rgba(110,0,199,0.1)" }}>
                          <Icon size={20} style={{ color: "#6e00c7" }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#1a1c1e]">{tip.title}</p>
                          <p className="text-sm text-[#4d4356] mt-0.5 leading-relaxed">{tip.desc}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {/* Decorative strip */}
              <div className="h-24 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2b0053, #6e00c7)" }}>
                <div className="flex items-center gap-3 text-white">
                  <Shield size={32} strokeWidth={1.5} />
                  <div>
                    <p className="font-bold text-sm">Movilidad segura para todos</p>
                    <p className="text-xs opacity-75">Costa Rica · Rumbo Mobility</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Safe Zones */}
            <div className="bg-white rounded-xl p-6 border border-[#cfc2d9] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[#7e7388]">Zonas seguras cercanas</h3>
                <MapPin size={18} style={{ color: "#6e00c7" }} />
              </div>
              {/* Mini map placeholder — replaced with styled placeholder for safe zones */}
              <div
                className="h-48 rounded-lg relative overflow-hidden flex items-center justify-center"
                style={{ background: "#dbe9d9" }}
              >
                {/* Map grid */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "linear-gradient(#c5d5c0 1px, transparent 1px), linear-gradient(90deg, #c5d5c0 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                {/* Help point card */}
                <div
                  className="relative z-10 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(110,0,199,0.2)",
                  }}
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "#f3ebff" }}>
                    <Shield size={18} style={{ color: "#6e00c7" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#1a1c1e]">Punto de ayuda más cercano</p>
                    <p className="text-[10px] text-[#4d4356]">Estación Central · 250 m</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 rounded-lg text-sm font-bold transition-colors hover:bg-[#f3ebff]" style={{ color: "#6e00c7" }}>
                Ver todas las zonas seguras
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#eeeef0] border-t border-[#cfc2d9] mt-12">
        <div className="w-full py-10 px-10 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1 items-center md:items-start">
            <span className="font-bold text-[#1a1c1e]">Rumbo</span>
            <p className="text-xs text-[#4d4356]">Impulsando la movilidad urbana con inteligencia.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            {["Acerca de", "Términos de uso", "Privacidad", "Contacto", "Accesibilidad"].map((item) => (
              <a key={item} href="#" className="text-xs text-[#4d4356] hover:text-[#6e00c7] transition-colors font-medium underline">
                {item}
              </a>
            ))}
          </nav>
          <div className="text-right">
            <p className="text-xs text-[#4d4356]">© 2026 Rumbo Mobility. Todos los derechos reservados.</p>
            <div className="flex gap-3 mt-2 justify-end">
              <button className="text-[#7e7388] hover:text-[#6e00c7] transition-colors"><Globe size={18} /></button>
              <button className="text-[#7e7388] hover:text-[#6e00c7] transition-colors"><Smartphone size={18} /></button>
            </div>
          </div>
        </div>
      </footer>

      {/* Anonymous report modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-[#1a1c1e] mb-2">Reporte anónimo</h2>
            <p className="text-sm text-[#4d4356] mb-6">Tu identidad nunca será revelada. Descríbenos qué ocurrió.</p>
            <select className="w-full mb-4 p-3 border border-[#cfc2d9] rounded-xl text-sm outline-none focus:border-[#6e00c7]">
              <option>Tipo de incidente...</option>
              <option>Actividad sospechosa</option>
              <option>Conductor imprudente</option>
              <option>Bus en mal estado</option>
              <option>Acoso o amenaza</option>
              <option>Otro</option>
            </select>
            <textarea
              className="w-full p-3 border border-[#cfc2d9] rounded-xl text-sm outline-none focus:border-[#6e00c7] resize-none"
              rows={4}
              placeholder="Describe el incidente..."
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setReportOpen(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm border border-[#cfc2d9] text-[#1a1c1e] hover:bg-[#f3f3f6] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => setReportOpen(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                style={{ background: "#ba1a1a" }}
              >
                Enviar reporte
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(186,26,26,0.7); }
          70% { box-shadow: 0 0 0 15px rgba(186,26,26,0); }
          100% { box-shadow: 0 0 0 0 rgba(186,26,26,0); }
        }
      `}</style>
    </div>
  );
}

function ToggleCard({
  icon, title, desc, enabled, onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white rounded-xl p-6 border border-[#cfc2d9] shadow-sm flex flex-col">
      <div className="mb-3">{icon}</div>
      <h3 className="text-xl font-semibold text-[#1a1c1e] mb-2">{title}</h3>
      <p className="text-sm text-[#4d4356] flex-grow mb-6 leading-relaxed">{desc}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1a1c1e]">{enabled ? "Activo" : "Activar"}</span>
        <button
          onClick={onToggle}
          className="w-12 h-6 rounded-full relative transition-all"
          style={{ background: enabled ? "#6e00c7" : "#cfc2d9" }}
        >
          <div
            className="absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm"
            style={{ left: enabled ? "calc(100% - 20px)" : "4px" }}
          />
        </button>
      </div>
    </div>
  );
}
