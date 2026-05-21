"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, CheckCircle2 } from "lucide-react";

const STEPS = ["Cuenta", "Perfil", "Listo"];

export default function RegistroPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const update = (field: string, val: string) => setForm((f) => ({ ...f, [field]: val }));

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 1) {
      setStep((s) => s + 1);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep(2);
  };

  const passwordStrength = () => {
    const p = form.password;
    if (p.length === 0) return { width: 0, color: "#e8e8ea", label: "" };
    if (p.length < 6) return { width: 25, color: "#eb0000", label: "Débil" };
    if (p.length < 8) return { width: 50, color: "#c66b00", label: "Regular" };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { width: 100, color: "#1b6b43", label: "Fuerte" };
    return { width: 75, color: "#1b6b43", label: "Buena" };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-full flex flex-col bg-[#f9f9fc]">
      <div className="p-4 pt-safe">
        <button
          onClick={() => (step > 0 ? setStep((s) => s - 1) : router.push("/"))}
          className="inline-flex items-center gap-1.5 text-[#4d4356] text-sm hover:text-[#6e00c7] transition-colors"
        >
          <ArrowLeft size={16} />
          {step > 0 ? "Atrás" : "Volver"}
        </button>
      </div>

      {/* Progress */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: i <= step ? "#6e00c7" : "#eeeef0",
                    color: i <= step ? "#ffffff" : "#7e7388",
                  }}
                >
                  {i < step ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className="text-[10px] text-[#7e7388] mt-1">{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="flex-1 h-0.5 mb-4 transition-all"
                  style={{ background: i < step ? "#6e00c7" : "#eeeef0" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 px-6 pb-10">
        {step === 0 && (
          <>
            <h1 className="text-2xl font-bold text-[#1a1c1e] mb-1">Crear cuenta</h1>
            <p className="text-[#4d4356] text-sm mb-6">Accede a Rumbo gratis</p>

            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#4d4356] uppercase tracking-wider mb-1.5 block">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e7388]" />
                  <input
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    required
                    className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#cfc2d9] rounded-xl text-sm text-[#1a1c1e] placeholder:text-[#cfc2d9] outline-none focus:border-[#6e00c7] transition-colors"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4d4356] uppercase tracking-wider mb-1.5 block">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e7388]" />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    required
                    className="w-full pl-10 pr-12 py-3.5 bg-white border border-[#cfc2d9] rounded-xl text-sm text-[#1a1c1e] placeholder:text-[#cfc2d9] outline-none focus:border-[#6e00c7] transition-colors"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7e7388] hover:text-[#6e00c7]"
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="h-1 bg-[#eeeef0] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${strength.width}%`, background: strength.color }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: strength.color }}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input type="checkbox" required id="terms" className="mt-0.5 accent-[#6e00c7]" />
                <label htmlFor="terms" className="text-xs text-[#4d4356]">
                  Acepto los{" "}
                  <button type="button" className="text-[#6e00c7] underline">
                    Términos de uso
                  </button>{" "}
                  y la{" "}
                  <button type="button" className="text-[#6e00c7] underline">
                    Política de privacidad
                  </button>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95"
                style={{ background: "#6e00c7" }}
              >
                Continuar
              </button>
            </form>

            <p className="text-center text-sm text-[#4d4356] mt-6">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="font-semibold text-[#6e00c7] hover:underline">
                Inicia sesión
              </Link>
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-[#1a1c1e] mb-1">Tu perfil</h1>
            <p className="text-[#4d4356] text-sm mb-6">Completa tu información</p>

            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#4d4356] uppercase tracking-wider mb-1.5 block">
                  Nombre completo
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e7388]" />
                  <input
                    type="text"
                    placeholder="Juan Pérez"
                    required
                    className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#cfc2d9] rounded-xl text-sm text-[#1a1c1e] placeholder:text-[#cfc2d9] outline-none focus:border-[#6e00c7] transition-colors"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#4d4356] uppercase tracking-wider mb-1.5 block">
                  Teléfono <span className="text-[#7e7388] normal-case font-normal">(opcional)</span>
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7e7388]" />
                  <input
                    type="tel"
                    placeholder="+506 8000 0000"
                    className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#cfc2d9] rounded-xl text-sm text-[#1a1c1e] placeholder:text-[#cfc2d9] outline-none focus:border-[#6e00c7] transition-colors"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>
                <p className="text-xs text-[#7e7388] mt-1.5">
                  Para recuperación de cuenta por SMS
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-60 mt-4"
                style={{ background: "#6e00c7" }}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-10">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-xl"
              style={{ background: "#6e00c7" }}
            >
              <CheckCircle2 size={36} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a1c1e] mb-2">¡Listo, {form.name || "bienvenido"}!</h1>
            <p className="text-[#4d4356] text-sm mb-8">
              Tu cuenta fue creada. Ya puedes ver las rutas en tiempo real.
            </p>
            <button
              onClick={() => router.push("/pasajero")}
              className="w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95"
              style={{ background: "#6e00c7" }}
            >
              Abrir Rumbo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
