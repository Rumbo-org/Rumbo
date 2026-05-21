"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Phone, ArrowRight, ShieldCheck, HelpCircle, Globe } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type LoginTab = "email" | "phone";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<LoginTab>("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+506");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginEmail = tab === "email" ? email : `${countryCode}${phone}`;
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    setLoading(false);

    if (authError) {
      if (authError.message.includes("Invalid login credentials")) {
        setError("Correo o contraseña incorrectos.");
      } else if (authError.message.includes("Email not confirmed")) {
        setError("Confirma tu correo antes de ingresar.");
      } else {
        setError(authError.message);
      }
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/pasajero"), 800);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Ingresa tu correo primero para recuperar la contraseña.");
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
    if (resetError) {
      setError(resetError.message);
    } else {
      setError("");
      alert("Te enviamos un correo para restablecer tu contraseña.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9fc] font-[Inter,sans-serif] text-[#1a1c1e]">
      {/* Top bar */}
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

      {/* Main */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div
          className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-xl overflow-hidden shadow-2xl"
          style={{ minHeight: "680px", background: "white" }}
        >
          {/* Left — image panel */}
          <div className="hidden md:block relative overflow-hidden group">
            {/* Gradient background simulating city-at-night photo */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(160deg, #0d001f 0%, #2b0053 35%, #6e00c7 70%, #8f00ff 100%)",
              }}
            />
            {/* Light trails decoration */}
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
            {/* Bus silhouette */}
            <div className="absolute bottom-0 left-0 right-0 h-48 opacity-10"
              style={{ background: "linear-gradient(to top, rgba(110,0,199,0.3), transparent)" }}
            />
            {/* Text overlay */}
            <div className="absolute bottom-12 left-10 right-10 z-20">
              <h2 className="text-[32px] font-bold leading-10 tracking-tight text-white drop-shadow-lg mb-4">
                La forma más inteligente de moverte por tu ciudad.
              </h2>
              <p className="text-base text-white/80 leading-relaxed drop-shadow">
                Únete a miles de pasajeros y conductores construyendo el futuro de la movilidad urbana con Rumbo.
              </p>
            </div>
            {/* Top logo */}
            <div className="absolute top-8 left-10 flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L4 20l8-4 8 4L12 2z" fill="white" />
                </svg>
              </div>
              <span className="text-white font-extrabold text-xl">Rumbo</span>
            </div>
          </div>

          {/* Right — form panel */}
          <div className="flex flex-col justify-center px-6 py-12 md:px-14 lg:px-20">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-[32px] font-bold leading-10 tracking-tight text-[#1a1c1e] mb-2">
                Bienvenido de vuelta
              </h1>
              <p className="text-base text-[#4d4356]">Acceso seguro a tu cuenta Rumbo</p>
            </div>

            {/* Tab toggle */}
            <div className="flex p-1 bg-[#eeeef0] rounded-lg mb-8">
              {(["email", "phone"] as LoginTab[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTab(t); setError(""); }}
                  className="flex-1 py-2 rounded-md text-sm font-semibold transition-all duration-200"
                  style={
                    tab === t
                      ? { background: "white", color: "#6e00c7", boxShadow: "0 1px 4px rgba(0,0,0,0.10)" }
                      : { color: "#4d4356" }
                  }
                >
                  {t === "email" ? "Correo" : "Teléfono"}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email or Phone */}
              {tab === "email" ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#4d4356]">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cfc2d9]" />
                    <input
                      type="email"
                      placeholder="nombre@empresa.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 bg-white border border-[#cfc2d9] rounded-lg outline-none text-sm text-[#1a1c1e] placeholder:text-[#cfc2d9] transition-all"
                      style={{ focusOutline: "none" } as React.CSSProperties}
                      onFocus={(e) => (e.target.style.borderColor = "#6e00c7")}
                      onBlur={(e) => (e.target.style.borderColor = "#cfc2d9")}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#4d4356]">
                    Número de teléfono
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-12 px-3 bg-white border border-[#cfc2d9] rounded-lg outline-none text-sm text-[#1a1c1e] w-24"
                    >
                      <option value="+506">+506</option>
                      <option value="+1">+1</option>
                      <option value="+52">+52</option>
                      <option value="+57">+57</option>
                    </select>
                    <div className="relative flex-1">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cfc2d9]" />
                      <input
                        type="tel"
                        placeholder="8000-0000"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full h-12 pl-11 pr-4 bg-white border border-[#cfc2d9] rounded-lg outline-none text-sm text-[#1a1c1e] placeholder:text-[#cfc2d9]"
                        onFocus={(e) => (e.target.style.borderColor = "#6e00c7")}
                        onBlur={(e) => (e.target.style.borderColor = "#cfc2d9")}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold uppercase tracking-widest text-[#4d4356]">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-semibold hover:underline"
                    style={{ color: "#6e00c7" }}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cfc2d9]" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Mín. 8 caracteres"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-11 pr-12 bg-white border border-[#cfc2d9] rounded-lg outline-none text-sm text-[#1a1c1e] placeholder:text-[#cfc2d9]"
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
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-[#cfc2d9] accent-[#6e00c7]"
                />
                <label htmlFor="remember" className="text-sm text-[#4d4356] select-none cursor-pointer">
                  Recordarme por 30 días
                </label>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs font-medium text-[#ba1a1a] bg-[#ffdad6] px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || success}
                className="w-full h-12 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg disabled:opacity-70"
                style={{
                  background: success ? "#007363" : "#6e00c7",
                  fontSize: "16px",
                }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="40 20" />
                    </svg>
                    Autenticando...
                  </>
                ) : success ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ¡Bienvenido!
                  </>
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e8e8ea]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-[#7e7388]">O continúa con</span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3 mb-7">
              <button
                type="button"
                onClick={() => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/pasajero` } })}
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

            {/* Trust badge + sign up */}
            <div className="mt-auto pt-4 flex flex-col items-center gap-3 border-t border-[#e8e8ea]">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ background: "rgba(68,221,193,0.15)", color: "#005145" }}>
                <ShieldCheck size={14} />
                Conexión segura TLS 1.3
              </div>
              <p className="text-sm text-[#4d4356] text-center">
                ¿No tienes cuenta?{" "}
                <Link href="/registro" className="font-bold hover:underline" style={{ color: "#6e00c7" }}>
                  Regístrate gratis
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
