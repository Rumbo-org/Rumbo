# Rumbo — Especificación Técnica

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Audiencia:** Ingenieros de software, arquitectos de sistema, DevOps  
**Scope:** MVP — Passenger App, Driver App, y servicios de backend

---

## Tabla de Contenidos

1. [Visión General de la Arquitectura](#visión-general-de-la-arquitectura)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Backend](#arquitectura-del-backend)
4. [Modelo de Datos](#modelo-de-datos)
5. [API Reference](#api-reference)
6. [Sistema de Tiempo Real](#sistema-de-tiempo-real)
7. [Motor de Predicción de Llegadas](#motor-de-predicción-de-llegadas)
8. [Arquitectura Frontend](#arquitectura-frontend)
9. [Seguridad](#seguridad)
10. [Infraestructura y Despliegue](#infraestructura-y-despliegue)
11. [Rendimiento y Escalabilidad](#rendimiento-y-escalabilidad)
12. [Decisiones de Arquitectura](#decisiones-de-arquitectura)

---

## Visión General de la Arquitectura

Rumbo sigue una arquitectura de servicios desacoplados con una API central que sirve a todos los clientes. El sistema distingue dos flujos de datos fundamentalmente distintos: el flujo de posición GPS (alta frecuencia, baja latencia, escritura intensiva) y el flujo de consultas de usuario (baja frecuencia, lectura intensiva con caching agresivo).

```
                        CLIENTES
          ┌──────────────┬──────────────┐
          │              │              │
    Passenger App   Driver App     (futuro)
    (browser PWA)  (browser PWA)  Operator Dashboard
          │              │              │
          └──────────────┴──────────────┘
                         │
                    NGINX / CDN
                         │
          ┌──────────────┴──────────────┐
          │                             │
     HTTP REST API              WebSocket Server
     (consultas)                (posición GPS en vivo)
          │                             │
          └──────────────┬──────────────┘
                         │
                   Application Layer
                 (Node.js / Express)
                         │
          ┌──────────────┼──────────────┐
          │              │              │
     PostgreSQL        Redis         Message Queue
     + PostGIS      (cache +       (BullMQ / Redis)
    (datos          pub/sub GPS)
    persistentes)
```

### Flujo de posición GPS

El Driver App transmite posición cada 10 segundos vía HTTP POST. El servidor escribe la posición en Redis (pub/sub y cache de posición actual) y encola un job asíncrono para la escritura en PostgreSQL y para recalcular las estimaciones de llegada de la ruta correspondiente. El Passenger App recibe actualizaciones de posición en tiempo real a través de una conexión WebSocket que está suscrita al canal de la ruta que está visualizando.

### Flujo de consultas del pasajero

Las búsquedas de rutas, los detalles de paradas, y las evaluaciones se sirven desde la REST API. Los datos de rutas y paradas se cachean agresivamente en Redis porque cambian con poca frecuencia. Las estimaciones de llegada en tiempo real se computan desde Redis, no desde PostgreSQL, para minimizar latencia.

---

## Stack Tecnológico

### Backend

| Componente | Tecnología | Justificación |
|---|---|---|
| Runtime | Node.js 22 LTS | Excelente para I/O intensivo y WebSockets; ecosistema amplio |
| Framework web | Express.js | Minimalista, bien conocido, sin opiniones que compliquen la arquitectura |
| Base de datos principal | PostgreSQL 16 + PostGIS | Soporte nativo para datos geoespaciales; necesario para cálculos de distancia y rutas |
| Cache y pub/sub | Redis 7 | Latencia sub-milisegundo para posiciones GPS; pub/sub nativo para WebSocket broadcast |
| Cola de trabajos | BullMQ (sobre Redis) | Jobs asíncronos para escritura en DB y cálculo de predicciones |
| WebSockets | ws (Node.js nativo) | Sin abstracción innecesaria para el caso de uso de GPS |
| ORM | Prisma | Type-safe, migraciones versionadas, soporte PostGIS via extensión |
| Autenticación | JWT + httpOnly cookies | Sin dependencia en servicios externos; control total sobre expiración |
| Envío de SMS | Twilio / vonage | Verificación de número de teléfono en registro |
| Push notifications | Web Push (VAPID) | Estándar web; no requiere Firebase para PWA |
| Mapas (backend) | OpenRouteService (self-hosted) o OSRM | Cálculo de rutas sobre datos de OpenStreetMap; sin costos de API de Google |

### Frontend

| Componente | Tecnología | Justificación |
|---|---|---|
| Framework | React 19 | Composabilidad para UI compleja; ecosistema de mapas maduro |
| Bundler | Vite | Build rápido; HMR eficiente en desarrollo |
| Mapas | Mapbox GL JS o MapLibre GL JS | Renderizado de mapas vectoriales en cliente; MapLibre es open source sin costo |
| Estado global | Zustand | Más simple que Redux para el alcance del MVP |
| Fetching y cache | TanStack Query | Manejo de cache, refetch, y estados de loading/error |
| PWA | Vite PWA Plugin | Service Worker y manifest sin configuración manual |
| Estilos | Tailwind CSS | Velocidad de desarrollo; evita CSS custom en el MVP |
| Tiempo real | Native WebSocket API | Sin librería adicional para el cliente |

### Infraestructura (MVP)

| Componente | Servicio | Nota |
|---|---|---|
| Hosting de backend | Railway o Render | Más simple que AWS para MVP; migración a AWS viable cuando el volumen lo justifique |
| Base de datos | Supabase (PostgreSQL + PostGIS gestionado) | Elimina la gestión manual de la BD en MVP |
| Redis | Upstash Redis | Redis serverless; pricing por comando en MVP |
| CDN y proxy | Cloudflare | Free tier suficiente para MVP; DDoS protection incluida |
| Almacenamiento de archivos | Cloudflare R2 | Compatible con S3 API; sin egress fees |
| Monitoreo | Sentry (errores) + Grafana Cloud (métricas) | Free tier suficiente para MVP |
| CI/CD | GitHub Actions | Integración directa con repositorio |

---

## Arquitectura del Backend

### Estructura de directorios

```
/src
  /api
    /routes
      auth.routes.js
      trips.routes.js
      routes.routes.js      # rutas de transporte
      ratings.routes.js
      safety.routes.js
      notifications.routes.js
    /middleware
      auth.middleware.js
      rateLimit.middleware.js
      validate.middleware.js
    /controllers
      auth.controller.js
      trips.controller.js
      routes.controller.js
      ratings.controller.js
      safety.controller.js
  /services
    gps.service.js           # ingestión y procesamiento de posición GPS
    prediction.service.js    # estimación de tiempos de llegada
    routing.service.js       # cálculo de rutas origen-destino
    notification.service.js  # envío de push notifications
    verification.service.js  # verificación de viajes para ratings
  /websocket
    server.js
    channels.js              # gestión de suscripciones por ruta
  /jobs
    gps-write.job.js         # escritura asíncrona de GPS a PostgreSQL
    prediction-update.job.js # recálculo de predicciones por ruta
    notification.job.js      # envío diferido de notificaciones
  /database
    prisma/
      schema.prisma
      migrations/
    redis.client.js
  /config
    env.js
    constants.js
  app.js
  server.js
```

### Separación de responsabilidades

**GPS Service** recibe las actualizaciones de posición del Driver App, valida la autenticidad (el conductor debe estar autenticado y la unidad debe pertenecer a la ruta declarada), escribe en Redis para tiempo real, y encola el job de escritura persistente. Este servicio es el más crítico del sistema y debe tener su propio rate limiting y circuit breaker.

**Prediction Service** consume los datos de posición desde Redis y calcula estimaciones de llegada para cada parada futura de la ruta. El cálculo considera la distancia restante, la velocidad promedio reciente de la unidad en ese segmento de ruta, y el comportamiento histórico de esa ruta en la misma franja horaria.

**Routing Service** calcula rutas origen-destino combinando la red de transporte (paradas y conexiones) con los horarios GTFS. Cuando hay datos en tiempo real, ajusta los tiempos de los primeros buses de la secuencia.

**Verification Service** determina si un usuario puede dejar una evaluación verificada de un viaje. Cruza la posición GPS histórica del usuario (almacenada mientras usa la app con localización activa) con la posición de la unidad en el mismo período de tiempo.

---

## Modelo de Datos

### Esquema principal (PostgreSQL + PostGIS)

```sql
-- Operadores de transporte
CREATE TABLE operators (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    tax_id      TEXT UNIQUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Rutas de transporte
CREATE TABLE routes (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id  UUID REFERENCES operators(id),
    route_number TEXT NOT NULL,
    name         TEXT NOT NULL,
    direction    TEXT CHECK (direction IN ('outbound', 'inbound')),
    gtfs_shape   GEOGRAPHY(LINESTRING, 4326),  -- trayecto completo en coordenadas
    active       BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Paradas
CREATE TABLE stops (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         TEXT NOT NULL,
    location     GEOGRAPHY(POINT, 4326) NOT NULL,
    stop_code    TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Relación ruta-paradas (con orden y tiempo estimado desde inicio)
CREATE TABLE route_stops (
    route_id      UUID REFERENCES routes(id),
    stop_id       UUID REFERENCES stops(id),
    sequence      INTEGER NOT NULL,
    scheduled_offset_seconds INTEGER NOT NULL, -- segundos desde el inicio del viaje
    PRIMARY KEY (route_id, stop_id, sequence)
);

-- Unidades de flota
CREATE TABLE units (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id  UUID REFERENCES operators(id),
    unit_number  TEXT NOT NULL,
    license_plate TEXT,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (operator_id, unit_number)
);

-- Viajes activos e históricos
CREATE TABLE trips (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id    UUID REFERENCES routes(id),
    unit_id     UUID REFERENCES units(id),
    driver_id   UUID REFERENCES users(id),
    started_at  TIMESTAMPTZ NOT NULL,
    ended_at    TIMESTAMPTZ,
    status      TEXT CHECK (status IN ('active', 'completed', 'cancelled'))
);

-- Historial de posiciones GPS
CREATE TABLE gps_positions (
    id          BIGSERIAL PRIMARY KEY,
    trip_id     UUID REFERENCES trips(id),
    unit_id     UUID REFERENCES units(id),
    location    GEOGRAPHY(POINT, 4326) NOT NULL,
    speed_kmh   NUMERIC(5,2),
    recorded_at TIMESTAMPTZ NOT NULL,
    received_at TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (recorded_at);
-- Se crean particiones mensuales para control del volumen de datos

-- Índice espacial para consultas de proximidad
CREATE INDEX gps_positions_location_idx ON gps_positions USING GIST (location);
CREATE INDEX gps_positions_trip_time_idx ON gps_positions (trip_id, recorded_at DESC);

-- Usuarios
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT UNIQUE,
    phone           TEXT UNIQUE,
    password_hash   TEXT,
    role            TEXT CHECK (role IN ('passenger', 'driver', 'admin')) DEFAULT 'passenger',
    failed_attempts INTEGER DEFAULT 0,
    locked_until    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluaciones
CREATE TABLE ratings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    trip_id         UUID REFERENCES trips(id),
    unit_id         UUID REFERENCES units(id),
    route_id        UUID REFERENCES routes(id),
    punctuality     SMALLINT CHECK (punctuality BETWEEN 1 AND 5),
    cleanliness     SMALLINT CHECK (cleanliness BETWEEN 1 AND 5),
    driver_behavior SMALLINT CHECK (driver_behavior BETWEEN 1 AND 5),
    verified        BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Reportes de seguridad (sin FK al usuario para garantizar anonimato)
CREATE TABLE safety_reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id    UUID REFERENCES routes(id),
    unit_id     UUID REFERENCES units(id),
    category    TEXT CHECK (category IN ('harassment', 'accident', 'dangerous_driving', 'other')),
    description TEXT,
    location    GEOGRAPHY(POINT, 4326),
    reported_at TIMESTAMPTZ DEFAULT NOW()
    -- sin user_id: el anonimato es estructural, no solo de política
);

-- Rutas favoritas
CREATE TABLE user_favorites (
    user_id    UUID REFERENCES users(id),
    route_id   UUID REFERENCES routes(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, route_id)
);

-- Suscripciones push
CREATE TABLE push_subscriptions (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID REFERENCES users(id),
    endpoint     TEXT NOT NULL,
    p256dh       TEXT NOT NULL,
    auth         TEXT NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Estructura en Redis

```
# Posición actual de cada unidad (TTL: 60 segundos)
unit:position:{unit_id}  →  { lat, lng, speed, timestamp, trip_id, route_id }

# Estimaciones de llegada por ruta (TTL: 30 segundos)
route:arrivals:{route_id}:{stop_id}  →  [ { unit_id, eta_seconds, trip_id }, ... ]

# Datos de ruta cacheados (TTL: 1 hora)
route:data:{route_id}  →  { stops, schedule, operator }

# Canal pub/sub para broadcast de posiciones a WebSocket
channel:route:{route_id}  →  stream de actualizaciones de posición

# Control de rate limiting por IP y por usuario
ratelimit:ip:{ip}  →  contador con TTL
ratelimit:user:{user_id}:gps  →  contador con TTL

# Bloqueo de cuenta por intentos fallidos
auth:lockout:{user_id}  →  timestamp de desbloqueo con TTL
```

---

## API Reference

Todos los endpoints están bajo el prefijo `/api/v1`. La autenticación se hace mediante JWT en cookie httpOnly (`rumbo_session`). Los endpoints marcados con `[Auth]` requieren sesión activa.

### Autenticación

```
POST /api/v1/auth/register
Body: { email?, phone, password }
Response: { user_id, role }
Descripción: Registro de usuario. Inicia flujo de verificación por SMS si se usa teléfono.

POST /api/v1/auth/verify-phone
Body: { phone, code }
Response: { token }
Descripción: Verifica el código SMS de 6 dígitos y activa la cuenta.

POST /api/v1/auth/login
Body: { email? | phone?, password }
Response: 200 + cookie httpOnly | 401 | 423 (cuenta bloqueada)
Descripción: Bloquea la cuenta por 15 minutos tras 5 intentos fallidos.

POST /api/v1/auth/logout [Auth]
Response: 200
Descripción: Invalida la sesión y limpia la cookie.

POST /api/v1/auth/reset-password
Body: { email? | phone? }
Response: 200
Descripción: Envía enlace/código de recuperación. No revela si el email/teléfono existe.
```

### Rutas y paradas

```
GET /api/v1/routes
Query: { operator_id?, active? }
Response: [ { id, route_number, name, direction, operator } ]
Descripción: Lista de rutas. Resultado cacheado en Redis por 1 hora.

GET /api/v1/routes/:id
Response: { id, route_number, name, stops[], schedule }
Descripción: Detalle de ruta con paradas en orden y horario GTFS.

GET /api/v1/routes/search
Query: { q: string }
Response: [ { id, route_number, name, match_type } ]
Descripción: Búsqueda por número, nombre o destino. Autocompletado en <500ms.

GET /api/v1/stops/:id/arrivals
Response: [ { route_id, unit_id, eta_seconds, last_updated } ]
Descripción: Estimaciones de llegada en tiempo real para una parada. Requiere que haya unidades activas.

GET /api/v1/plan
Query: { origin_lat, origin_lng, dest_lat, dest_lng, departure_time? }
Response: { options: [ { duration_seconds, transfers, legs[] } ] }
Descripción: Calcula al menos 2 opciones de ruta. Máximo 3 segundos de procesamiento.
```

### GPS (Driver App)

```
POST /api/v1/gps/position [Auth, Role: driver]
Body: { trip_id, lat, lng, speed_kmh?, accuracy_meters? }
Response: 202 Accepted
Rate limit: 1 request cada 8 segundos por driver_id
Descripción: Recibe la posición del conductor. Escribe en Redis de forma síncrona y encola
             escritura en PostgreSQL de forma asíncrona. Si la escritura en Redis falla,
             retorna 503. Si solo falla la cola, retorna 202 igual (se reintentará).

POST /api/v1/trips/start [Auth, Role: driver]
Body: { unit_id, route_id }
Response: { trip_id }
Descripción: Inicia un nuevo viaje. Valida que la unidad pertenece al operador del conductor.

POST /api/v1/trips/:id/end [Auth, Role: driver]
Response: 200
Descripción: Cierra el viaje activo y purga la posición de la unidad en Redis.
```

### Evaluaciones

```
POST /api/v1/ratings [Auth]
Body: { trip_id, punctuality, cleanliness, driver_behavior }
Response: 201 | 409 (ya evaluado) | 403 (viaje no verificable)
Descripción: Crea una evaluación. El servidor verifica que el usuario estuvo en el viaje
             antes de aceptarla. Un usuario solo puede evaluar cada viaje una vez.

GET /api/v1/routes/:id/ratings
Query: { page?, limit? }
Response: { average: { punctuality, cleanliness, driver_behavior }, count, items[] }
Descripción: Solo se devuelven ratings verificados. No se devuelve nada hasta que hay 5+.
```

### Seguridad

```
POST /api/v1/safety/report
Body: { route_id, unit_id?, category, description?, lat?, lng? }
Response: 201
Descripción: No requiere autenticación. No almacena datos del usuario. No hay forma de
             asociar el reporte a quien lo hizo, ni con un token de sesión activa.

POST /api/v1/safety/alert [Auth]
Body: { contacts: [ { name, phone } ] }
Response: 200
Descripción: Guarda o actualiza los contactos de emergencia del usuario.

POST /api/v1/safety/emergency [Auth]
Body: { lat, lng }
Response: 200
Descripción: Envía SMS con la ubicación del usuario a sus contactos de emergencia.
             Limitado a 3 activaciones por hora por usuario.
```

---

## Sistema de Tiempo Real

### Protocolo WebSocket

El Passenger App abre una conexión WebSocket al cargar una vista que muestra posiciones en tiempo real. El cliente se suscribe a las rutas que le interesan. El servidor envía actualizaciones cuando llegan nuevas posiciones de cualquier unidad en esas rutas.

**Handshake inicial:**
```
Client → Server: ws://api.rumbo.app/ws
Tras conexión:
Client → Server: { type: "subscribe", routes: ["route-uuid-1", "route-uuid-2"] }
Server → Client: { type: "subscribed", routes: ["route-uuid-1", "route-uuid-2"] }
```

**Mensajes del servidor al cliente:**
```json
{
  "type": "position_update",
  "route_id": "uuid",
  "unit_id": "uuid",
  "lat": 9.9281,
  "lng": -84.0907,
  "speed_kmh": 32.5,
  "timestamp": "2026-05-21T14:32:10Z",
  "arrivals": [
    { "stop_id": "uuid", "eta_seconds": 180 },
    { "stop_id": "uuid", "eta_seconds": 420 }
  ]
}
```

**Manejo de datos stale:** Si el servidor no recibe actualizaciones de una unidad durante más de 30 segundos, emite un mensaje de tipo `unit_stale` al cliente para que este indique visualmente que el dato puede estar desactualizado.

### Redis Pub/Sub para broadcast

Cuando el GPS Service recibe una actualización de posición, publica en el canal `channel:route:{route_id}` de Redis. El WebSocket Server está suscrito a todos los canales activos. Cuando recibe un mensaje, lo reenvía a todos los clientes WebSocket conectados que estén suscritos a esa ruta.

Este diseño permite escalar el WebSocket Server horizontalmente: múltiples instancias pueden estar suscritas al mismo canal de Redis y todas reciben las actualizaciones para reenviarlas a sus clientes locales.

---

## Motor de Predicción de Llegadas

### Algoritmo del MVP

El MVP usa un algoritmo determinista simple que se mejora iterativamente con datos reales. La versión inicial no usa machine learning.

**Entrada:** Posición GPS actual de la unidad, velocidad reportada, ruta asignada, paradas futuras con sus ubicaciones.

**Proceso:**
1. Calcular la distancia entre la posición actual de la unidad y cada parada futura usando la función `ST_Distance` de PostGIS sobre la geometría de la ruta (no distancia en línea recta).
2. Estimar la velocidad de recorrido usando la media móvil de las últimas 5 posiciones de la unidad.
3. `eta_seconds = distance_meters / (speed_mps)`
4. Aplicar un factor de ajuste por franja horaria basado en el comportamiento histórico promedio de esa ruta en la misma hora del día y día de la semana (si hay datos históricos disponibles).

**Restricciones:**
- No se calcula ni se publica una ETA si la velocidad promedio de las últimas 3 muestras es cero (unidad detenida con motor en marcha o esperando en parada). En ese caso, se indica "en parada".
- No se calcula ETA para paradas que ya quedaron atrás de la unidad en la ruta.
- Si la posición tiene más de 60 segundos de antigüedad, no se calcula ETA y se marca el dato como no disponible.

### Evolución futura

Después del MVP, con suficiente historial de datos (estimado: 3 meses por ruta), se puede entrenar un modelo de regresión simple que incorpore condiciones de tráfico, día de la semana, clima, y eventos especiales. Este modelo reemplaza el factor de ajuste estático por una predicción dinámica.

---

## Arquitectura Frontend

### Estructura de la PWA

La aplicación es una Single Page Application (SPA) que se comporta como PWA. El Service Worker cachea los assets estáticos y los datos de rutas para funcionamiento sin conexión.

```
/src
  /components
    /map
      BusMap.jsx          # mapa principal con unidades en tiempo real
      RoutePolyline.jsx   # trazado de ruta sobre el mapa
      StopMarker.jsx      # marcadores de paradas
      UnitMarker.jsx      # marcadores animados de buses
    /trip-planner
      SearchBar.jsx
      RouteOptions.jsx
      TripLeg.jsx
    /ratings
      RatingForm.jsx
      RatingDisplay.jsx
    /safety
      EmergencyButton.jsx
      IncidentReport.jsx
    /shared
      LoadingState.jsx
      ErrorState.jsx
      StaleDataBadge.jsx  # indicador de dato potencialmente desactualizado
  /hooks
    useWebSocket.js       # gestión de la conexión WS y reconexión automática
    useGeolocation.js     # acceso a GPS del dispositivo
    useOfflineData.js     # sincronización con Service Worker
  /stores
    mapStore.js           # posiciones en tiempo real de unidades
    userStore.js          # estado de autenticación
    favoritesStore.js     # rutas favoritas
  /services
    api.js                # cliente HTTP con manejo de errores y retry
    websocket.js          # gestión de conexión y suscripciones
  /pages
    Home.jsx
    RoutePlanner.jsx
    RouteDetail.jsx
    DriverApp.jsx         # interfaz separada para conductores
    Profile.jsx
    SafetySetup.jsx
  /sw
    service-worker.js     # cache de assets y datos offline
```

### Estrategia de offline

El Service Worker implementa dos estrategias de cache:

**Cache-first para datos estáticos:** Los assets (JS, CSS, imágenes) se sirven desde cache si existen, independientemente de la conectividad. Se actualizan en background cuando hay conexión.

**Network-first con fallback para datos de rutas:** Los datos de rutas y paradas se intentan obtener de la red primero. Si no hay conexión, se sirven desde el cache local. Las rutas favoritas del usuario se precargan y actualizan en cada apertura de la app cuando hay conexión disponible.

**Sin fallback para tiempo real:** Los datos de posición GPS no tienen fallback offline. Si no hay conexión, la interfaz muestra claramente que no hay datos en tiempo real disponibles, en lugar de mostrar datos desactualizados como si fueran actuales.

### Gestión del WebSocket en el cliente

```javascript
// Reconexión exponencial con backoff
const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000, 30000];

function useWebSocket(subscribedRoutes) {
  // Mantiene la conexión WS durante la sesión
  // Se reconecta automáticamente con backoff exponencial
  // No intenta reconectar si el dispositivo está sin conexión
  // Limpia la suscripción cuando el componente se desmonta
  // Reenvía las suscripciones activas tras reconexión
}
```

---

## Seguridad

### Autenticación y sesiones

Los tokens JWT se emiten con expiración de 30 días y se almacenan exclusivamente en cookies httpOnly con atributos `Secure` y `SameSite=Strict`. Esta combinación previene el acceso al token desde JavaScript (XSS) y los ataques CSRF.

La cookie no contiene datos de usuario: solo el `user_id` y el `jti` (JWT ID). Todos los datos de sesión se resuelven en el servidor contra la base de datos.

### Protección de endpoints GPS

El endpoint de recepción de posición GPS es el más crítico en términos de throughput y el más vulnerable a abuso. Las protecciones son:

1. Autenticación requerida con rol `driver`.
2. Rate limiting por `user_id`: máximo 1 request cada 8 segundos (el driver no necesita enviar más frecuente que cada 10 segundos; el margen permite variación de red).
3. Validación de que la `unit_id` enviada pertenece al operador del conductor autenticado.
4. Validación de que el `trip_id` está activo y pertenece a esa unidad.

### Anonimato en reportes de seguridad

El endpoint de reporte de incidentes no está protegido por autenticación. Esto es una decisión de diseño deliberada: requerir login para reportar acoso crea una barrera que reduce los reportes y puede disuadir a víctimas que temen ser identificadas.

Para prevenir abuso (spam de reportes falsos), se aplica rate limiting por IP: máximo 5 reportes por hora por dirección IP. No se almacena la IP en el reporte, solo se usa para el rate limiting en Redis con TTL de 1 hora.

### Cifrado de datos

- Datos en reposo: PostgreSQL sobre disco cifrado (gestionado por el proveedor de base de datos).
- Contraseñas: bcrypt con cost factor 12.
- Datos en tránsito: TLS 1.3 obligatorio. HSTS con `max-age=31536000; includeSubDomains`.

### Cabeceras de seguridad HTTP

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' wss://api.rumbo.app
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

---

## Infraestructura y Despliegue

### Diagrama de despliegue (MVP)

```
Internet
    │
Cloudflare (CDN + WAF + DDoS protection)
    │
    ├── Static Assets ──→ Cloudflare Pages (frontend build)
    │
    └── /api/* ──→ Railway / Render
                      │
                      ├── API Server (Node.js, 2 instancias)
                      ├── WebSocket Server (Node.js, 1 instancia)
                      └── Worker (BullMQ, 1 instancia)
                               │
                    ┌──────────┴──────────┐
                    │                     │
               Supabase              Upstash Redis
            (PostgreSQL)         (cache + pub/sub)
```

### Pipeline de CI/CD

```yaml
# GitHub Actions
on:
  push:
    branches: [main]

jobs:
  test:
    - Lint (ESLint)
    - Tests unitarios (Vitest)
    - Tests de integración (Supertest sobre DB de test)

  deploy-staging:
    needs: test
    - Deploy automático a entorno de staging
    - Tests de humo (smoke tests) contra staging

  deploy-production:
    needs: deploy-staging
    - Deploy manual con aprobación
    - Zero-downtime: nueva instancia sube antes de bajar la anterior
    - Rollback automático si los health checks fallan en los primeros 2 minutos
```

### Variables de entorno requeridas

```
DATABASE_URL              # Supabase connection string
REDIS_URL                 # Upstash Redis URL
JWT_SECRET                # mínimo 64 bytes aleatorios
TWILIO_ACCOUNT_SID        # para verificación por SMS
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
VAPID_PUBLIC_KEY          # para Web Push notifications
VAPID_PRIVATE_KEY
VAPID_SUBJECT             # mailto:ops@rumbo.app
CORS_ORIGIN               # URL del frontend en producción
NODE_ENV                  # production | staging | development
```

---

## Rendimiento y Escalabilidad

### Cuellos de botella identificados y estrategias

**Ingestión de GPS (escritura intensiva):** Con 500 buses enviando posición cada 10 segundos, el sistema recibe 50 writes/segundo en estado normal. Picos en hora de máxima operación pueden llegar a 150 writes/segundo. La estrategia es escribir en Redis de forma síncrona (operación de microsegundos) y diferir la escritura en PostgreSQL a un worker asíncrono. La escritura en PostgreSQL se hace en batches de 100 registros cada 5 segundos para reducir la presión en la base de datos.

**WebSocket connections:** Con 10,000 usuarios concurrentes y múltiples suscripciones por usuario, el WebSocket Server puede manejar entre 30,000 y 50,000 conexiones activas. Una sola instancia de Node.js puede manejar hasta 100,000 conexiones WebSocket con configuración adecuada de límites del sistema operativo. El pub/sub de Redis permite escalar horizontalmente añadiendo instancias del WebSocket Server sin cambios de código.

**Búsqueda de rutas:** La planificación de rutas implica queries geoespaciales sobre la red de paradas. El índice GIST de PostGIS hace estas queries eficientes, pero deben cachearse los resultados de las combinaciones origen-destino más frecuentes en Redis.

### Targets de rendimiento

| Métrica | Target | Cómo se mide |
|---|---|---|
| Latencia p50 de la API | < 100ms | Grafana + métricas de Railway |
| Latencia p95 de la API | < 500ms | Grafana |
| Throughput de GPS | > 1,000 writes/segundo | Test de carga con k6 |
| Usuarios concurrentes | > 10,000 | Test de carga con k6 |
| Uptime en horario de operación | > 99% | Uptime Robot |
| Tiempo de carga inicial (3G) | < 3 segundos | Lighthouse CI |

---

## Decisiones de Arquitectura

Esta sección documenta las decisiones técnicas más relevantes, la alternativa considerada, y la razón de la elección. Permite entender el "por qué" sin tener que reconstruirlo.

**PWA sobre apps nativas.**  
La alternativa era una app nativa en React Native. Se eligió PWA porque elimina la dependencia de aprobación de Apple y Google Play para el lanzamiento, reduce el tiempo de desarrollo en un 40% aproximadamente, y el Driver App (que requiere acceso continuo al GPS del dispositivo) funciona correctamente en Chrome Mobile sin restricciones. La desventaja es menor acceso a APIs nativas, aceptable para el alcance del MVP.

**GPS vía navegador del conductor en lugar de hardware IoT.**  
La alternativa era instalar dispositivos GPS en cada bus desde el inicio. Se eligió el GPS del teléfono del conductor para el MVP porque elimina el costo de hardware (~$150 por unidad × 500 buses = $75,000) y el proceso de instalación, permitiendo lanzar en semanas en lugar de meses. La desventaja es dependencia del teléfono del conductor: si se queda sin batería o el conductor cierra la app, se pierde el tracking. Esta decisión se revisará para el Producto B cuando se integren los operadores formalmente.

**Node.js sobre Python o Go.**  
Python (con FastAPI) es superior para el trabajo de ML futuro. Go es superior en throughput de CPU. Se eligió Node.js porque el equipo tiene mayor experiencia, el I/O asíncrono de Node maneja bien la carga de GPS y WebSockets, y el trabajo de ML del motor de predicción será un servicio separado cuando sea necesario, no parte del API principal.

**PostgreSQL + PostGIS sobre MongoDB o DynamoDB.**  
Los datos geoespaciales (posición de buses, paradas, trayectos de rutas) requieren consultas de proximidad y cálculos de distancia sobre geometrías. PostGIS sobre PostgreSQL es la solución más madura y eficiente para esto. MongoDB tiene soporte geoespacial pero es menos completo. DynamoDB no tiene soporte geoespacial nativo.

**No almacenar user_id en reportes de seguridad.**  
La alternativa era almacenarlo cifrado y desvincularlo de la identidad. Se eligió no almacenarlo en absoluto porque cualquier dato vinculable crea riesgo, especialmente bajo presión legal o gubernamental. Si no existe el dato, no puede ser compelido en ninguna jurisdicción. La desventaja es que no se puede prevenir que un usuario haga múltiples reportes falsos del mismo incidente usando la misma cuenta. El rate limiting por IP mitiga esto suficientemente para el MVP.
