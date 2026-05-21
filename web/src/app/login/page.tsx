"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push("/pasajero");
  };

  return (
    <div className="min-h-full flex flex-col bg-[#f9f9fc]">
      {/* Top */}
      <div className="p-4 pt-safe">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[#4d4356] text-sm hover:text-[#6e00c7] transition-colors">
          <ArrowLeft size={16} />
          Volver
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 pb-10">
        {/* Logo */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#6e00c7" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 20l8-4 8 4L12 2z" fill="white" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-[#1a1c1e]">Rumbo</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a1c1e] mt-4">Bienvenido de vuelta</h1>
          <p className="text-[#4d4356] text-sm mt-1">Inicia sesión para ver tus rutas</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-[#4d4356] uppercase tracking-wider mb-1.5 block">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e7388]" />
              <input
                type="email"
                placeholder="tucorreo@ejemplo.com"
                className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#cfc2d9] rounded-xl text-sm text-[#1a1c1e] placeholder:text-[#cfc2d9] outline-none focus:border-[#6e00c7] transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-[#4d4356] uppercase tracking-wider mb-1.5 block">
              Contraseña
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e7388]" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3.5 bg-white border border-[#cfc2d9] rounded-xl text-sm text-[#1a1c1e] placeholder:text-[#cfc2d9] outline-none focus:border-[#6e00c7] transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7e7388] hover:text-[#6e00c7] transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs font-semibold text-[#6e00c7] hover:underline">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error && (
            <p className="text-xs font-medium text-[#ba1a1a] bg-[#ffdad6] px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-60"
            style={{ background: "#6e00c7" }}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-[#e8e8ea]" />
            <span className="text-xs text-[#7e7388]">o continúa con</span>
            <div className="flex-1 h-px bg-[#e8e8ea]" />
          </div>

          <button
            type="button"
            className="w-full py-3.5 rounded-xl font-semibold text-[#1a1c1e] text-sm bg-white border border-[#cfc2d9] flex items-center justify-center gap-2 hover:bg-[#f3f3f6] transition-colors"
            onClick={() => router.push("/pasajero")}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continuar con Google
          </button>
        </form>

        <p className="text-center text-sm text-[#4d4356] mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="font-semibold text-[#6e00c7] hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  );
}
