# Rumbo — Guía de Backend para el equipo

Todo el backend es **Supabase** (Postgres + Auth + Realtime). **No hay un servidor de API propio**: Supabase expone automáticamente una API REST (PostgREST) y canales Realtime sobre las tablas. Se consume desde el front con `@supabase/supabase-js`.

> Quien trabaja en **UI de pasajero / login** solo necesita esta guía + el cliente de Supabase.

---

## 1. Conexión

```
URL:       https://mconvzcrdkgvoeifbykd.supabase.co
Anon key:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jb252emNyZGtndm9laWZieWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzODg3NTYsImV4cCI6MjA5NDk2NDc1Nn0.Iw8uNM0JIN7Db8E4RKic54duFvIt8wtUouvywqTdXso
```

> La **anon key es pública** (va en el bundle). La protección real la da el RLS de cada tabla.

Cliente (ya está en `src/lib/supabase/client.ts`):

```ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { realtime: { params: { eventsPerSecond: 10 } } }
);
```

Tipos TypeScript de **todo** el schema en `src/lib/supabase/types.ts` (aliases: `Profile`, `Driver`, `Route`, `Stop`, `Unit`, `Trip`, `TripCheckIn`, `VehicleLocation`, `SafetyReport`, `Rating`, `EmergencyContact`, `FavoriteRoute`, `NotificationPreference`, `UnitRatingSummary`, `RouteRatingSummary`, `UserRole`).

---

## 2. Modelo de datos

Creado vía migraciones SQL sobre Postgres. Resumen por tabla (PK = uuid salvo donde se indica; todas con `created_at timestamptz`).

**Inventario completo (13 tablas + 3 vistas en `public`, + `auth.users`):**
`profiles` · `drivers` · `routes` · `stops` · `units` · `trips` · `vehicle_locations` · `trip_check_ins` · `ratings` · `safety_reports` · `favorite_routes` · `emergency_contacts` · `notification_preferences`
Vistas: `latest_vehicle_locations` · `unit_rating_summary` · `route_rating_summary`

### Auth & usuarios
- **`auth.users`** — gestionada por Supabase (no se toca). Se llena al hacer `signUp`.
- **`profiles`** — 1 fila por usuario, creada **automáticamente** por trigger al registrarse.
  `id` (= auth.users.id, PK) · `full_name` · `phone` · `role` (`passenger` \| `driver` \| `operator`, default `passenger`)

### Transporte / Flota
- **`routes`** — `code` (único, ej `C-N`) · `name` · `color` (hex)
- **`stops`** — `route_id`→routes · `name` · `lat` · `lng` · `sequence` (orden)
- **`drivers`** — roster de conductores gestionado por Ops (independiente del login). `full_name` · `phone` · `license_no` · `status` (`active`\|`inactive`) · `profile_id`→profiles (nullable, enlaza con la cuenta de login cuando el conductor se registra)
- **`units`** (buses) — `code` (único, ej `TX-204`) · `plate` (placa, ej `SJB-1204`) · `route_id`→routes · `driver_id`→**drivers** · `status` (`active`\|`inactive`\|`maintenance`)
- **`trips`** — instancia de una ruta en el tiempo. `unit_id`→units · `route_id`→routes · `driver_id`→profiles · `status` (`scheduled`\|`in_progress`\|`completed`\|`cancelled`) · `started_at` · `ended_at`
- **`vehicle_locations`** — pings GPS (PK `bigint`, append-only). `unit_id`→units · `route_id` · `trip_id`→trips · `lat` · `lng` · `heading` · `speed` · `recorded_at`. **Realtime ON.**

### Pasajero
- **`trip_check_ins`** — pasajero aborda un viaje (base de ratings *verificados*). `trip_id`→trips · `user_id`→auth.users · `checked_in_at`. Único `(trip_id, user_id)`.
- **`ratings`** — `unit_id` · `route_id` · `trip_id`→trips · `created_by`→auth.users · `cleanliness`/`punctuality`/`behavior` (int 1–5) · `comment`
- **`safety_reports`** — `unit_id` · `route_id` · `created_by`→auth.users (nullable, permite anónimo) · `type` · `severity` (`low`\|`medium`\|`high`\|`critical`) · `description` · `lat`/`lng`. **Realtime ON.**
- **`favorite_routes`** — `user_id`→auth.users · `route_id`→routes. Único `(user_id, route_id)`.
- **`emergency_contacts`** — `user_id`→auth.users · `name` · `phone` · `relationship`
- **`notification_preferences`** — PK `user_id`→auth.users · `delays` · `schedule_changes` · `favorites` (booleans)

### Vistas (solo lectura)
- **`latest_vehicle_locations`** — última posición por unidad, ya unida con unidad+ruta (`unit_code`, `route_code`, `route_name`, `route_color`). Para el render inicial del mapa.
- **`unit_rating_summary`** / **`route_rating_summary`** — promedios (`avg_cleanliness`, `avg_punctuality`, `avg_behavior`, `avg_overall`, `total_ratings`) **solo cuando hay ≥ 5 ratings** (req 4.5).

---

## 3. "Endpoints" (cómo consultar)

Recomendado: `supabase-js`. Todas las tablas también están en `https://<URL>/rest/v1/<tabla>` (headers `apikey` y `Authorization: Bearer <anon key>`, filtros PostgREST).

```ts
// Rutas / paradas / unidades
await supabase.from("routes").select("*").order("code");
await supabase.from("stops").select("*").eq("route_id", id).order("sequence");
await supabase.from("units").select("id, code, status, routes(code,name,color)");

// Flota completa con placa, ruta y conductor (vista de operaciones)
await supabase
  .from("units")
  .select("id, code, plate, status, routes(code,name,color), drivers(full_name,phone,license_no)");
await supabase.from("drivers").select("*").order("full_name");

// Flota en vivo (render inicial)
await supabase.from("latest_vehicle_locations").select("*");          // toda la flota
await supabase.from("latest_vehicle_locations").select("*").eq("route_id", id);

// Viajes activos de una ruta
await supabase.from("trips").select("*").eq("route_id", id).eq("status","in_progress");

// Check-in a un viaje (requiere login) -> habilita rating verificado
await supabase.from("trip_check_ins").insert({ trip_id, user_id });

// Calificar (idealmente con trip_id del viaje en que se hizo check-in)
await supabase.from("ratings").insert({
  trip_id, unit_id, route_id, created_by: userId,
  cleanliness: 5, punctuality: 4, behavior: 5, comment: "…",
});

// Resumen de ratings (>=5)
await supabase.from("route_rating_summary").select("*").eq("route_id", id).single();

// Reporte de seguridad (anónimo permitido)
await supabase.from("safety_reports").insert({ route_id, unit_id, type, severity, description, lat, lng });

// Favoritas / contactos / preferencias (requieren login; owner-only)
await supabase.from("favorite_routes").insert({ user_id: userId, route_id });
await supabase.from("favorite_routes").select("route_id").eq("user_id", userId);
await supabase.from("emergency_contacts").insert({ user_id: userId, name, phone, relationship });
await supabase.from("notification_preferences").upsert({ user_id: userId, delays: true });
```

---

## 4. Realtime (posiciones y viajes en vivo)

```ts
const channel = supabase
  .channel("rumbo-live")
  .on("postgres_changes",
    { event: "INSERT", schema: "public", table: "vehicle_locations" },
    (p) => { /* p.new = nuevo ping GPS */ })
  .subscribe();

// al desmontar: supabase.removeChannel(channel)
```
Realtime habilitado en: **`vehicle_locations`**, **`safety_reports`**, **`trips`**.

> El payload del INSERT trae solo columnas de la tabla (no el nombre de ruta). Para enriquecer, cargá un lookup de unidades+rutas una vez. **Hook listo para reusar**: `src/hooks/useVehicleLocations.ts` (`useVehicleLocations(routeId?)` → `{ vehicles, loading, error }`, con detección de "stale" >30s).

---

## 5. Login / Autenticación (Supabase Auth)

```ts
// Registro — pasá role/full_name en metadata; el trigger crea el profile
await supabase.auth.signUp({
  email, password,
  options: { data: { full_name: "Ana", role: "passenger" } }, // role: passenger|driver|operator
});
await supabase.auth.signInWithPassword({ email, password });
await supabase.auth.signInWithOtp({ phone: "+506..." });          // SMS
await supabase.auth.verifyOtp({ phone, token, type: "sms" });
const { data: { session } } = await supabase.auth.getSession();
await supabase.auth.signOut();
await supabase.auth.resetPasswordForEmail(email);
supabase.auth.onAuthStateChange((event, session) => { /* proteger rutas */ });

// Rol del usuario logueado
const { data: profile } = await supabase.from("profiles").select("role, full_name").single();
```

**Qué da Supabase solo / qué falta (req 6):**
- ✅ Sesiones, refresh tokens, reset por email, login email/teléfono, **profile + rol automático** (trigger `handle_new_user`).
- ⚙️ Sesión 30 días → Dashboard → Authentication → Sessions.
- ⚙️ Password mín. 8 con letras+números → validar en front + Dashboard → Authentication → Policies.
- ⚙️ Bloqueo tras 5 intentos / 15 min → no viene de fábrica; rate-limit propio o Edge Function.

---

## 6. RLS (qué puede hacer cada quién)

| Tabla | anon (sin login) | authenticated |
|---|---|---|
| routes / stops / units / drivers | leer · **crear/editar/borrar** (demo, consola Ops) | igual |
| vehicle_locations | leer · **insertar** (demo) | igual |
| safety_reports | leer · **insertar** (demo, anónimo OK por req 5.3) | igual |
| ratings | leer · **insertar** (demo) | igual |
| profiles | — | leer todos · editar el propio |
| trips | leer | insert/update **solo el driver dueño** (`driver_id = auth.uid()`) |
| trip_check_ins / favorite_routes / emergency_contacts / notification_preferences | — | **solo lo propio** (`user_id = auth.uid()`) |

> ⚠️ Las escrituras marcadas **(demo)** son permisivas (`WITH CHECK true`) para el hackathon. Al integrar login hay que atarlas: rutas/flota solo a `role = 'operator'`, ratings solo si existe un `trip_check_ins` del usuario para ese `trip_id` (req 4.2), y pings solo del driver autenticado de la unidad.

---

## 7. Cobertura de requisitos → datos

| Req | Qué necesita en datos | Estado |
|---|---|---|
| 1 GPS/realtime | `vehicle_locations` + Realtime | ✅ |
| 2 Driver | `units`, `trips`, `profiles(role=driver)` | ✅ |
| 3 Route planning | `routes`, `stops` (ETA se calcula en cliente con `lib/geo.ts`) | ✅ datos |
| 4 Ratings verificados | `ratings(trip_id, created_by)`, `trip_check_ins`, vistas `*_rating_summary` (≥5) | ✅ |
| 5 Safety | `safety_reports`, `emergency_contacts` | ✅ |
| 6 Auth | `auth.users`, `profiles` + roles | ✅ datos |
| 8 Search/favoritos | `routes` (búsqueda), `favorite_routes` | ✅ |
| 9 Notificaciones | `favorite_routes`, `notification_preferences` | ✅ datos |
| 10 Privacidad | reset/borrado por usuario, consentimiento | ⏳ config/lógica |
| 11 Performance | índices en pings/trips | ✅ índices |

---

## 8. Arranque para el equipo de pasajero/login

1. `npm i @supabase/supabase-js`, copiá `src/lib/supabase/{client,types}.ts`, poné las `NEXT_PUBLIC_*` en `.env.local`.
2. Datos: `supabase.from("<tabla>").select(...)` — sección 3.
3. Bus en vivo: hook `useVehicleLocations()` o Realtime — sección 4.
4. Login: `supabase.auth.*` + leer `profiles.role` — sección 5.
5. ¿Falta una columna/tabla? Me dicen, la agrego y regenero `types.ts`.

---

## 9. Integrar desde otro proyecto / otra IA

Otra IA o dev puede conectar lo que construyan **solo con este documento** — no necesita este repo. Lo que necesita:

1. **El contrato del schema** está en dos lugares portables:
   - Este `BACKEND.md` (legible por humanos y por IA).
   - `src/lib/supabase/types.ts` — el schema completo como tipos TypeScript. **Cópienlo** a su proyecto, o regenérenlo con la CLI:
     ```bash
     npx supabase gen types typescript --project-id mconvzcrdkgvoeifbykd > src/lib/database.types.ts
     ```
2. **La API es PostgREST estándar.** Base: `https://mconvzcrdkgvoeifbykd.supabase.co/rest/v1/<tabla>` con headers `apikey` y `Authorization: Bearer <anon key>`. Filtros: `?col=eq.valor`, `select=`, `order=`, `limit=`, etc. → https://postgrest.org / https://supabase.com/docs/guides/api
3. **Prueba rápida** (verificada, devuelve 200 + datos):
   ```bash
   curl "https://mconvzcrdkgvoeifbykd.supabase.co/rest/v1/routes?select=*" \
     -H "apikey: <anon key>" -H "Authorization: Bearer <anon key>"
   ```
4. Desde cualquier framework: instalan `@supabase/supabase-js`, hacen `createClient(url, anonKey)` y usan los mismos ejemplos de §3–§5. No importa si usan React, Vue, Flutter, etc.

> Para que otra IA tenga el contexto completo de una sola pasada, pásenle **este `BACKEND.md` + el `types.ts`**. Con eso puede generar el código de conexión correcto contra estos endpoints.
