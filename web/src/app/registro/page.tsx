"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye, EyeOff, User, Mail, Lock, ShieldCheck,
  Info, CheckCircle2, BadgeCheck, HelpCircle, Globe,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { PasswordStrength } from "@/lib/types";

function getStrength(password: string): PasswordStrength {
  if (password.length === 0)
    return { bars: 0, label: "Mínimo 8 caracteres requeridos.", color: "#7e7388", icon: <Info size={13} /> };
  if (password.length < 8)
    return { bars: 1, label: "Muy corta", color: "#ba1a1a", icon: <Info size={13} /> };
  if (password.length < 10)
    return { bars: 2, label: "Regular", color: "#bc0100", icon: <Info size={13} /> };
  if (password.length < 12)
    return { bars: 3, label: "Fuerte", color: "#44ddc1", icon: <CheckCircle2 size={13} /> };
  return { bars: 4, label: "Excelente", color: "#6e00c7", icon: <BadgeCheck size={13} /> };
}

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, val: string) => setForm((f) => ({ ...f, [field]: val }));
  const strength = getStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!terms) {
      setError("Debes aceptar los Términos de servicio.");
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name, role: "passenger" } },
    });
    setLoading(false);

    if (authError) {
      setError(
        authError.message.includes("already registered")
          ? "Este correo ya tiene una cuenta. Inicia sesión."
          : authError.message
      );
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/pasajero"), 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9fc] font-[Inter,sans-serif] text-[#1a1c1e]">
      {/* Top bar — igual que login */}
      <header className="w-full sticky top-0 bg-[#f9f9fc] z-50 border-b border-[#e8e8ea]">
        <div className="flex justify-between items-center px-6 md:px-10 py-4 w-full max-w-7xl mx-auto">
          <Link href="/" className="text-xl font-extrabold" style={{ color: "#6e00c7" }}>
            Rumbo
          </Link>
          <div className="flex items-center gap-4 text-[#4d4356]">
            <button className="hover:text-[#6e00c7] transition-colors"><HelpCircle size={20} /></button>
            <button className="hover:text-[#6e00c7] transition-colors"><Globe size={20} /></button>
          </div>
        </div>
      </header>

      {/* Main — igual estructura dos columnas que login */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div
          className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-2xl"
          style={{ minHeight: "680px", background: "white" }}
        >
          {/* Columna izquierda — panel oscuro idéntico al login */}
          <div className="hidden md:block relative overflow-hidden group">
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(160deg, #0d001f 0%, #2b0053 35%, #6e00c7 70%, #8f00ff 100%)",
              }}
            />
            {/* Trazos de luz decorativos */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 600 700" preserveAspectRatio="xMidYMid slice">
              <path d="M0,350 Q150,200 300,350 T600,350" stroke="#dab9ff" strokeWidth="2" fill="none" />
              <path d="M0,400 Q200,250 400,400 T800,400" stroke="#dab9ff" strokeWidth="1.5" fill="none" />
              <path d="M50,500 Q250,300 500,500" stroke="#a855f7" strokeWidth="1" fill="none" />
              <path d="M100,200 Q300,50 550,200" stroke="#dab9ff" strokeWidth="1" fill="none" />
              <circle cx="120" cy="280" r="2" fill="#dab9ff" opacity="0.8" />
              <circle cx="300" cy="180" r="1.5" fill="#dab9ff" opacity="0.6" />
              <circle cx="480" cy="320" r="2.5" fill="#dab9ff" opacity="0.9" />
              <circle cx="200" cy="450" r="1.5" fill="#a855f7" opacity="0.7" />
              <circle cx="420" cy="150" r="2" fill="#dab9ff" opacity="0.8" />
            </svg>
            {/* Texto inferior */}
            <div className="absolute bottom-12 left-10 right-10 z-20">
              <h2 className="text-[32px] font-bold leading-10 tracking-tight text-white drop-shadow-lg mb-4">
                Únete a la comunidad que se mueve mejor.
              </h2>
              <p className="text-base text-white/80 leading-relaxed drop-shadow">
                Rutas en tiempo real, seguimiento GPS y herramientas de seguridad, todo en un solo lugar.
              </p>
            </div>
            {/* Logo arriba */}
            <div className="absolute top-8 left-10 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 20l8-4 8 4L12 2z" fill="white" />
                </svg>
              </div>
              <span className="text-white font-extrabold text-xl">Rumbo</span>
            </div>
          </div>

          {/* Columna derecha — formulario */}
          <div className="flex flex-col justify-center px-6 py-10 md:px-14 lg:px-20 overflow-y-auto">
            {/* Encabezado */}
            <div className="mb-7">
              <h1 className="text-[32px] font-bold leading-10 tracking-tight text-[#1a1c1e] mb-2">
                {success ? `¡Bienvenido${form.name ? `, ${form.name.split(" ")[0]}` : ""}!` : "Crea tu cuenta"}
              </h1>
              <p className="text-base text-[#4d4356]">
                {success ? "Redirigiendo a Rumbo…" : "Acceso seguro a tu cuenta Rumbo"}
              </p>
            </div>

            {success ? (
              <div className="flex flex-col items-center py-10 gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: "#6e00c7" }}>
                  <CheckCircle2 size={32} className="text-white" />
                </div>
                <p className="text-sm text-[#4d4356]">Tu cuenta fue creada exitosamente.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nombre */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#4d4356] block">
                    Nombre completo
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cfc2d9]" />
                    <input
                      type="text"
                      placeholder="Alex Rivera"
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="w-full h-12 pl-11 pr-4 bg-white border border-[#cfc2d9] rounded-lg outline-none text-sm placeholder:text-[#cfc2d9]"
                      onFocus={(e) => (e.target.style.borderColor = "#6e00c7")}
                      onBlur={(e) => (e.target.style.borderColor = "#cfc2d9")}
                    />
                  </div>
                </div>

                {/* Correo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#4d4356] block">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cfc2d9]" />
                    <input
                      type="email"
                      placeholder="nombre@empresa.com"
                      required
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="w-full h-12 pl-11 pr-4 bg-white border border-[#cfc2d9] rounded-lg outline-none text-sm placeholder:text-[#cfc2d9]"
                      onFocus={(e) => (e.target.style.borderColor = "#6e00c7")}
                      onBlur={(e) => (e.target.style.borderColor = "#cfc2d9")}
                    />
                  </div>
                </div>

                {/* Contraseña + barra de fortaleza */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#4d4356] block">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cfc2d9]" />
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Mín. 8 caracteres"
                      required
                      minLength={8}
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      className="w-full h-12 pl-11 pr-12 bg-white border border-[#cfc2d9] rounded-lg outline-none text-sm placeholder:text-[#cfc2d9]"
                      onFocus={(e) => (e.target.style.borderColor = "#6e00c7")}
                      onBlur={(e) => (e.target.style.borderColor = "#cfc2d9")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cfc2d9] hover:text-[#4d4356] transition-colors"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {/* Barras de fortaleza */}
                  <div className="flex gap-1 h-1 w-full mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-full flex-1 rounded-full transition-colors duration-300"
                        style={{ background: i <= strength.bars ? strength.color : "#e2e2e5" }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 mt-1" style={{ color: form.password ? strength.color : "#7e7388" }}>
                    {form.password ? strength.icon : <Info size={13} />}
                    <span className="text-xs font-medium">
                      {form.password ? strength.label : "Mínimo 8 caracteres requeridos."}
                    </span>
                  </div>
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#4d4356] block">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cfc2d9]" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      required
                      value={form.confirm}
                      onChange={(e) => update("confirm", e.target.value)}
                      className="w-full h-12 pl-11 pr-12 bg-white border border-[#cfc2d9] rounded-lg outline-none text-sm placeholder:text-[#cfc2d9]"
                      onFocus={(e) => (e.target.style.borderColor = "#6e00c7")}
                      onBlur={(e) => {
                        e.target.style.borderColor =
                          form.confirm && form.confirm !== form.password ? "#ba1a1a" : "#cfc2d9";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#cfc2d9] hover:text-[#4d4356] transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Checkbox términos */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-[#cfc2d9] accent-[#6e00c7] cursor-pointer shrink-0"
                  />
                  <label htmlFor="terms" className="text-sm text-[#4d4356] cursor-pointer leading-relaxed select-none">
                    Acepto los{" "}
                    <a href="#" className="font-semibold hover:underline" style={{ color: "#6e00c7" }}>Términos de servicio</a>
                    {" "}y la{" "}
                    <a href="#" className="font-semibold hover:underline" style={{ color: "#6e00c7" }}>Política de privacidad</a>.
                  </label>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs font-medium text-[#ba1a1a] bg-[#ffdad6] px-3 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                {/* Botón */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg disabled:opacity-70"
                  style={{ background: "#6e00c7", fontSize: "16px" }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40 20" />
                      </svg>
                      Creando cuenta…
                    </>
                  ) : (
                    "Crear cuenta"
                  )}
                </button>
              </form>
            )}

            {/* Divider + badge — igual que login */}
            {!success && (
              <>
                <div className="relative my-7">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#e8e8ea]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-xs text-[#7e7388]">O regístrate con</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-7">
                  <button
                    type="button"
                    onClick={() =>
                      supabase.auth.signInWithOAuth({
                        provider: "google",
                        options: { redirectTo: `${window.location.origin}/pasajero` },
                      })
                    }
                    className="flex items-center justify-center h-12 border border-[#cfc2d9] rounded-lg hover:bg-[#f3f3f6] transition-colors gap-2 text-sm font-semibold text-[#1a1c1e]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center h-12 border border-[#cfc2d9] rounded-lg hover:bg-[#f3f3f6] transition-colors gap-2 text-sm font-semibold text-[#1a1c1e]"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.75.79-.01 2.04-.83 3.46-.72 1.45.11 2.5.65 3.07 1.45-3 .17-3.6 4.41-1.04 5.35-.8 1.44-1.63 2.84-2.57 3.14zM12.03 7.25c-.08-2.69 2.22-4.94 4.51-5.11.23 2.89-2.28 5.16-4.51 5.11z" />
                    </svg>
                    Apple
                  </button>
                </div>

                <div className="mt-auto pt-4 flex flex-col items-center gap-3 border-t border-[#e8e8ea]">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(68,221,193,0.15)", color: "#005145" }}>
                    <ShieldCheck size={14} />
                    Conexión segura TLS 1.3
                  </div>
                  <p className="text-sm text-[#4d4356] text-center">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" className="font-bold hover:underline" style={{ color: "#6e00c7" }}>
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer — igual que login */}
      <footer className="w-full bg-white border-t border-[#e8e8ea]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 md:px-10 py-6 w-full max-w-7xl mx-auto">
          <span className="font-bold text-[#1a1c1e]">Rumbo</span>
          <div className="flex flex-wrap justify-center gap-6">
            {["Política de privacidad", "Términos de servicio", "Centro de seguridad", "Soporte"].map((item) => (
              <a key={item} href="#" className="text-xs text-[#4d4356] hover:text-[#6e00c7] transition-colors">
                {item}
              </a>
            ))}
          </div>
          <span className="text-xs text-[#4d4356]">© 2026 Rumbo Urban Mobility</span>
        </div>
      </footer>
    </div>
  );
}
