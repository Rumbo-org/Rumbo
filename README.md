# Rumbo

Plataforma de movilidad en transporte público para países en desarrollo. Conecta pasajeros, operadores de flota y gobiernos municipales a través de una capa de datos compartida construida sobre rastreo GPS en tiempo real, estándares GTFS, y señales generadas por los propios usuarios.

---

## Documentación

| Documento | Descripción | Audiencia |
|---|---|---|
| [Visión y Estrategia](docs/01-vision-y-estrategia.md) | Problema, modelo de negocio, proyecciones financieras, estrategia de expansión | Fundadores, inversionistas, socios |
| [Product Requirements (PRD)](docs/02-product-requirements.md) | Personas, alcance del MVP, especificación funcional, criterios de aceptación | Product managers, diseñadores, ingenieros |
| [Especificación Técnica](docs/03-especificacion-tecnica.md) | Arquitectura, stack, modelo de datos, API, seguridad, infraestructura | Ingenieros de software, DevOps |
| [Análisis ROI para Operadores](docs/04-analisis-roi-operadores.md) | Cuantificación de pérdidas sin datos y retorno de inversión con Rumbo | Equipo de ventas, operadores de flota |

---

## El Problema

El transporte público en América Latina no falla por falta de buses. Falla porque el ecosistema de información está fragmentado: los operadores no tienen datos de su propia operación, los pasajeros no saben cuándo llega el próximo bus, y los gobiernos no pueden fiscalizar lo que no pueden medir.

Un operador mediano de 80 buses pierde aproximadamente **$3.3 millones al año** en evasión de tarifa, sobre-despliegue de flota, mantenimiento reactivo, y pérdida de pasajeros por problemas de calidad que nunca detecta.

## La Solución

Rumbo se organiza en cuatro capas que se construyen en orden de dependencia:

```
Gobierno      Portal municipal de análisis y fiscalización
Pasajeros     App web: tiempo real, evaluaciones, seguridad
Operadores    SaaS de gestión de flota y análisis de demanda
Datos         GPS en flotas + crowdsourcing + estandarización GTFS
```

## Productos

**Passenger App** — Aplicación web gratuita para pasajeros. Muestra la ubicación en tiempo real de los buses, permite planificar rutas, dejar evaluaciones verificadas del servicio, y acceder a herramientas de seguridad incluyendo reporte anónimo de incidentes.

**Driver App** — Interfaz web para conductores. Transmite la ubicación GPS del teléfono del conductor al sistema sin necesidad de hardware adicional en el bus.

**Operator Dashboard** — Plataforma SaaS para empresas autobuseras. Monitoreo de flota en tiempo real, análisis de demanda por parada y horario, optimización de frecuencias, y reportes de comportamiento de conductores.


## Mercados

Costa Rica es el mercado inicial. La expansión sigue este orden: Colombia, México (ciudades secundarias), Perú y Ecuador, África Subsahariana y Sudeste Asiático.

## Modelo de Negocio

Los pasajeros acceden sin costo. Los operadores pagan entre 50 y 200 USD por bus al mes. Los gobiernos suscriben contratos anuales de entre 50,000 y 500,000 USD por ciudad.

Proyección conservadora al tercer año operando en tres países: entre 7 y 8 millones de USD de ARR.
