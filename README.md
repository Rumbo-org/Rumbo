# Rumbo 🚌

Plataforma de movilidad en transporte público para Costa Rica y países en desarrollo. Conecta pasajeros, operadores de flota y gobiernos a través de una capa de datos compartida sobre rastreo GPS en tiempo real.

> **Esta rama (`integracion-fullstack`) integra dos esfuerzos del repo:**
> - **Documentación de producto, prototipos y app web del equipo** → `docs/`, `app/`, `web/` (ver "Producto y documentación" abajo).
> - **App full-stack** en la raíz del repo, con **backend real en Supabase**, Google Maps y consola de operaciones → ver "App full-stack" abajo y [`BACKEND.md`](BACKEND.md).

---

## App full-stack (raíz del repo)

MVP funcional con rastreo GPS en tiempo real vía Supabase Realtime, mapas de Google y consola de operaciones.

| Ruta | Para quién | Qué hace |
|------|-----------|----------|
| `/passenger` | Pasajero | Busca rutas, ve el bus en vivo con ETA por parada, califica el viaje, botón de seguridad |
| `/driver` | Conductor (móvil) | Transmite GPS del celular cada 10s, indicador de batería, wake-lock, SOS |
| `/ops` | Operaciones (desktop) | Flota en vivo, métricas, reportes de seguridad |
| `/ops/routes` | Operaciones | Editor de rutas: dibuja paradas en el mapa, trazo por calles |
| `/ops/fleet` · `/ops/drivers` | Operaciones | Gestión de unidades (placa, ruta, conductor) y conductores |

### Stack
- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind v4** — design system "Rumbo" (violeta `#8f00ff`) en `src/app/globals.css`
- **Supabase** — Postgres + Realtime (13 tablas + 3 vistas; ver `BACKEND.md`)
- **Google Maps JS API** + Directions (trazo por calles)

### Correr local
```bash
npm install
npm run dev      # http://localhost:3000
```
Variables en `.env.local` (no commiteado): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

### Probar el flujo en vivo
1. Abrí `/driver`, elegí unidad + ruta y tocá **Iniciar Rastreo** (aceptá permiso de ubicación).
2. En otra pestaña abrí `/ops` o `/passenger` → la unidad se mueve en tiempo real.
3. Si no llegan pings por >30s, la unidad se marca como **señal perdida**.

### Estructura
```
src/
  app/
    page.tsx                 # hub
    driver/  ops/  passenger/ # superficies
    ops/{routes,fleet,drivers}/ # consola de operaciones
    globals.css              # design system Rumbo
  components/  LiveMap, RouteEditorMap, OpsSidebar
  hooks/      useVehicleLocations (realtime + stale)
  lib/        supabase/{client,types}, google-maps, geo
BACKEND.md                   # doc completa del backend (Supabase)
```

> ⚠️ MVP de hackathon: el RLS de varias tablas es permisivo para demo y la auth está pendiente de endurecer. Detalle en `BACKEND.md` §6.

---

## Producto y documentación

Plataforma de movilidad en transporte público para países en desarrollo. Conecta pasajeros, operadores de flota y gobiernos municipales a través de una capa de datos compartida construida sobre rastreo GPS en tiempo real, estándares GTFS, y señales generadas por los propios usuarios.

| Documento | Descripción | Audiencia |
|---|---|---|
| [Visión y Estrategia](docs/01-vision-y-estrategia.md) | Problema, modelo de negocio, proyecciones financieras, estrategia de expansión | Fundadores, inversionistas, socios |
| [Product Requirements (PRD)](docs/02-product-requirements.md) | Personas, alcance del MVP, especificación funcional, criterios de aceptación | Product managers, diseñadores, ingenieros |
| [Especificación Técnica](docs/03-especificacion-tecnica.md) | Arquitectura, stack, modelo de datos, API, seguridad, infraestructura | Ingenieros de software, DevOps |
| [Análisis ROI para Operadores](docs/04-analisis-roi-operadores.md) | Cuantificación de pérdidas sin datos y retorno de inversión con Rumbo | Equipo de ventas, operadores de flota |

### El Problema

El transporte público en América Latina no falla por falta de buses. Falla porque el ecosistema de información está fragmentado: los operadores no tienen datos de su propia operación, los pasajeros no saben cuándo llega el próximo bus, y los gobiernos no pueden fiscalizar lo que no pueden medir.

Un operador mediano de 80 buses pierde aproximadamente **$3.3 millones al año** en evasión de tarifa, sobre-despliegue de flota, mantenimiento reactivo, y pérdida de pasajeros por problemas de calidad que nunca detecta.

### La Solución

Rumbo se organiza en cuatro capas que se construyen en orden de dependencia:

```
Gobierno      Portal municipal de análisis y fiscalización
Pasajeros     App web: tiempo real, evaluaciones, seguridad
Operadores    SaaS de gestión de flota y análisis de demanda
Datos         GPS en flotas + crowdsourcing + estandarización GTFS
```

### Productos

**Passenger App** — Aplicación web gratuita para pasajeros. Muestra la ubicación en tiempo real de los buses, permite planificar rutas, dejar evaluaciones verificadas del servicio, y acceder a herramientas de seguridad incluyendo reporte anónimo de incidentes.

**Driver App** — Interfaz web para conductores. Transmite la ubicación GPS del teléfono del conductor al sistema sin necesidad de hardware adicional en el bus.

**Operator Dashboard** — Plataforma SaaS para empresas autobuseras. Monitoreo de flota en tiempo real, análisis de demanda por parada y horario, optimización de frecuencias, y reportes de comportamiento de conductores.

### Mercados

Costa Rica es el mercado inicial. La expansión sigue este orden: Colombia, México (ciudades secundarias), Perú y Ecuador, África Subsahariana y Sudeste Asiático.

### Modelo de Negocio

Los pasajeros acceden sin costo. Los operadores pagan entre 50 y 200 USD por bus al mes. Los gobiernos suscriben contratos anuales de entre 50,000 y 500,000 USD por ciudad.

Proyección conservadora al tercer año operando en tres países: entre 7 y 8 millones de USD de ARR.
