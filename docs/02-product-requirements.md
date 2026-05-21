# Rumbo — Product Requirements Document (PRD)

**Versión:** 1.0  
**Fecha:** Mayo 2026  
**Audiencia:** Product managers, diseñadores, ingenieros de frontend y backend  
**Scope:** MVP — Aplicación para pasajeros y Driver App (Costa Rica)

---

## Tabla de Contenidos

1. [Resumen del Producto](#resumen-del-producto)
2. [Principios de Diseño](#principios-de-diseño)
3. [Usuarios y Personas](#usuarios-y-personas)
4. [Alcance del MVP](#alcance-del-mvp)
5. [Funcionalidades por Módulo](#funcionalidades-por-módulo)
6. [Flujos de Usuario Principales](#flujos-de-usuario-principales)
7. [Requisitos No Funcionales](#requisitos-no-funcionales)
8. [Fuera de Alcance](#fuera-de-alcance)
9. [Criterios de Aceptación](#criterios-de-aceptación)

---

## Resumen del Producto

El MVP de Rumbo es una aplicación web responsive diseñada para funcionar en cualquier dispositivo con navegador moderno, sin necesidad de instalación. Está compuesto por dos interfaces distintas que comparten la misma infraestructura backend:

**Passenger App** es la interfaz para pasajeros. Permite ver la ubicación en tiempo real de los buses, planificar rutas, recibir estimaciones de llegada, evaluar el servicio, y acceder a herramientas de seguridad. El acceso es gratuito.

**Driver App** es la interfaz para conductores. Permite al conductor transmitir su ubicación GPS desde el navegador del celular, seleccionar su ruta y unidad, e iniciar o detener el tracking. No requiere hardware adicional en el bus para el MVP: el GPS del teléfono del conductor es la fuente de posición.

Ambas interfaces se construyen como una Progressive Web App (PWA) para habilitar comportamiento nativo —notificaciones push, acceso sin conexión, pantalla de inicio— sin las restricciones y costos de publicación en tiendas de aplicaciones.

---

## Principios de Diseño

Estos principios no son aspiracionales. Son restricciones que deben respetarse en cada decisión de producto y cada iteración de diseño.

**Cero tolerancia al error de información.** Mostrar información incorrecta es peor que no mostrar nada. Si no hay datos confiables para una ruta, el sistema debe indicarlo explícitamente en lugar de mostrar estimaciones inventadas. La confianza del usuario se construye con décadas de consistencia y se destruye con un solo bus que "llegaba en 3 minutos" y nunca apareció.

**La espera predecible es mejor que la espera incierta.** El objetivo no es eliminar el tiempo de espera —eso está fuera del control de Rumbo— sino eliminar la incertidumbre. Un pasajero que sabe que el bus llega en 18 minutos espera con calma. Un pasajero que no sabe si el bus ya pasó o está por llegar experimenta ansiedad. Toda decisión de UI/UX debe priorizar la claridad sobre la llegada del próximo bus.

**Funciona primero, se ve bien después.** El rendimiento y la confiabilidad son características de producto, no de infraestructura. Una interfaz lenta o que falla en conexión 3G no es un "problema técnico": es un producto fallido para el mercado al que va dirigido.

**El usuario no lee.** Las instrucciones en pantalla deben ser mínimas. La navegación debe ser inferible sin explicación. Cualquier acción crítica —reportar un incidente, activar el botón de seguridad— debe completarse en máximo dos toques.

---

## Usuarios y Personas

### Persona 1: Pasajero urbano frecuente

**Nombre representativo:** Andrea, 28 años, San José.  
**Contexto:** Toma el bus dos veces al día para ir al trabajo. Tiene smartphone Android con plan de datos limitado. Conoce sus dos rutas de memoria pero tiene incertidumbre sobre los horarios exactos, especialmente en las mañanas cuando el tráfico es impredecible.  
**Motivación principal:** Saber si puede tomarse los cinco minutos adicionales de desayuno o si tiene que salir ya.  
**Frustración principal:** Llegar a la parada y no saber si el bus ya pasó o si está por llegar. Nunca saber si el servicio va atrasado.  
**Comportamiento tecnológico:** Usa WhatsApp, Instagram y Google Maps. Descarga apps solo si alguien de confianza se las recomienda.

### Persona 2: Pasajero ocasional

**Nombre representativo:** Marco, 45 años, visita San José desde Cartago.  
**Contexto:** Toma buses interurbanos una o dos veces por semana. No conoce bien las rutas urbanas del centro. Su prioridad es no perderse y llegar a tiempo a sus compromisos.  
**Motivación principal:** Planificar el viaje completo de antemano y saber exactamente qué bus tomar y dónde bajarse.  
**Frustración principal:** Preguntarle a desconocidos en la parada, que le den información contradictoria, y perder el bus equivocado.  
**Comportamiento tecnológico:** Usa el celular para llamadas y WhatsApp. Necesita instrucciones muy claras y no tiene tolerancia para interfaces complejas.

### Persona 3: Conductora de bus

**Nombre representativo:** Carmen, 38 años, conductora con 9 años de experiencia.  
**Contexto:** Maneja una ruta urbana en el GAM. Tiene smartphone, pero no tiene tiempo durante la operación para interactuar con aplicaciones complejas.  
**Motivación principal:** No quiere complicaciones adicionales. Si el sistema de tracking requiere atención durante el manejo, no lo va a usar.  
**Frustración principal:** Aplicaciones que se apagan solas, que consumen mucha batería, o que requieren que haga cosas mientras está conduciendo.  
**Comportamiento tecnológico:** Usa WhatsApp y Facebook. No instala apps sin razón clara.

---

## Alcance del MVP

El MVP se centra en tres capacidades fundamentales. Todo lo que no esté en esta lista es fuera de alcance para la primera versión.

**Lo que incluye el MVP:**
- Rastreo GPS en tiempo real de unidades vía Driver App (navegador móvil del conductor).
- Estimación de tiempo de llegada a cada parada basada en posición GPS actual.
- Planificación de rutas de origen a destino con opciones de ruta y tiempo estimado de viaje.
- Evaluaciones verificadas del servicio por parte de pasajeros que completaron el viaje.
- Botón de seguridad con envío de ubicación a contacto de emergencia.
- Reporte anónimo de incidentes de seguridad.
- Autenticación de usuarios por email y número de teléfono.
- Notificaciones push para rutas favoritas con retrasos mayores a 10 minutos.
- Diseño responsive funcional en pantallas desde 320px hasta 2560px de ancho.
- Modo sin conexión para rutas previamente cargadas (datos cacheados localmente).

**Lo que no incluye el MVP:**
- Portal de operadores (Producto B): es el siguiente hito de desarrollo.
- Portal gubernamental (Producto C): es el tercer hito.
- Integración de pagos.
- Planificación multimodal con modos de transporte distintos al bus.
- Información de accesibilidad por unidad (requiere datos del operador que aún no existen).
- Soporte para múltiples idiomas (el MVP es solo en español).

---

## Funcionalidades por Módulo

### Módulo 1: Rastreo GPS y tiempo real

Este es el módulo más crítico del sistema. Su confiabilidad define la percepción de calidad del producto completo.

El Driver App solicita permiso de ubicación al cargar. Una vez concedido, transmite las coordenadas GPS del dispositivo al servidor cada 10 segundos, junto con el identificador de la unidad, el identificador de la ruta, y un timestamp. La transmisión continúa mientras la app está abierta en el navegador, incluyendo cuando el dispositivo está bloqueado. Si se pierde la conexión, las actualizaciones se encolan localmente y se envían cuando la conexión se restaura.

El Passenger App muestra las unidades en mapa con actualización en tiempo real. Cuando la última actualización de posición tiene más de 30 segundos de antigüedad, la interfaz indica visualmente que el dato puede estar desactualizado. El sistema no muestra estimaciones de llegada basadas en datos de posición con más de 60 segundos de antigüedad.

### Módulo 2: Planificación de rutas

El usuario ingresa origen y destino. El sistema calcula al menos dos opciones de ruta con tiempo estimado de viaje y número de transbordos. Cuando hay datos de posición en tiempo real disponibles, estos se incorporan al cálculo de tiempos. El cálculo debe completarse en menos de 3 segundos para distancias de hasta 50 kilómetros.

El resultado se muestra en mapa con todas las paradas marcadas, y en formato de lista con instrucciones paso a paso. La ruta recomendada se presenta primero, con las alternativas disponibles colapsadas pero accesibles.

### Módulo 3: Evaluaciones verificadas

El sistema solo acepta evaluaciones de usuarios que hayan estado en la ruta correspondiente durante el momento del viaje. La verificación se hace cruzando la posición GPS del usuario con la posición de la unidad en el mismo tramo horario. Este criterio es no negociable: mostrar evaluaciones no verificadas destruye la credibilidad del sistema.

Cuando un usuario completa un viaje verificable, la app presenta la solicitud de evaluación dentro de los 10 minutos siguientes a la llegada estimada al destino. La evaluación recoge tres dimensiones en escala de 1 a 5: puntualidad, limpieza, y comportamiento del conductor. Las calificaciones agregadas solo se muestran públicamente cuando la ruta acumula al menos 5 evaluaciones verificadas.

### Módulo 4: Seguridad

El botón de seguridad es accesible desde la pantalla principal con un solo toque, sin necesidad de navegar a ningún submenú. Al activarlo, el sistema envía la ubicación GPS actual y un mensaje predefinido a todos los contactos de emergencia configurados por el usuario.

El reporte de incidentes es completamente anónimo. El usuario selecciona la categoría del incidente (acoso, accidente, comportamiento peligroso del conductor, otra) y puede añadir una descripción de texto libre. El reporte queda asociado a la ruta y la unidad, no al usuario. El sistema no almacena ningún dato que permita identificar al reportante.

### Módulo 5: Autenticación y cuenta

El sistema admite registro e inicio de sesión por email y por número de teléfono. Las contraseñas deben tener mínimo 8 caracteres con al menos una letra y un número. Tras 5 intentos fallidos consecutivos, la cuenta queda bloqueada durante 15 minutos. La recuperación de contraseña se hace por email o SMS.

La sesión se mantiene activa durante 30 días a menos que el usuario cierre sesión explícitamente. Los tokens de sesión se almacenan en cookies httpOnly para prevenir acceso desde JavaScript.

### Módulo 6: Notificaciones y rutas favoritas

El usuario puede marcar cualquier ruta como favorita. El sistema envía notificaciones push cuando una ruta favorita tiene un retraso superior a 10 minutos, o cuando hay un cambio de horario. Las notificaciones respetan la configuración de "No molestar" del dispositivo y pueden desactivarse por tipo desde la configuración de la app.

---

## Flujos de Usuario Principales

### Flujo 1: Primera visita del pasajero

1. El usuario abre la URL de Rumbo en su navegador.
2. La pantalla de bienvenida muestra el mapa de la ciudad con las rutas activas.
3. Si hay rutas con unidades en tiempo real visibles, se muestran en movimiento en el mapa sin necesidad de autenticación.
4. El usuario puede buscar una ruta o explorar el mapa sin crear una cuenta.
5. Para guardar rutas favoritas, recibir notificaciones, o dejar evaluaciones, el sistema solicita registro.
6. El registro por número de teléfono se completa con un código SMS de 6 dígitos.

### Flujo 2: Planificación de un viaje

1. El usuario toca el campo de búsqueda en la pantalla principal.
2. Escribe su origen o lo confirma usando su ubicación actual.
3. Escribe su destino. El autocompletado muestra sugerencias en menos de 500 milisegundos.
4. El sistema muestra las opciones de ruta en formato de tarjeta: duración total, número de buses, próxima salida.
5. El usuario selecciona una opción y ve el detalle paso a paso en el mapa.
6. Si tiene la ruta activa en su lista de favoritos, recibe notificación si el primer bus de la secuencia se retrasa.

### Flujo 3: El conductor inicia su turno

1. El conductor abre la URL del Driver App en su celular.
2. Inicia sesión con sus credenciales.
3. Selecciona su número de unidad y su ruta del día.
4. Toca "Iniciar tracking". El navegador solicita permiso de ubicación.
5. La pantalla muestra un indicador visual verde de que la transmisión está activa y la ruta seleccionada.
6. El dispositivo no entra en reposo mientras el tracking está activo.
7. Al terminar el turno, el conductor toca "Detener tracking".

### Flujo 4: Reporte de incidente de seguridad

1. Desde cualquier pantalla, el usuario accede al botón de reporte de incidente.
2. Selecciona la categoría del incidente.
3. Opcionalmente añade descripción de texto.
4. El sistema confirma la ruta y la unidad actualmente en uso, o solicita que el usuario las ingrese manualmente si no está en un viaje activo.
5. El reporte se envía. El sistema confirma la recepción con un mensaje simple, sin datos personales del reportante.

---

## Requisitos No Funcionales

### Rendimiento

- La app debe cargar el contenido inicial en menos de 3 segundos en una conexión 3G de 3 Mbps.
- Las sugerencias de autocompletado en búsqueda de rutas deben aparecer en menos de 500 milisegundos.
- El cálculo de rutas debe completarse en menos de 3 segundos para distancias de hasta 50 kilómetros.
- El backend debe procesar al menos 1,000 actualizaciones de posición GPS por segundo.
- La latencia p95 de las respuestas de la API debe ser inferior a 500 milisegundos.
- El sistema debe soportar al menos 10,000 usuarios concurrentes.

### Disponibilidad

- Disponibilidad mínima del 99% durante el horario de operación del transporte público (6:00 AM a 10:00 PM, hora local).
- Las actualizaciones de software deben desplegarse sin tiempo de inactividad perceptible para el usuario (zero-downtime deployments).

### Seguridad

- Todos los datos personales almacenados en reposo deben estar cifrados con AES-256.
- Todas las comunicaciones entre cliente y servidor deben usar TLS 1.3 o superior.
- El usuario puede exportar todos sus datos personales en formato JSON desde la configuración de su cuenta.
- El usuario puede solicitar la eliminación de su cuenta y sus datos. La eliminación debe completarse dentro de los 30 días siguientes a la solicitud.
- El acceso a datos de ubicación requiere consentimiento explícito del usuario, solicitado en el momento en que es necesario para la funcionalidad, no al cargar la app.

### Privacidad de datos de conductores

Los datos de posición transmitidos por el Driver App se asocian a la unidad y la ruta, no al conductor como individuo. Si un conductor cambia de turno o de unidad, no debe ser posible reconstruir su trayectoria personal a partir de los datos almacenados.

### Compatibilidad

- La app debe funcionar correctamente en Chrome 90+, Firefox 88+, Safari 14+, y Samsung Internet 14+ (cubre el 95%+ del mercado de smartphones en Costa Rica).
- El diseño debe adaptarse a pantallas desde 320px hasta 2560px de ancho.
- Los elementos interactivos en móvil deben tener un área de toque mínima de 44x44 píxeles.

---

## Fuera de Alcance

Los siguientes elementos no forman parte del MVP y no deben diseñarse ni desarrollarse en esta fase:

- Plataforma de gestión para operadores de flota (Producto B).
- Portal gubernamental de análisis y fiscalización (Producto C).
- Integración con sistemas de pago para tarifas de transporte.
- Planificación de rutas multimodal con metro, bicicleta compartida u otros modos.
- Información de accesibilidad por unidad (rampa, piso bajo).
- Soporte para idiomas distintos al español.
- Aplicaciones nativas para iOS o Android (el MVP es web únicamente).
- Panel de administración interno para el equipo de Rumbo (se gestiona directamente en base de datos en esta fase).

---

## Criterios de Aceptación

Los siguientes criterios se extraen directamente del documento de requisitos y definen las condiciones mínimas para que cada funcionalidad se considere completada.

### GPS y tiempo real

- El Driver App transmite la posición del dispositivo al servidor cada 10 segundos con timestamp e identificador de unidad.
- El Passenger App muestra la posición de las unidades con precisión dentro de 50 metros.
- Cuando una actualización de posición tiene más de 30 segundos de antigüedad, la interfaz lo indica visualmente.
- La transmisión continúa mientras la app está abierta, incluyendo con la pantalla bloqueada.
- Las actualizaciones fallidas por falta de conexión se encolan y transmiten al restaurarse la conexión.

### Planificación de rutas

- El sistema calcula al menos 2 opciones de ruta para cualquier par origen-destino dentro de la red cubierta.
- Cada opción muestra tiempo total estimado y número de transbordos.
- Cuando hay datos en tiempo real disponibles, se incorporan al cálculo de tiempos.
- El cálculo se completa en menos de 3 segundos para distancias de hasta 50 kilómetros.
- La ruta se muestra en mapa con todas las paradas marcadas.

### Evaluaciones verificadas

- Solo se aceptan evaluaciones de usuarios cuya posición GPS coincide con la de la unidad evaluada durante el período del viaje.
- La solicitud de evaluación aparece dentro de los 10 minutos posteriores a la llegada estimada al destino.
- La evaluación cubre puntualidad, limpieza y comportamiento del conductor en escala de 1 a 5.
- Las calificaciones agregadas solo se muestran cuando la ruta acumula al menos 5 evaluaciones verificadas.

### Seguridad

- El botón de seguridad es accesible con un solo toque desde la pantalla principal.
- Al activarlo, envía la ubicación GPS a todos los contactos de emergencia configurados.
- El reporte de incidentes no almacena ningún dato que permita identificar al usuario reportante.
- El reporte incluye categoría del incidente, descripción opcional, y datos de la ruta y unidad.

### Autenticación

- El sistema admite registro e inicio de sesión por email y número de teléfono.
- Las contraseñas deben tener mínimo 8 caracteres con letras y números.
- Tras 5 intentos fallidos, la cuenta queda bloqueada durante 15 minutos.
- La sesión se mantiene activa durante 30 días salvo cierre de sesión explícito.

### Notificaciones

- El usuario puede marcar cualquier ruta como favorita.
- El sistema envía notificación push cuando una ruta favorita tiene retraso superior a 10 minutos.
- El sistema envía notificación cuando hay un cambio de horario en una ruta favorita, dentro de la primera hora del cambio.
- El usuario puede configurar sus preferencias de notificación por tipo.
