import Link from "next/link";
import { MapPin } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-[#f9f9fc] px-6 text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: "#f3ebff" }}
      >
        <MapPin size={32} style={{ color: "#6e00c7" }} />
      </div>
      <h1 className="text-2xl font-bold text-[#1a1c1e] mb-2">Página no encontrada</h1>
      <p className="text-[#4d4356] text-sm mb-8 max-w-xs leading-relaxed">
        Esta ruta no existe en Rumbo. Puede que la URL esté mal escrita.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl font-bold text-white text-sm"
        style={{ background: "#6e00c7" }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
