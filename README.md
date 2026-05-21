# Rumbo 🚌

MVP de movilidad en transporte público para Costa Rica. Tres superficies en una sola app Next.js, con rastreo GPS en tiempo real vía Supabase Realtime y mapas de Google Maps.

| Ruta | Para quién | Qué hace |
|------|-----------|----------|
| `/passenger` | Pasajero | Busca rutas, ve el bus en vivo con ETA por parada, califica el viaje, botón de seguridad |
| `/driver` | Conductor (móvil) | Transmite GPS del celular cada 10s, indicador de batería, wake-lock, SOS |
| `/ops` | Operaciones (desktop) | Dashboard con la flota en vivo, métricas y reportes de seguridad en tiempo real |

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind v4** — design system "Rumbo" (violeta `#8f00ff`) en `src/app/globals.css`
- **Supabase** — Postgres + Realtime (proyecto `mconvzcrdkgvoeifbykd`)
- **Google Maps JS API** (`@googlemaps/js-api-loader` v2, API funcional)

## Correr local

```bash
npm install
npm run dev      # http://localhost:3000
```

Las variables ya están en `.env.local` (no commiteado):

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

## Cómo probar el flujo en vivo

1. Abrí `/driver` en el celular (o en el navegador), seleccioná unidad + ruta y tocá **Iniciar Rastreo**. Aceptá el permiso de ubicación.
2. Abrí `/ops` o `/passenger` en otra pestaña: la unidad aparece moviéndose en el mapa en tiempo real.
3. Si no llegan pings por >30s, la unidad se marca como **señal perdida** (gris).

## Modelo de datos (`src/lib/supabase/types.ts`)

`routes` · `stops` · `units` · `vehicle_locations` (pings, append-only) · `safety_reports` · `ratings`
+ vista `latest_vehicle_locations` (última posición por unidad, para el render inicial).

Realtime habilitado en `vehicle_locations` y `safety_reports`.

## ⚠️ Antes de producción

Esto es un MVP de hackathon. Pendientes de seguridad:

- **RLS permisivo**: hoy cualquier anónimo puede insertar pings/reportes/ratings y actualizar el estado de una unidad (`WITH CHECK (true)`). Hay que atarlo a autenticación de conductor (requisito 6) y validar que el rating venga de alguien que iba en el viaje (requisito 4.2).
- **Restringir la API key de Google Maps** por HTTP referrer + por API en Google Cloud Console.
- **Rotar** el token de Supabase y las llaves que se compartieron durante el desarrollo.
- Encriptación, consentimiento de ubicación y export/borrado de datos (requisitos 10) no están implementados.

## Estructura

```
src/
  app/
    page.tsx            # hub con las 3 superficies
    driver/page.tsx     # conductor (GPS watchPosition -> Supabase)
    ops/page.tsx        # dashboard operaciones
    passenger/page.tsx  # app pasajero (búsqueda, ETA, ratings)
    globals.css         # design system Rumbo (Tailwind v4 @theme)
  components/LiveMap.tsx       # mapa Google reutilizable
  hooks/useVehicleLocations.ts # carga inicial + suscripción realtime + stale
  lib/
    supabase/{client,types}.ts
    google-maps.ts
    geo.ts              # haversine + ETA
```
