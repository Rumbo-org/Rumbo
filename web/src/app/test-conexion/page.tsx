"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface TestResult {
  name: string;
  status: "ok" | "error" | "pending";
  detail: string;
}

export default function TestConexionPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  const runTests = async () => {
    setRunning(true);
    setResults([]);

    const tests: TestResult[] = [];

    // 1. Conexión básica — leer rutas (tabla pública, sin auth)
    try {
      const { data, error } = await supabase.from("routes").select("id, code, name").limit(3);
      if (error) throw error;
      tests.push({
        name: "Conexión a Supabase",
        status: "ok",
        detail: `OK — ${data?.length ?? 0} rutas encontradas: ${data?.map((r) => r.code).join(", ")}`,
      });
    } catch (e) {
      tests.push({ name: "Conexión a Supabase", status: "error", detail: String(e) });
    }
    setResults([...tests]);

    // 2. Sesión activa
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      tests.push({
        name: "Sesión de Auth",
        status: "ok",
        detail: session ? `Sesión activa — ${session.user.email}` : "Sin sesión (normal si no estás logueado)",
      });
    } catch (e) {
      tests.push({ name: "Sesión de Auth", status: "error", detail: String(e) });
    }
    setResults([...tests]);

    // 3. Leer tabla pública (paradas)
    try {
      const { data, error } = await supabase.from("stops").select("id, name").limit(3);
      if (error) throw error;
      tests.push({
        name: "Leer tabla stops",
        status: "ok",
        detail: `OK — ${data?.length ?? 0} paradas`,
      });
    } catch (e) {
      tests.push({ name: "Leer tabla stops", status: "error", detail: String(e) });
    }
    setResults([...tests]);

    // 4. Leer vista latest_vehicle_locations
    try {
      const { data, error } = await supabase.from("latest_vehicle_locations").select("unit_code, route_code, lat, lng").limit(3);
      if (error) throw error;
      tests.push({
        name: "Vista latest_vehicle_locations",
        status: "ok",
        detail: `OK — ${data?.length ?? 0} vehículos en vivo`,
      });
    } catch (e) {
      tests.push({ name: "Vista latest_vehicle_locations", status: "error", detail: String(e) });
    }
    setResults([...tests]);

    // 5. Auth — perfil del usuario (solo si hay sesión)
    if (user) {
      try {
        const { data, error } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
        if (error) throw error;
        tests.push({
          name: "Perfil autenticado",
          status: "ok",
          detail: `${data?.full_name} — rol: ${data?.role}`,
        });
      } catch (e) {
        tests.push({ name: "Perfil autenticado", status: "error", detail: String(e) });
      }
      setResults([...tests]);
    } else {
      tests.push({ name: "Perfil autenticado", status: "pending", detail: "No hay sesión activa — inicia sesión para testear esto" });
      setResults([...tests]);
    }

    setRunning(false);
  };

  useEffect(() => {
    if (!authLoading) runTests();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  const statusColor = (s: TestResult["status"]) =>
    s === "ok" ? "#1b6b43" : s === "error" ? "#ba1a1a" : "#c66b00";
  const statusBg = (s: TestResult["status"]) =>
    s === "ok" ? "#d7f4e3" : s === "error" ? "#ffdad6" : "#ffefd3";
  const statusLabel = (s: TestResult["status"]) =>
    s === "ok" ? "✓ OK" : s === "error" ? "✗ Error" : "⚠ Info";

  return (
    <div className="min-h-full bg-[#f9f9fc] p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-[#1a1c1e] mb-1">Test de Conexión</h1>
        <p className="text-[#4d4356] text-sm mb-6">Verifica que Supabase está funcionando correctamente</p>

        {/* Estado auth */}
        <div className="bg-white border border-[#cfc2d9] rounded-xl p-4 mb-6">
          <p className="text-xs font-semibold text-[#4d4356] uppercase tracking-wider mb-2">Estado Auth</p>
          {authLoading ? (
            <p className="text-sm text-[#7e7388]">Cargando sesión...</p>
          ) : user ? (
            <div>
              <p className="text-sm font-semibold text-[#1a1c1e]">{user.email}</p>
              <p className="text-xs text-[#7e7388]">Rol: {profile?.role ?? "cargando..."} · ID: {user.id.slice(0, 8)}...</p>
            </div>
          ) : (
            <p className="text-sm text-[#7e7388]">Sin sesión activa</p>
          )}
        </div>

        {/* Resultados */}
        <div className="space-y-3 mb-6">
          {results.map((r, i) => (
            <div key={i} className="bg-white border border-[#cfc2d9] rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-[#1a1c1e]">{r.name}</p>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ color: statusColor(r.status), background: statusBg(r.status) }}
                >
                  {statusLabel(r.status)}
                </span>
              </div>
              <p className="text-xs text-[#4d4356] mt-1">{r.detail}</p>
            </div>
          ))}
          {running && results.length < 5 && (
            <div className="bg-white border border-[#cfc2d9] rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-[#eeeef0] rounded w-1/2" />
            </div>
          )}
        </div>

        <button
          onClick={runTests}
          disabled={running || authLoading}
          className="w-full py-4 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-60"
          style={{ background: "#6e00c7" }}
        >
          {running ? "Ejecutando tests..." : "Ejecutar tests de nuevo"}
        </button>

        <div className="mt-6 flex gap-3">
          <a
            href="/login"
            className="flex-1 py-3 rounded-xl font-semibold text-center text-sm text-[#6e00c7] border border-[#6e00c7] hover:bg-[#f3eeff] transition-colors"
          >
            Ir a Login
          </a>
          <a
            href="/registro"
            className="flex-1 py-3 rounded-xl font-semibold text-center text-sm text-[#6e00c7] border border-[#6e00c7] hover:bg-[#f3eeff] transition-colors"
          >
            Ir a Registro
          </a>
        </div>
      </div>
    </div>
  );
}
