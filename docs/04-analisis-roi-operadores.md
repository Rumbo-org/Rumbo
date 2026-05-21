# Rumbo — Cuánto Pierde una Empresa Autobusera sin Datos

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Audiencia:** Operadores de flota, directores de operaciones, equipo de ventas de Rumbo

---

## Introducción

Este documento cuantifica las pérdidas operativas que enfrenta una empresa autobusera que opera sin un sistema de datos y gestión de flota. Las cifras se basan en datos de operaciones de transporte público en América Latina, estudios de eficiencia operativa del sector, y benchmarks de plataformas similares implementadas en mercados comparables.

El análisis usa como referencia de base a un operador mediano en Costa Rica con las siguientes características: 80 buses activos, 12 horas de operación diaria por unidad, tarifa promedio por pasajero de 600 colones (aproximadamente 1.15 dólares), y un promedio de 400 pasajeros por bus por día en operación normal.

Los resultados se escalan para flotas de distintos tamaños al final del documento.

---

## Las Cinco Fuentes de Pérdida

### 1. Pérdidas por evasión de tarifa y desvío de efectivo

**El problema**

Las empresas que operan con cobro en efectivo sin registro digital tienen un problema estructural: el efectivo que entra al bus no se reconcilia con el número de pasajeros que subió. El conductor es al mismo tiempo recaudador y operador del vehículo, sin supervisión en tiempo real.

Los estudios de reforma de transporte en ciudades latinoamericanas —Lima, Bogotá, Ciudad de México— estiman que entre el 8% y el 15% de los ingresos por tarifa en operaciones de efectivo no llegan a las cuentas del operador. Este porcentaje incluye tanto evasión de tarifa (pasajeros que no pagan) como desvíos por parte del conductor o del ayudante.

**Cálculo para el operador de referencia:**

- Ingresos diarios brutos: 80 buses × 400 pasajeros × $1.15 = **$36,800/día**
- Pérdida por evasión y desvío (10% conservador): **$3,680/día**
- Pérdida anual: **$1,343,200/año**

Esta es, con diferencia, la mayor fuente de pérdida económica de un operador que no usa datos.

**Cómo lo resuelve Rumbo**

La combinación de registro digital de viajes, GPS en tiempo real, y evaluaciones verificadas de pasajeros no elimina el efectivo inmediatamente, pero crea un sistema de trazabilidad que disuade el desvío. En una segunda etapa, la integración con SINPE Móvil o tarjetas permite eliminar el efectivo en los corredores de mayor adopción digital.

---

### 2. Pérdidas por sobre-despliegue de flota en horas de baja demanda

**El problema**

Sin datos de demanda por franja horaria, los operadores asignan buses basándose en reglas históricas rígidas o en la intuición del despachador. El resultado habitual es que la flota completa opera con la misma frecuencia durante las 12 horas del día, cuando la demanda real varía drásticamente: la hora pico de la mañana puede tener cuatro veces más pasajeros que la hora de menor demanda en la tarde.

Operar un bus en horas de baja demanda no es neutro: implica combustible, desgaste mecánico, y el costo del conductor. El costo operativo de un bus en ruta en Costa Rica oscila entre 35 y 55 dólares por hora, incluyendo combustible, depreciación y mano de obra.

**Cálculo para el operador de referencia:**

Una distribución típica de demanda en un corredor urbano muestra que durante aproximadamente 4 horas del día la demanda es entre un 40% y un 60% menor que el promedio. Si el operador mantiene la flota completa durante esas horas, está pagando el costo de operar entre 15 y 25 buses adicionales innecesariamente.

- Buses sobre-desplegados en horas de baja demanda: estimado 20 buses × 4 horas/día
- Costo por bus-hora: $45
- Pérdida diaria: 20 buses × 4 horas × $45 = **$3,600/día**
- Pérdida anual: **$1,314,000/año**

**Cómo lo resuelve Rumbo**

El módulo de análisis de demanda del Producto B muestra la distribución de pasajeros por parada, ruta, y franja horaria. Con estos datos, el operador puede construir un esquema de despacho diferenciado por hora que reduce la flota en circulación durante horas de baja demanda sin afectar el nivel de servicio en horas pico.

En implementaciones similares documentadas, los operadores que adoptan despacho basado en datos reducen sus costos operativos en un 12% a 18% en los primeros seis meses.

---

### 3. Pérdidas por mantenimiento reactivo en lugar de preventivo

**El problema**

Sin datos de comportamiento del conductor —velocidad, frenadas bruscas, aceleraciones agresivas, tiempo en paradas— el operador no puede identificar qué conductores están causando desgaste excesivo en sus unidades. El mantenimiento se hace cuando algo se rompe, no antes.

El mantenimiento reactivo tiene tres costos que el preventivo no tiene: el costo de la avería en sí (siempre mayor), el costo del tiempo de inactividad del bus mientras se repara, y el riesgo de accidente cuando un componente falla en ruta.

**Cálculo para el operador de referencia:**

- Costo anual de mantenimiento por bus en operación normal sin datos: estimado $8,000-$12,000/año/bus
- El mantenimiento reactivo incrementa este costo entre un 25% y un 35% frente al preventivo
- Sobrecosto por bus: $2,500/año (conservador)
- Pérdida anual para la flota completa: 80 buses × $2,500 = **$200,000/año**

Además, un bus fuera de operación por avería deja de generar ingresos. Si una unidad está fuera de servicio en promedio 8 días al año por mantenimiento no planificado:

- Pérdida de ingresos por unidad inactiva: 8 días × 400 pasajeros × $1.15 = $3,680/bus/año
- Pérdida total por flota: 80 buses × $3,680 = **$294,400/año**

**Cómo lo resuelve Rumbo**

Los reportes de comportamiento del conductor permiten identificar conductores con patrones de conducción agresiva y programar revisiones preventivas de los sistemas de frenos, suspensión y transmisión de sus unidades antes de que fallen. El módulo también permite establecer alertas cuando una unidad supera umbrales de frenada o aceleración que predicen desgaste acelerado.

---

### 4. Pérdida de pasajeros por mala calidad de servicio sin mecanismo de corrección

**El problema**

Cuando un pasajero tiene una mala experiencia —el bus llegó 30 minutos tarde, el conductor fue grosero, el vehículo estaba en malas condiciones— no tiene ningún canal formal para reportarlo. El operador tampoco tiene forma de saber que ocurrió. El pasajero eventualmente migra a otro modo de transporte o al vehículo privado.

La pérdida de un pasajero frecuente no es un evento puntual: es la pérdida de ingresos recurrentes durante meses o años. Un pasajero que toma el bus 20 días al mes representa 20 × $1.15 = $23 de ingreso mensual. Si el operador pierde el 3% de su base de pasajeros anualmente por problemas de calidad que no detecta ni corrige, el impacto acumulado es significativo.

**Cálculo para el operador de referencia:**

- Base total de pasajeros estimada: 80 buses × 400 pasajeros/día = 32,000 pasajeros únicos por mes (asumiendo que cada pasajero usa el servicio en promedio 10 días al mes)
- Pérdida anual de pasajeros por problemas de calidad no detectados: 3% = 960 pasajeros
- Ingreso perdido por pasajero: 10 días/mes × $1.15 × 12 meses = $138/pasajero/año
- Pérdida total: 960 pasajeros × $138 = **$132,480/año**

**Cómo lo resuelve Rumbo**

Las evaluaciones verificadas crean un sistema de alerta temprana. El operador ve en tiempo real qué rutas y qué conductores están recibiendo calificaciones bajas, puede investigar el problema específico, y corregirlo antes de que la insatisfacción acumulada se traduzca en abandono del servicio.

---

### 5. Riesgo de sanciones regulatorias por incumplimiento de concesión

**El problema**

Las concesiones de transporte público en Costa Rica establecen frecuencias mínimas de servicio, horarios de operación, y estándares de calidad. Sin datos propios de operación, los operadores no pueden demostrar ante el MOPT (Ministerio de Obras Públicas y Transportes) que cumplen con los términos de su concesión cuando son fiscalizados.

En los últimos años, el MOPT ha incrementado las inspecciones de cumplimiento. Los operadores que no pueden presentar registros de operación enfrentan multas, advertencias formales, y en casos reiterados, riesgo de suspensión de la concesión.

**Estimación de riesgo:**

- Multa promedio por incumplimiento documentado en Costa Rica: entre $5,000 y $30,000 por evento.
- Probabilidad anual de fiscalización con hallazgo de incumplimiento sin datos: estimado 35% para un operador mediano activo.
- Costo esperado anual por riesgo regulatorio: 0.35 × $17,500 (punto medio) = **$6,125/año**

Este número parece menor que las otras fuentes de pérdida, pero el riesgo cola es alto: una sanción grave o la pérdida de una concesión elimina el negocio completo.

**Cómo lo resuelve Rumbo**

El sistema genera automáticamente registros de operación en formato exportable. El operador puede presentar ante cualquier autoridad regulatoria el historial completo de viajes, frecuencias, y cobertura de paradas de cualquier período, lo que convierte la fiscalización de un riesgo en una ventaja competitiva.

---

## Resumen de Pérdidas y ROI

### Para el operador de referencia (80 buses)

| Fuente de pérdida | Pérdida anual estimada |
|---|---|
| Evasión de tarifa y desvío de efectivo | $1,343,200 |
| Sobre-despliegue en horas de baja demanda | $1,314,000 |
| Mantenimiento reactivo y buses inactivos | $494,400 |
| Pérdida de pasajeros por problemas no detectados | $132,480 |
| Riesgo regulatorio | $6,125 |
| **Total pérdida anual estimada** | **$3,290,205** |

### Costo de Rumbo para el mismo operador

- Suscripción Rumbo: 80 buses × $100/mes × 12 meses = **$96,000/año**
- Costo de instalación GPS (amortizado en 3 años): 80 buses × $150 / 3 = **$4,000/año**
- **Costo total año 1: $100,000**

### Retorno sobre la inversión

Asumiendo que Rumbo permite recuperar el 30% de las pérdidas identificadas —un objetivo conservador considerando que otras implementaciones similares han reportado recuperación de entre el 25% y el 45% en el primer año:

- Recuperación al 30%: $3,290,205 × 0.30 = **$987,061**
- Inversión: **$100,000**
- Retorno sobre la inversión: **887%**
- Payback period: **37 días**

---

## Escala para distintos tamaños de flota

| Tamaño de flota | Pérdida anual estimada | Costo Rumbo/año | ROI (recuperación 30%) |
|---|---|---|---|
| 20 buses | $822,551 | $27,000 | 813% |
| 50 buses | $2,056,378 | $63,000 | 879% |
| 80 buses | $3,290,205 | $100,800 | 887% |
| 150 buses | $6,169,134 | $189,000 | 880% |
| 300 buses | $12,338,268 | $360,000 | 926% |

El ROI es relativamente estable en todos los tamaños de flota porque tanto los costos como los beneficios escalan linealmente con el número de unidades.

---

## Nota Metodológica

Las cifras de este análisis son estimaciones basadas en los siguientes supuestos y fuentes:

- Tarifa promedio y carga de pasajeros: datos del MOPT y estudios del PRUGAM para el Gran Área Metropolitana de Costa Rica.
- Pérdidas por efectivo: meta-análisis de reformas de transporte en Lima (Harvard Kennedy School, 2024), Bogotá (Banco Mundial, 2023), y Ciudad de México (IMCO, 2022).
- Costos operativos por bus-hora: estimaciones del sector para Costa Rica, basadas en precios de combustible, salario mínimo de conductor, y depreciación estándar.
- Costos de mantenimiento reactivo versus preventivo: benchmarks de la industria de transporte terrestre (UITP, 2024).
- Pérdida de pasajeros por calidad: modelado propio basado en tasas de churn documentadas en sistemas BRT de la región.

Los números reales para cada operador variarán dependiendo de sus rutas específicas, su estructura de costos, y su mercado. Se recomienda realizar un diagnóstico de datos con el equipo de Rumbo para generar una estimación personalizada.
