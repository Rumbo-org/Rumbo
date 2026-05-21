# Requirements Document - Rumbo Platform

## Introduction

Rumbo es una aplicación web responsive de movilidad en transporte público para Costa Rica. La plataforma conecta pasajeros con información en tiempo real de rutas de autobuses, permitiendo planificación de viajes y evaluación del servicio.

El MVP se enfoca en la app para pasajeros con funcionalidades básicas de tracking GPS, planificación de rutas, y sistema de evaluaciones.

## Glossary

- **Rumbo_Platform**: El sistema completo de la aplicación web
- **Passenger_App**: Aplicación web responsive para pasajeros
- **GPS_Tracker**: Aplicación web accedida desde el celular del conductor que transmite ubicación en tiempo real
- **Driver_App**: Interfaz web para conductores que transmite ubicación GPS del dispositivo móvil
- **Route**: Ruta de transporte público con paradas definidas
- **Unit**: Vehículo de transporte (bus)
- **Trip**: Instancia específica de una ruta en un momento dado
- **Stop**: Parada de transporte público
- **Verified_Rating**: Evaluación confirmada de un pasajero que completó un viaje
- **Real_Time_Arrival**: Predicción de llegada basada en ubicación GPS actual

## Requirements

### Requirement 1: GPS Tracking and Real-Time Location

**User Story:** Como pasajero, quiero ver la ubicación en tiempo real de las unidades de transporte, para poder planificar mi tiempo de espera y llegada.

#### Acceptance Criteria

1. WHEN a conductor accesses the Driver_App from their mobile browser, THE Rumbo_Platform SHALL request permission to access the device's GPS location
2. WHEN GPS permission is granted, THE Driver_App SHALL transmit the device's GPS location to the server every 10 seconds with timestamp and Unit identifier
3. WHEN a Unit location is updated, THE Rumbo_Platform SHALL calculate Real_Time_Arrival estimates for all upcoming Stops on the Route
4. THE Passenger_App SHALL display Unit locations on a map with accuracy within 50 meters
5. WHEN location data is older than 30 seconds, THE Passenger_App SHALL indicate the data as stale
6. THE Driver_App SHALL continue transmitting location data while running in the background on the mobile device
7. WHEN the Driver_App loses internet connection, THE Driver_App SHALL queue location updates and transmit them when connection is restored

### Requirement 2: Driver Interface for GPS Tracking

**User Story:** Como conductor, quiero usar mi celular para transmitir mi ubicación, para que los pasajeros puedan ver dónde está mi bus en tiempo real.

#### Acceptance Criteria

1. THE Driver_App SHALL be accessible via web browser on mobile devices without requiring app installation
2. WHEN a conductor logs in, THE Driver_App SHALL display a simple interface showing tracking status (active/inactive)
3. THE Driver_App SHALL allow the conductor to select their Unit number and Route before starting tracking
4. THE Driver_App SHALL display a "Start Tracking" and "Stop Tracking" button to control GPS transmission
5. WHEN tracking is active, THE Driver_App SHALL show a visual indicator that location is being transmitted
6. THE Driver_App SHALL display battery level warning when device battery is below 20%
7. THE Driver_App SHALL prevent the device screen from sleeping while tracking is active

### Requirement 3: Route Planning

**User Story:** Como pasajero, quiero planificar rutas de transporte, para llegar a mi destino de la manera más eficiente.

#### Acceptance Criteria

1. WHEN a user requests a route from origin to destination, THE Passenger_App SHALL calculate at least 2 route options
2. FOR ALL calculated routes, THE Passenger_App SHALL display estimated travel time and number of transfers
3. WHEN Real_Time_Arrival data is available, THE Passenger_App SHALL use it to refine route timing estimates
4. THE Passenger_App SHALL calculate routes within 3 seconds for distances up to 50 kilometers
5. THE Passenger_App SHALL display the route path on a map with all Stops marked

### Requirement 4: Verified Ratings and Reviews

**User Story:** Como pasajero, quiero evaluar el servicio de transporte de manera verificada, para ayudar a otros usuarios y mejorar la calidad del servicio.

#### Acceptance Criteria

1. WHEN a user completes a Trip, THE Passenger_App SHALL prompt for a rating within 10 minutes of trip completion
2. THE Passenger_App SHALL only allow Verified_Rating submissions from users who were on the Route during the Trip time
3. THE Passenger_App SHALL collect ratings for cleanliness, punctuality, and driver behavior on a 1-5 scale
4. WHEN a rating is submitted, THE Rumbo_Platform SHALL associate it with the specific Unit and Trip
5. THE Passenger_App SHALL display aggregate ratings with a minimum of 5 Verified_Rating entries to ensure statistical validity

### Requirement 5: Safety Features

**User Story:** Como pasajero, quiero sentirme seguro durante mis viajes en transporte público, para poder usar el servicio con confianza.

#### Acceptance Criteria

1. THE Passenger_App SHALL provide a safety button accessible within 1 tap from the main screen
2. WHEN the safety button is activated, THE Passenger_App SHALL send an alert with GPS location to emergency contacts
3. THE Passenger_App SHALL allow anonymous reporting of safety incidents with Unit and Route information
4. THE Passenger_App SHALL allow users to share their real-time trip progress with trusted contacts
5. THE Passenger_App SHALL display a list of emergency contacts configured by the user

### Requirement 6: User Authentication

**User Story:** Como usuario, quiero acceder de manera segura a mi cuenta, para proteger mi información personal.

#### Acceptance Criteria

1. THE Rumbo_Platform SHALL support email and phone number authentication
2. THE Rumbo_Platform SHALL require passwords with minimum 8 characters including letters and numbers
3. WHEN a user fails login 5 times, THE Rumbo_Platform SHALL lock the account for 15 minutes
4. THE Rumbo_Platform SHALL allow password reset via email or SMS verification
5. THE Rumbo_Platform SHALL maintain user session for 30 days unless user logs out

### Requirement 7: Responsive Web Design

**User Story:** Como usuario en cualquier dispositivo, quiero acceder a la plataforma desde móvil o computadora, para usar Rumbo en cualquier contexto.

#### Acceptance Criteria

1. THE Passenger_App SHALL render correctly on screen sizes from 320px to 2560px width
2. THE Passenger_App SHALL provide touch-optimized controls on mobile devices with minimum 44x44 pixel tap targets
3. THE Passenger_App SHALL adapt layout for mobile, tablet and desktop screens
4. THE Rumbo_Platform SHALL load initial content within 3 seconds on 3G mobile connections
5. THE Passenger_App SHALL display a mobile-optimized map interface on devices smaller than 768px

### Requirement 8: Route Search and Discovery

**User Story:** Como pasajero, quiero buscar rutas por nombre o número, para encontrar rápidamente la información que necesito.

#### Acceptance Criteria

1. THE Passenger_App SHALL provide a search bar on the main screen
2. WHEN a user types in the search bar, THE Passenger_App SHALL show autocomplete suggestions within 500ms
3. THE Passenger_App SHALL allow search by route number, route name, or destination
4. THE Passenger_App SHALL display search results with route number, name, and current status
5. THE Passenger_App SHALL allow users to save favorite routes for quick access

### Requirement 9: Notification System

**User Story:** Como pasajero, quiero recibir notificaciones sobre mis rutas favoritas, para estar informado de cambios y retrasos.

#### Acceptance Criteria

1. THE Passenger_App SHALL allow users to mark Routes as favorites
2. WHEN a favorite Route has a delay exceeding 10 minutes, THE Passenger_App SHALL send a push notification
3. WHEN a favorite Route has a schedule change, THE Passenger_App SHALL send a notification within 1 hour of the change
4. THE Passenger_App SHALL allow users to configure notification preferences by type
5. THE Passenger_App SHALL respect device "Do Not Disturb" settings

### Requirement 10: Data Privacy

**User Story:** Como usuario, quiero que mis datos personales estén protegidos, para mantener mi privacidad.

#### Acceptance Criteria

1. THE Rumbo_Platform SHALL encrypt all personal data at rest using AES-256 encryption
2. THE Rumbo_Platform SHALL encrypt all data in transit using TLS 1.3 or higher
3. THE Rumbo_Platform SHALL allow users to export their personal data in JSON format
4. THE Rumbo_Platform SHALL allow users to request account deletion with data removal within 30 days
5. THE Rumbo_Platform SHALL obtain explicit consent before collecting location data

### Requirement 11: Performance and Scalability

**User Story:** Como administrador de sistema, quiero que la plataforma funcione eficientemente, para soportar múltiples usuarios simultáneos.

#### Acceptance Criteria

1. THE Rumbo_Platform SHALL support at least 10,000 concurrent users
2. THE Rumbo_Platform SHALL process at least 1,000 GPS location updates per second
3. THE Rumbo_Platform SHALL maintain 99% uptime during business hours (6 AM - 10 PM local time)
4. THE Rumbo_Platform SHALL respond to API requests with p95 latency under 500ms
5. THE Passenger_App SHALL cache frequently accessed data to reduce server load
