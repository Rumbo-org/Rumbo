# Rumbo — Visión, Estrategia y Modelo de Negocio

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Audiencia:** Equipo fundador, inversionistas, socios estratégicos

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [El Problema](#el-problema)
3. [La Solución](#la-solución)
4. [Mercado Objetivo](#mercado-objetivo)
5. [Posicionamiento Competitivo](#posicionamiento-competitivo)
6. [Modelo de Negocio](#modelo-de-negocio)
7. [Proyecciones Financieras](#proyecciones-financieras)
8. [Estrategia de Expansión](#estrategia-de-expansión)
9. [Gestión de Riesgos](#gestión-de-riesgos)

---

## Resumen Ejecutivo

Rumbo es una plataforma de movilidad en transporte público construida para mercados en desarrollo. Resuelve la fragmentación sistémica del transporte colectivo mediante tres productos interconectados: una aplicación web para pasajeros, un sistema de gestión de flota para operadores, y un portal de análisis para gobiernos municipales.

El diferenciador central de Rumbo no es la experiencia de usuario —aunque esta es prioritaria— sino la capa de datos propietarios que construye con el tiempo: posición GPS de flotas en tiempo real, rutas estandarizadas en formato GTFS, y señales de comportamiento generadas por pasajeros. Esta capa convierte a Rumbo en la infraestructura de datos de movilidad de los mercados donde opera, lo que crea una barrera de entrada significativa para competidores.

El modelo de negocio es B2B y B2G. Los pasajeros acceden a la plataforma sin costo. Los operadores de flota pagan una suscripción mensual por unidad de bus. Los gobiernos municipales suscriben contratos anuales de análisis y fiscalización. Este modelo produce ingresos recurrentes y predecibles desde el primer año de operación.

---

## El Problema

### Por qué falla el transporte público en países en desarrollo

El transporte público en Costa Rica, Colombia, México, Perú y gran parte del mundo en desarrollo no falla por falta de infraestructura física. Falla porque el ecosistema de información que rodea a esa infraestructura está completamente fragmentado.

Los operadores de bus funcionan como islas. Cada empresa gestiona su flota sin coordinar con otras, sin compartir datos, y en muchos casos sin producir ningún dato digital. Los horarios se publican en papel o en PDF estáticos que nadie actualiza. Los conductores no tienen ningún sistema de despacho. Los supervisores monitorean las rutas desde paradas físicas, con radio o teléfono.

Este vacío de información afecta a todos los actores del sistema:

**El pasajero** no sabe cuándo llega el próximo bus. La incertidumbre sobre el tiempo de espera —no la espera en sí— es la principal causa de insatisfacción en transporte público. Cuando el pasajero no puede planificar, pierde confianza en el sistema y eventualmente migra al vehículo privado.

**El operador** no tiene datos para tomar decisiones. Asigna más buses en horas pico basándose en experiencia histórica, no en demanda real. No puede identificar rutas deficitarias, detectar conductores problemáticos, ni justificar ante el gobierno el cumplimiento de sus concesiones. El manejo de efectivo sin registro genera pérdidas por evasión de tarifa y desvíos internos que en operaciones medianas superan los 400,000 dólares anuales.

**El gobierno** no puede fiscalizar lo que no puede medir. Sin datos de operación real, los ministerios de transporte aprueban o renuevan concesiones sin evidencia objetiva. No pueden identificar dónde hay déficit de cobertura, ni demostrar a los ciudadanos que el servicio mejora.

### El ciclo que perpetúa el problema

El problema se autoperpetúa. Sin datos no hay planificación, sin planificación el servicio deteriora, con mal servicio los pasajeros migran al carro, con menos pasajeros los ingresos caen, con ingresos bajos los operadores no invierten en tecnología, y sin tecnología no hay datos. Ningún actor del sistema tiene suficiente incentivo individual para romper este ciclo.

Rumbo rompe el ciclo entrando por el lado del operador, donde el incentivo económico es inmediato y medible.

---

## La Solución

### Arquitectura de cuatro capas

Rumbo se construye en cuatro capas que se desarrollan en orden de dependencia. Sin la capa inferior, la superior no puede funcionar correctamente.

**Capa 1 — Datos:** La plataforma instala dispositivos GPS en las flotas de los operadores a cambio de acceso al sistema de gestión. Simultáneamente, estandariza los horarios existentes en formato GTFS y los enriquece con señales de posición generadas por los pasajeros de la app. Esta capa produce el activo diferenciador de Rumbo.

**Capa 2 — Operadores:** Con datos reales de posición y demanda, Rumbo ofrece a los operadores una plataforma SaaS de gestión de flota: monitoreo en tiempo real, análisis de demanda por parada y horario, optimización de frecuencias, y reportes de comportamiento de conductores. Este producto genera el ingreso principal de la compañía.

**Capa 3 — Pasajeros:** La aplicación web para pasajeros consume los datos producidos en la Capa 1 y los convierte en tiempo real de llegada, planificación de rutas, evaluaciones verificadas del servicio, y herramientas de seguridad. La app genera a su vez nuevas señales de datos que retroalimentan las Capas 1 y 2.

**Capa 4 — Gobierno:** El portal gubernamental agrega los datos de operación de todos los operadores de una ciudad para ofrecer a municipios y ministerios de transporte una visión consolidada de cumplimiento de concesiones, demanda urbana, y calidad de servicio.

### Qué hace a Rumbo diferente de Google Maps y Moovit

Google Maps y Moovit dependen de que los operadores publiquen datos en formato GTFS o de que los ciudadanos reporten problemas manualmente. En mercados con transporte informal —donde no hay GTFS, no hay GPS, y los horarios cambian sin aviso— estas plataformas ofrecen información imprecisa o directamente incorrecta.

Rumbo no espera que los datos existan. Los produce. Al instalar GPS en las flotas y construir GTFS desde cero junto con cada operador, Rumbo tiene acceso a información que ninguna plataforma global posee ni tiene incentivo de ir a producir.

---

## Mercado Objetivo

### Segmentación primaria

**Operadores de transporte (cliente pagador principal)**

El mercado de operadores de bus en América Latina comprende desde empresas con 10 unidades hasta corporaciones con 500 buses. Rumbo apunta inicialmente a operadores medianos —entre 20 y 200 buses— que tienen suficiente escala para justificar software de gestión, pero que no tienen el presupuesto ni la infraestructura técnica para soluciones enterprise. Este segmento está completamente desatendido por las plataformas actuales.

**Pasajeros urbanos (usuarios de la app)**

El mercado de usuarios es amplio. En Costa Rica, más de 700,000 personas utilizan transporte público en el Gran Área Metropolitana. El perfil de usuario prioritario es el pasajero frecuente —quien toma el mismo bus diariamente— que tiene motivación suficiente para instalar y aprender a usar la app si ésta le da información precisa y útil.

**Gobiernos municipales y ministerios de transporte (cliente de contratos grandes)**

Este segmento tiene el mayor valor de contrato individual pero el ciclo de ventas más largo. La estrategia es entrar con los operadores privados primero, acumular datos de la ciudad, y luego ofrecer al gobierno una visión que no puede construir por sí mismo.

### Tamaño del mercado

- América Latina tiene más de 51,000 buses en operación formal, con una tasa de crecimiento del 5.6% anual (2024-2030).
- El transporte informal añade entre un 40% y un 60% adicional de unidades no formalizadas en la mayoría de las ciudades.
- 21 millones de personas usan sistemas BRT diariamente solo en América Latina.
- El tiempo de commute promedio es 77 minutos por viaje, frente a 65 en países desarrollados —12 minutos adicionales que representan un costo económico enorme y una disposición a pagar por mejoras.

---

## Posicionamiento Competitivo

### Mapa de competidores

| Competidor | Fortaleza | Debilidad frente a Rumbo |
|---|---|---|
| Google Maps | Escala global, integración con Android | No produce datos propios; depende de GTFS público; no cubre transporte informal |
| Moovit | Crowdsourcing en 112 países | No tiene producto para operadores; fue adquirida por Intel por sus datos, no por su servicio |
| Optibus | Software enterprise de planificación de rutas | Orientado a grandes agencias municipales; precio prohibitivo para operadores medianos en LAC |
| Via Transportation | Plataforma de tránsito a demanda | Mercado diferente; opera en ciudades con subsidio gubernamental fuerte |
| Soluciones locales | Conocimiento regulatorio local | Sin capacidad de datos; generalmente un sitio web estático o una app básica sin backend real |

### Ventaja competitiva sostenible

La ventaja de Rumbo no es una funcionalidad que un competidor pueda copiar en seis meses. Es el conjunto de datos que construye con cada mes de operación en cada mercado. Los datos de posición GPS de una flota, acumulados durante años, permiten modelos de predicción que mejoran continuamente. Los GTFS construidos junto con los operadores son una base de datos que no existe en ningún otro lugar. Las evaluaciones verificadas de pasajeros son una capa cualitativa que ningún sistema de GPS puede replicar.

Esta acumulación de datos es una barrera de entrada que crece con el tiempo y convierte a Rumbo en el activo de infraestructura de movilidad de cada mercado donde opera.

---

## Modelo de Negocio

### Fuentes de ingreso

**SaaS para operadores de flota**

Es la fuente de ingreso principal y la que genera flujo de caja desde el primer año. Los operadores pagan una suscripción mensual por unidad de flota activa. El precio varía entre 50 y 200 dólares por bus al mes, dependiendo del tamaño del operador y las funcionalidades contratadas. Los operadores que instalan el dispositivo GPS en sus unidades reciben el primer mes sin costo, lo que elimina la fricción de adopción inicial.

**Contratos con gobiernos municipales**

El portal gubernamental se vende como contrato anual con el municipio o ministerio de transporte. El precio oscila entre 50,000 y 500,000 dólares por año, dependiendo del tamaño de la ciudad y el alcance del contrato. Este ingreso es el más estable y predecible del portafolio, pero requiere un ciclo de ventas de entre seis y dieciocho meses. La estrategia es entrar a las ciudades a través de los operadores privados y construir el caso de valor para el gobierno con datos reales.

**Beneficios de transporte corporativo**

Las empresas privadas pueden ofrecer a sus empleados acceso premium a Rumbo como beneficio laboral. El precio es entre 20 y 50 dólares por empleado al mes. Este canal tiene un ciclo de ventas más corto que el gubernamental y permite escalar sin depender de contratos individuales grandes.

**Funciones premium para pasajeros**

La aplicación es gratuita. Una versión premium con precio entre 3 y 8 dólares al mes ofrece alertas personalizadas ilimitadas, historial de viajes, y acceso anticipado a nuevas rutas y ciudades. Este ingreso es marginal en los primeros años pero escala naturalmente con la base de usuarios.

### Economía unitaria

Un operador mediano con 80 buses que paga 100 dólares por bus al mes genera 8,000 dólares mensuales de MRR. El costo de instalación del GPS (asumido por Rumbo en el modelo de adquisición) es de aproximadamente 10,000 dólares para esa flota. El payback de adquisición es de un mes y cuatro días. A partir del segundo mes, el margen es superior al 70% una vez deducidos los costos de conectividad celular y soporte.

---

## Proyecciones Financieras

Las proyecciones siguientes son conservadoras y asumen penetración lenta del mercado de operadores y un primer contrato gubernamental al final del segundo año.

### Año 1 — Costa Rica

- 8 operadores medianos con una flota promedio de 60 buses cada uno: 480 buses × 80 USD/mes = **38,400 USD/mes de MRR**.
- Sin contratos gubernamentales aún.
- Ingresos anuales proyectados: **460,800 USD**.

### Año 2 — Costa Rica + Colombia

- 25 operadores totales × 70 buses promedio × 90 USD/mes = **157,500 USD/mes de MRR**.
- Primer contrato municipal (San José o Bogotá): 150,000 USD anuales.
- Ingresos anuales proyectados: **2,040,000 USD**.

### Año 3 — Costa Rica + Colombia + México (ciudades secundarias)

- 50 operadores × 100 buses × 100 USD/mes = **500,000 USD/mes de MRR**.
- 4 contratos municipales × 150,000 USD anuales = **600,000 USD**.
- Ingresos anuales proyectados: **6,600,000 USD** de MRR más contratos.
- ARR total estimado: **entre 7 y 8 millones de USD**.

---

## Estrategia de Expansión

### Fase 1 — Validación: Costa Rica (Año 1)

Costa Rica es el mercado inicial por tres razones: el equipo fundador conoce el entorno regulatorio, el tamaño del Gran Área Metropolitana es manejable para cubrir un porcentaje alto de rutas en los primeros meses, y existe una base de usuarios urbanos con penetración de smartphone suficiente. El objetivo del año 1 no es escala sino aprendizaje: validar el modelo de adquisición de operadores, el índice de precisión del motor de predicción de llegadas, y la retención de usuarios de la app.

### Fase 2 — Primera expansión: Colombia (Año 2)

Bogotá y Medellín tienen ecosistemas tecnológicos maduros, alta conciencia pública sobre los problemas de movilidad, y problemas graves y documentados de transporte público que justifican el producto. El mercado informal en estas ciudades es sustancial, lo que permite probar la capacidad de Rumbo para integrar transporte no estandarizado.

### Fase 3 — Escala: México, ciudades secundarias (Año 3)

El mercado más grande de la región. Las ciudades mexicanas con poblaciones entre 200,000 y un millón de habitantes carecen completamente de soluciones digitales de movilidad y tienen menor competencia que Ciudad de México. Este segmento de ciudades secundarias permite escalar el modelo sin enfrentar directamente a los pocos actores con mayor presencia en las capitales.

### Fase 4 — Consolidación regional: Perú, Ecuador (Año 4)

Alta informalidad en el transporte urbano, lo que hace crítico el producto de crowdsourcing e integración de operadores no formalizados. Estos mercados tienen menor capacidad de pago por parte de los operadores, por lo que la estrategia de precios se ajusta para priorizar volumen y cobertura de datos.

### Fase 5 — Expansión global: África Subsahariana, Sudeste Asiático (Año 5+)

El mismo modelo de negocio y la misma arquitectura de datos es aplicable directamente a ciudades como Nairobi, Lagos, Accra, Dar es Salaam, Ho Chi Minh City y Dhaka. Estos mercados tienen hipercrecimiento urbano, los mismos problemas estructurales de fragmentación, y ausencia de competidores locales con capacidad técnica.

---

## Gestión de Riesgos

### Riesgos de mercado

**Google Maps mejora su cobertura en LAC.** Google puede invertir en producir datos GTFS para América Latina. La mitigación es profundizar en el transporte informal y en los datos de operadores —dos segmentos donde Google no tiene acceso directo ni incentivo económico para entrar.

**Baja disposición a pagar de los operadores.** Los operadores medianos en LAC tienen márgenes ajustados. La mitigación es demostrar ROI en los primeros 60 días: reducción medible de costos operativos y recuperación de ingresos por evasión de tarifa. El análisis de ROI detallado está disponible en el documento de análisis financiero para operadores.

### Riesgos regulatorios

**Regulación hostil al modelo de datos.** Los datos de posición de flotas pueden estar sujetos a regulaciones de protección de datos en algunos mercados. La mitigación es estructurar el modelo de datos desde el inicio con anonimización robusta y cumplimiento de las normativas locales aplicables (LFPDPPP en México, Ley 1581 en Colombia, etc.).

**Ciclos de venta gubernamentales impredecibles.** Los contratos con municipios y ministerios pueden estancarse en procesos de licitación de 12 a 24 meses. La mitigación es que el SaaS de operadores genera ingresos completamente independientes del canal gubernamental.

### Riesgos técnicos

**Confiabilidad de los dispositivos GPS en campo.** Los dispositivos instalados en buses operan en condiciones de temperatura, vibración y conectividad variables. La mitigación es seleccionar hardware con certificación industrial y diseñar el sistema para tolerar períodos de desconexión sin pérdida de datos críticos.

**Precisión del motor de predicción de llegadas.** Un error consistente en las predicciones destruye la confianza del usuario más rápido que cualquier otro problema. La mitigación es no mostrar predicciones hasta que el modelo tenga suficientes datos históricos de esa ruta, y ser transparente con el usuario cuando la información es estimada versus confirmada.
