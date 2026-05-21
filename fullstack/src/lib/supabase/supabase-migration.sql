-- ============================================================
-- Rumbo — Migración inicial
-- Correr en: Supabase Studio → SQL Editor
-- ============================================================

-- ── Operadores ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS operators (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    tax_id      TEXT UNIQUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Rutas ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS routes (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id        UUID REFERENCES operators(id),
    route_number       TEXT NOT NULL,
    name               TEXT NOT NULL,
    origin             TEXT NOT NULL DEFAULT '',
    destination        TEXT NOT NULL DEFAULT '',
    frequency_minutes  INTEGER NOT NULL DEFAULT 10,
    status             TEXT CHECK (status IN ('on_time', 'delayed')) DEFAULT 'on_time',
    active_buses       INTEGER DEFAULT 0,
    rating             NUMERIC(3,1) DEFAULT 0,
    waypoints          JSONB DEFAULT '[]',   -- [{ lat, lng }, ...]
    active             BOOLEAN DEFAULT TRUE,
    created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- ── Paradas ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stops (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name      TEXT NOT NULL,
    lat       DOUBLE PRECISION NOT NULL,
    lng       DOUBLE PRECISION NOT NULL,
    stop_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Relación ruta-paradas ────────────────────────────────────
CREATE TABLE IF NOT EXISTS route_stops (
    route_id                  UUID REFERENCES routes(id) ON DELETE CASCADE,
    stop_id                   UUID REFERENCES stops(id) ON DELETE CASCADE,
    sequence                  INTEGER NOT NULL,
    scheduled_offset_seconds  INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (route_id, stop_id, sequence)
);

-- ── Unidades ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS units (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id   UUID REFERENCES operators(id),
    unit_number   TEXT NOT NULL,
    license_plate TEXT,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (operator_id, unit_number)
);

-- ── Viajes ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trips (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id   UUID REFERENCES routes(id),
    unit_id    UUID REFERENCES units(id),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at   TIMESTAMPTZ,
    status     TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active'
);

-- ── Posiciones GPS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gps_positions (
    id          BIGSERIAL PRIMARY KEY,
    trip_id     UUID REFERENCES trips(id),
    unit_id     UUID REFERENCES units(id),
    lat         DOUBLE PRECISION NOT NULL,
    lng         DOUBLE PRECISION NOT NULL,
    speed_kmh   NUMERIC(5,2) DEFAULT 0,
    heading     NUMERIC(5,1) DEFAULT 0,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    received_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gps_positions_unit_time_idx ON gps_positions (unit_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS gps_positions_trip_idx ON gps_positions (trip_id, recorded_at DESC);

-- ============================================================
-- RLS — Políticas de acceso (anon puede leer; solo service role escribe)
-- ============================================================
ALTER TABLE operators       ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE stops           ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops     ENABLE ROW LEVEL SECURITY;
ALTER TABLE units           ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips           ENABLE ROW LEVEL SECURITY;
ALTER TABLE gps_positions   ENABLE ROW LEVEL SECURITY;

-- Lectura pública de catálogos
CREATE POLICY "public read routes"       ON routes         FOR SELECT USING (true);
CREATE POLICY "public read stops"        ON stops          FOR SELECT USING (true);
CREATE POLICY "public read route_stops"  ON route_stops    FOR SELECT USING (true);
CREATE POLICY "public read operators"    ON operators      FOR SELECT USING (true);
CREATE POLICY "public read units"        ON units          FOR SELECT USING (true);

-- Lectura de viajes activos y posiciones GPS
CREATE POLICY "public read active trips" ON trips          FOR SELECT USING (status = 'active');
CREATE POLICY "public read gps"          ON gps_positions  FOR SELECT USING (true);

-- Inserción de posiciones GPS (solo service role / conductores autenticados — ajustar con auth después)
CREATE POLICY "service insert gps"       ON gps_positions  FOR INSERT WITH CHECK (true);
CREATE POLICY "service insert trips"     ON trips          FOR INSERT WITH CHECK (true);
CREATE POLICY "service update trips"     ON trips          FOR UPDATE USING (true);

-- ============================================================
-- Habilitar Realtime en gps_positions
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE gps_positions;

-- ============================================================
-- Seed data (rutas de San José, Costa Rica)
-- ============================================================
DO $$
DECLARE
  op_id       UUID;
  r1_id       UUID;
  r200_id     UUID;
  r330_id     UUID;
  r400_id     UUID;
  s_710_id    UUID;
  s_mora_id   UUID;
  s_av_id     UUID;
  s_ccss_id   UUID;
  s_sab_id    UUID;
  s_pavas_id  UUID;
  s_esc_id    UUID;
  s_ala_id    UUID;
  u1_id       UUID;
  u2_id       UUID;
  u3_id       UUID;
  u4_id       UUID;
  u5_id       UUID;
  u6_id       UUID;
  t1_id       UUID;
  t2_id       UUID;
  t3_id       UUID;
  t4_id       UUID;
  t5_id       UUID;
  t6_id       UUID;
BEGIN

-- Operador
INSERT INTO operators (id, name) VALUES (gen_random_uuid(), 'TUASA') RETURNING id INTO op_id;

-- Paradas
INSERT INTO stops (id, name, lat, lng) VALUES (gen_random_uuid(), 'Terminal 7-10',        9.9344,  -84.0869) RETURNING id INTO s_710_id;
INSERT INTO stops (id, name, lat, lng) VALUES (gen_random_uuid(), 'Parque Morazán',        9.9337,  -84.0784) RETURNING id INTO s_mora_id;
INSERT INTO stops (id, name, lat, lng) VALUES (gen_random_uuid(), 'Av. Central / Calle 2', 9.9319,  -84.0803) RETURNING id INTO s_av_id;
INSERT INTO stops (id, name, lat, lng) VALUES (gen_random_uuid(), 'CCSS Central',          9.9301,  -84.0847) RETURNING id INTO s_ccss_id;
INSERT INTO stops (id, name, lat, lng) VALUES (gen_random_uuid(), 'Sabana Norte',          9.9393,  -84.1025) RETURNING id INTO s_sab_id;
INSERT INTO stops (id, name, lat, lng) VALUES (gen_random_uuid(), 'Pavas Centro',          9.9359,  -84.1255) RETURNING id INTO s_pavas_id;
INSERT INTO stops (id, name, lat, lng) VALUES (gen_random_uuid(), 'Escazú Centro',         9.9199,  -84.1364) RETURNING id INTO s_esc_id;
INSERT INTO stops (id, name, lat, lng) VALUES (gen_random_uuid(), 'Alajuela Centro',       9.9990,  -84.2116) RETURNING id INTO s_ala_id;

-- Ruta 1
INSERT INTO routes (id, operator_id, route_number, name, origin, destination, frequency_minutes, status, active_buses, rating, waypoints)
VALUES (
  gen_random_uuid(), op_id, '1', 'San José – Alajuela', 'Terminal 7-10', 'Alajuela Centro', 8, 'on_time', 4, 4.2,
  '[{"lat":9.9344,"lng":-84.0869},{"lat":9.9393,"lng":-84.1025},{"lat":9.9538,"lng":-84.1298},{"lat":9.9725,"lng":-84.1602},{"lat":9.9870,"lng":-84.1890},{"lat":9.9990,"lng":-84.2116}]'::jsonb
) RETURNING id INTO r1_id;

-- Ruta 200
INSERT INTO routes (id, operator_id, route_number, name, origin, destination, frequency_minutes, status, active_buses, rating, waypoints)
VALUES (
  gen_random_uuid(), op_id, '200', 'San José – Pavas', 'Terminal 7-10', 'Pavas Centro', 6, 'on_time', 6, 4.5,
  '[{"lat":9.9344,"lng":-84.0869},{"lat":9.9337,"lng":-84.0920},{"lat":9.9355,"lng":-84.1065},{"lat":9.9370,"lng":-84.1165},{"lat":9.9359,"lng":-84.1255}]'::jsonb
) RETURNING id INTO r200_id;

-- Ruta 330
INSERT INTO routes (id, operator_id, route_number, name, origin, destination, frequency_minutes, status, active_buses, rating, waypoints)
VALUES (
  gen_random_uuid(), op_id, '330', 'San José – Escazú', 'Av. Central / Calle 2', 'Escazú Centro', 10, 'delayed', 3, 3.8,
  '[{"lat":9.9319,"lng":-84.0803},{"lat":9.9280,"lng":-84.0950},{"lat":9.9245,"lng":-84.1100},{"lat":9.9215,"lng":-84.1250},{"lat":9.9199,"lng":-84.1364}]'::jsonb
) RETURNING id INTO r330_id;

-- Ruta 400
INSERT INTO routes (id, operator_id, route_number, name, origin, destination, frequency_minutes, status, active_buses, rating, waypoints)
VALUES (
  gen_random_uuid(), op_id, '400', 'San José – Zapote', 'CCSS Central', 'Zapote Centro', 12, 'on_time', 2, 4.0,
  '[{"lat":9.9301,"lng":-84.0847},{"lat":9.9280,"lng":-84.0750},{"lat":9.9230,"lng":-84.0620},{"lat":9.9170,"lng":-84.0510}]'::jsonb
) RETURNING id INTO r400_id;

-- route_stops
INSERT INTO route_stops (route_id, stop_id, sequence, scheduled_offset_seconds) VALUES
  (r1_id,   s_710_id,   1, 0),
  (r1_id,   s_sab_id,   2, 600),
  (r1_id,   s_ala_id,   3, 2400),
  (r200_id, s_710_id,   1, 0),
  (r200_id, s_sab_id,   2, 480),
  (r200_id, s_pavas_id, 3, 1200),
  (r330_id, s_av_id,    1, 0),
  (r330_id, s_esc_id,   2, 1800),
  (r400_id, s_ccss_id,  1, 0),
  (r400_id, s_av_id,    2, 300);

-- Unidades
INSERT INTO units (id, operator_id, unit_number) VALUES (gen_random_uuid(), op_id, 'U-001') RETURNING id INTO u1_id;
INSERT INTO units (id, operator_id, unit_number) VALUES (gen_random_uuid(), op_id, 'U-002') RETURNING id INTO u2_id;
INSERT INTO units (id, operator_id, unit_number) VALUES (gen_random_uuid(), op_id, 'U-003') RETURNING id INTO u3_id;
INSERT INTO units (id, operator_id, unit_number) VALUES (gen_random_uuid(), op_id, 'U-004') RETURNING id INTO u4_id;
INSERT INTO units (id, operator_id, unit_number) VALUES (gen_random_uuid(), op_id, 'U-005') RETURNING id INTO u5_id;
INSERT INTO units (id, operator_id, unit_number) VALUES (gen_random_uuid(), op_id, 'U-006') RETURNING id INTO u6_id;

-- Viajes activos
INSERT INTO trips (id, route_id, unit_id, status) VALUES (gen_random_uuid(), r1_id,   u1_id, 'active') RETURNING id INTO t1_id;
INSERT INTO trips (id, route_id, unit_id, status) VALUES (gen_random_uuid(), r1_id,   u2_id, 'active') RETURNING id INTO t2_id;
INSERT INTO trips (id, route_id, unit_id, status) VALUES (gen_random_uuid(), r200_id, u3_id, 'active') RETURNING id INTO t3_id;
INSERT INTO trips (id, route_id, unit_id, status) VALUES (gen_random_uuid(), r200_id, u4_id, 'active') RETURNING id INTO t4_id;
INSERT INTO trips (id, route_id, unit_id, status) VALUES (gen_random_uuid(), r330_id, u5_id, 'active') RETURNING id INTO t5_id;
INSERT INTO trips (id, route_id, unit_id, status) VALUES (gen_random_uuid(), r400_id, u6_id, 'active') RETURNING id INTO t6_id;

-- Posiciones GPS iniciales
INSERT INTO gps_positions (trip_id, unit_id, lat, lng, speed_kmh, heading) VALUES
  (t1_id, u1_id, 9.9538, -84.1298, 42, 315),
  (t2_id, u2_id, 9.9725, -84.1602, 55, 315),
  (t3_id, u3_id, 9.9355, -84.1065, 28, 270),
  (t4_id, u4_id, 9.9370, -84.1165, 31, 270),
  (t5_id, u5_id, 9.9245, -84.1100, 20, 225),
  (t6_id, u6_id, 9.9280, -84.0750, 25, 135);

END $$;
