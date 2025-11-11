# API REST - Sistema de Reservas Cowork-App

## ✅ Estado del Proyecto
El proyecto ha sido **compilado exitosamente** y está listo para usar.

**Última actualización:** 10 de Noviembre, 2025

## 📁 Estructura Completa del Proyecto

### Entidades (Entity Layer)

#### Entidades de Catálogo:
- `Plan.java` - Planes de suscripción (con campo `activo` para soft delete)
- `EstadoUsuario.java` - Estados de usuarios (Activo, Inactivo, Suspendido, etc.)
- `TipoUsuario.java` - Tipos de usuarios (Administrador, Usuario Regular, etc.)
- `TipoRecurso.java` - Tipos de recursos (Sala de Reuniones, Escritorio, etc.)
- `EstadoRecurso.java` - Estados de recursos (Disponible, Mantenimiento, etc.)
- `EstadoReserva.java` - **[NUEVO]** Estados de reservas (Activa, Cancelada, Completada)
- `EstadoFactura.java` - **[NUEVO]** Estados de facturas (Pagada, Pendiente, Vencida)

#### Entidades Principales:
- `Usuario.java` - Usuarios del sistema
- `Recurso.java` - Recursos disponibles para reservar
- `Reserva.java` - **Entidad principal de reservas (ACTUALIZADA)**
- `Factura.java` - **[NUEVO]** Facturas de los usuarios
- `HistorialEstadoUsuario.java` - **[NUEVO]** Auditoría de cambios de estado de usuarios

### DTOs (Data Transfer Objects)
- `ReservaResponseDTO.java` - DTO para respuestas de reservas (con `LocalDateTime` y estado de reserva)
- `ReservaCreateDTO.java` - DTO para crear nuevas reservas (requiere `estadoReservaId`)
- `ReservaUpdateDTO.java` - DTO para actualizar reservas existentes

### Repositories
- `ReservaRepository.java` - Repositorio con métodos de consulta personalizados
- `EstadoReservaRepository.java` - **[NUEVO]** Repositorio para estados de reserva
- `UsuarioRepository.java` - Repositorio para usuarios
- `RecursoRepository.java` - Repositorio para recursos

### Service Layer
- `ReservaService.java` - Lógica de negocio para el CRUD de reservas

### Controller Layer
- `ReservaController.java` - **Controlador REST principal**

---

## 🔌 Endpoints Disponibles

### Base URL: `/api/v1/reserva`

### 1. **GET** `/api/v1/reserva`
Obtener todas las reservas
```json
Response: 200 OK
[
  {
    "id": 1,
    "inicioReserva": "2025-11-10T10:00:00",
    "terminoReserva": "2025-11-10T12:00:00",
    "fechaCreacion": "2025-11-10",
    "valor": 50000,
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "recursoId": 1,
    "recursoNombre": "Sala de Reuniones A",
    "estadoReservaId": 1,
    "estadoReservaNombre": "Activa"
  }
]
```

### 2. **GET** `/api/v1/reserva/{id}`
Obtener una reserva por ID
```json
Response: 200 OK
{
  "id": 1,
  "inicioReserva": "2025-11-10T10:00:00",
  "terminoReserva": "2025-11-10T12:00:00",
  "fechaCreacion": "2025-11-10",
  "valor": 50000,
  "usuarioId": 1,
  "usuarioNombre": "Juan Pérez",
  "recursoId": 1,
  "recursoNombre": "Sala de Reuniones A",
  "estadoReservaId": 1,
  "estadoReservaNombre": "Activa"
}

Response: 404 NOT FOUND
{
  "timestamp": "2025-11-10T10:15:30",
  "status": 404,
  "error": "Not Found",
  "message": "Reserva no encontrada",
  "path": "/api/v1/reserva/999"
}
```

### 3. **POST** `/api/v1/reserva`
Crear una nueva reserva
```json
Request Body:
{
  "inicioReserva": "2025-11-10T10:00:00",
  "terminoReserva": "2025-11-10T12:00:00",
  "valor": 50000,
  "usuarioId": 1,
  "recursoId": 1,
  "estadoReservaId": 1
}

Response: 201 CREATED (reserva creada exitosamente)
Response: 400 BAD REQUEST (datos inválidos)
```

**Validaciones:**
- La hora de término debe ser posterior a la hora de inicio
- Usuario, recurso y estado de reserva deben existir
- Validaciones de horario definidas en el DDL (9:00-21:00, días hábiles, mínimo 1 hora)

### 4. **PUT** `/api/v1/reserva/{id}`
Actualizar una reserva existente
```json
Request Body:
{
  "inicioReserva": "2025-11-10T11:00:00",
  "terminoReserva": "2025-11-10T13:00:00",
  "valor": 60000,
  "estadoReservaId": 2,
  "usuarioId": 1,
  "recursoId": 2
}

Response: 200 OK (reserva actualizada)
Response: 404 NOT FOUND (reserva no existe)
```

**Nota:** Todos los campos son opcionales en el update.

### 5. **DELETE** `/api/v1/reserva/{id}`
**Eliminar una reserva (Borrado Lógico)**

⚠️ **IMPORTANTE:** Este endpoint NO elimina físicamente la reserva. En su lugar, cambia el estado a "Cancelada".

```json
Response: 200 OK
{
  "id": 1,
  "inicioReserva": "2025-11-10T10:00:00",
  "terminoReserva": "2025-11-10T12:00:00",
  "fechaCreacion": "2025-11-10",
  "valor": 50000,
  "usuarioId": 1,
  "usuarioNombre": "Juan Pérez",
  "recursoId": 1,
  "recursoNombre": "Sala de Reuniones A",
  "estadoReservaId": 3,
  "estadoReservaNombre": "Cancelada"
}

Response: 404 NOT FOUND (reserva no existe)
```

---

## 🔍 Endpoints de Búsqueda

### 6. **GET** `/api/v1/reserva/usuario/{usuarioId}`
Obtener todas las reservas de un usuario específico

```json
Response: 200 OK
[
  {
    "id": 1,
    "inicioReserva": "2025-11-10T10:00:00",
    "terminoReserva": "2025-11-10T12:00:00",
    "fechaCreacion": "2025-11-10",
    "valor": 50000,
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "recursoId": 1,
    "recursoNombre": "Sala de Reuniones A",
    "estadoReservaId": 1,
    "estadoReservaNombre": "Activa"
  },
  {
    "id": 2,
    "inicioReserva": "2025-11-11T14:00:00",
    "terminoReserva": "2025-11-11T16:00:00",
    "fechaCreacion": "2025-11-10",
    "valor": 60000,
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "recursoId": 2,
    "recursoNombre": "Sala de Reuniones B",
    "estadoReservaId": 1,
    "estadoReservaNombre": "Activa"
  }
]

Response: 200 OK (lista vacía si no hay reservas)
[]
```

### 7. **GET** `/api/v1/reserva/recurso/{recursoId}`
Obtener todas las reservas de un recurso específico

```json
Response: 200 OK
[
  {
    "id": 1,
    "inicioReserva": "2025-11-10T10:00:00",
    "terminoReserva": "2025-11-10T12:00:00",
    "fechaCreacion": "2025-11-10",
    "valor": 50000,
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "recursoId": 1,
    "recursoNombre": "Sala de Reuniones A",
    "estadoReservaId": 1,
    "estadoReservaNombre": "Activa"
  },
  {
    "id": 3,
    "inicioReserva": "2025-11-10T15:00:00",
    "terminoReserva": "2025-11-10T17:00:00",
    "fechaCreacion": "2025-11-10",
    "valor": 50000,
    "usuarioId": 2,
    "usuarioNombre": "María García",
    "recursoId": 1,
    "recursoNombre": "Sala de Reuniones A",
    "estadoReservaId": 1,
    "estadoReservaNombre": "Activa"
  }
]

Response: 200 OK (lista vacía si no hay reservas)
[]
```

### 8. **GET** `/api/v1/reserva/estado-reserva/{estadoReservaId}`
Obtener reservas por estado de reserva

```json
Ejemplo: GET /api/v1/reserva/estado-reserva/1

Response: 200 OK
[
  {
    "id": 1,
    "inicioReserva": "2025-11-10T10:00:00",
    "terminoReserva": "2025-11-10T12:00:00",
    "fechaCreacion": "2025-11-10",
    "valor": 50000,
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "recursoId": 1,
    "recursoNombre": "Sala de Reuniones A",
    "estadoReservaId": 1,
    "estadoReservaNombre": "Activa"
  },
  {
    "id": 2,
    "inicioReserva": "2025-11-11T14:00:00",
    "terminoReserva": "2025-11-11T16:00:00",
    "fechaCreacion": "2025-11-10",
    "valor": 60000,
    "usuarioId": 2,
    "usuarioNombre": "María García",
    "recursoId": 2,
    "recursoNombre": "Sala de Reuniones B",
    "estadoReservaId": 1,
    "estadoReservaNombre": "Activa"
  }
]

Response: 200 OK (lista vacía si no hay reservas con ese estado)
[]
```

**Estados comunes:**
- `1` - Activa
- `2` - Completada
- `3` - Cancelada

### 9. **GET** `/api/v1/reserva/fecha-creacion/{fecha}`
Obtener reservas por fecha de creación (formato: yyyy-MM-dd)

```json
Ejemplo: GET /api/v1/reserva/fecha-creacion/2025-11-10

Response: 200 OK
[
  {
    "id": 1,
    "inicioReserva": "2025-11-10T10:00:00",
    "terminoReserva": "2025-11-10T12:00:00",
    "fechaCreacion": "2025-11-10",
    "valor": 50000,
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "recursoId": 1,
    "recursoNombre": "Sala de Reuniones A",
    "estadoReservaId": 1,
    "estadoReservaNombre": "Activa"
  },
  {
    "id": 2,
    "inicioReserva": "2025-11-11T14:00:00",
    "terminoReserva": "2025-11-11T16:00:00",
    "fechaCreacion": "2025-11-10",
    "valor": 60000,
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "recursoId": 2,
    "recursoNombre": "Sala de Reuniones B",
    "estadoReservaId": 1,
    "estadoReservaNombre": "Activa"
  }
]

Response: 200 OK (lista vacía si no hay reservas en esa fecha)
[]
```

---

## 📊 Estructura de Datos para Frontend

### ReservaResponseDTO (Objeto de Respuesta)
```typescript
interface ReservaResponseDTO {
  id: number;                      // ID único de la reserva
  inicioReserva: string;           // Formato ISO 8601: "2025-11-10T10:00:00"
  terminoReserva: string;          // Formato ISO 8601: "2025-11-10T12:00:00"
  fechaCreacion: string;           // Formato ISO: "2025-11-10"
  valor: number;                   // Valor en pesos chilenos (ej: 50000)
  usuarioId: number;               // ID del usuario que reservó
  usuarioNombre: string;           // Nombre completo del usuario
  recursoId: number;               // ID del recurso reservado
  recursoNombre: string;           // Nombre del recurso
  estadoReservaId: number;         // ID del estado (1=Activa, 2=Completada, 3=Cancelada)
  estadoReservaNombre: string;     // Nombre del estado ("Activa", "Cancelada", etc.)
}
```

### ReservaCreateDTO (Crear Reserva)
```typescript
interface ReservaCreateDTO {
  inicioReserva: string;           // Formato ISO 8601: "2025-11-10T10:00:00"
  terminoReserva: string;          // Formato ISO 8601: "2025-11-10T12:00:00"
  valor: number;                   // Valor en pesos chilenos
  usuarioId: number;               // ID del usuario
  recursoId: number;               // ID del recurso
  estadoReservaId: number;         // ID del estado (típicamente 1 para "Activa")
}
```

### ReservaUpdateDTO (Actualizar Reserva)
```typescript
interface ReservaUpdateDTO {
  inicioReserva?: string;          // Opcional - Formato ISO 8601
  terminoReserva?: string;         // Opcional - Formato ISO 8601
  valor?: number;                  // Opcional
  estadoReservaId?: number;        // Opcional
  usuarioId?: number;              // Opcional
  recursoId?: number;              // Opcional
}
```

### Notas Importantes para Frontend:

1. **Fechas y Horas:**
   - Todas las fechas/horas se envían y reciben en formato ISO 8601
   - `inicioReserva` y `terminoReserva` son LocalDateTime: `"2025-11-10T10:00:00"`
   - `fechaCreacion` es LocalDate: `"2025-11-10"`

2. **Valores Numéricos:**
   - `valor` es un número entero (Long en Java) sin decimales
   - Representa pesos chilenos: `50000` = $50.000 CLP

3. **Estados de Reserva:**
   - Los estados se manejan mediante IDs numéricos
   - Se recomienda obtener el catálogo de estados al cargar la aplicación
   - Estados comunes: 1=Activa, 2=Completada, 3=Cancelada

4. **Respuestas de Lista:**
   - Todos los endpoints GET que retornan múltiples reservas devuelven un array
   - Si no hay resultados, se retorna un array vacío `[]`
   - Nunca retorna `null`

5. **Manejo de Errores:**
   - Código 200: Operación exitosa
   - Código 201: Recurso creado exitosamente
   - Código 404: Recurso no encontrado
   - Código 400: Datos inválidos
   - Código 500: Error del servidor

---

## 🚀 Cómo Ejecutar

1. **Asegúrate de que la base de datos esté configurada correctamente** en `application.properties`

2. **Ejecutar la aplicación:**
```bash
mvn spring-boot:run
```

O ejecutar el JAR empaquetado:
```bash
java -jar target/cowork-app_backend-0.0.1-SNAPSHOT.jar
```

3. **La API estará disponible en:**
```
http://localhost:8080/api/v1/reserva
```

---

## 🧪 Probar la API

### Con curl:

**Obtener todas las reservas:**
```bash
curl -X GET http://localhost:8060/api/v1/reserva
```

**Crear una reserva:**
```bash
curl -X POST http://localhost:8060/api/v1/reserva \
  -H "Content-Type: application/json" \
  -d '{
    "inicioReserva": "2025-11-10T10:00:00",
    "terminoReserva": "2025-11-10T12:00:00",
    "valor": 50000,
    "usuarioId": 1,
    "recursoId": 1,
    "estadoReservaId": 1
  }'
```

**Actualizar una reserva:**
```bash
curl -X PUT http://localhost:8060/api/v1/reserva/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estadoReservaId": 2,
    "valor": 60000
  }'
```

**Cancelar una reserva (borrado lógico):**
```bash
curl -X DELETE http://localhost:8060/api/v1/reserva/1
```

**Buscar reservas por usuario:**
```bash
curl -X GET http://localhost:8060/api/v1/reserva/usuario/1
```

**Buscar reservas por estado:**
```bash
curl -X GET http://localhost:8060/api/v1/reserva/estado-reserva/1
```

---

## 🧪 Probar la API

### Con curl:
1. **LocalDateTime en lugar de LocalTime + LocalDate separados**
   - `horaInicio` + `fechaReserva` → `inicioReserva` (LocalDateTime)
   - `horaTermino` → `terminoReserva` (LocalDateTime)

2. **Estado mediante tabla de catálogo**
   - `estado` (Boolean) → `estadoReserva` (ManyToOne con EstadoReserva)
   - Permite estados como: Activa, Cancelada, Completada, etc.

3. **Auditoría mejorada**
   - Nuevo campo `fechaCreacion` para rastrear cuándo se creó la reserva

4. **Renombrado de campos**
   - `valorReserva` → `valor`

5. **Borrado Lógico**
   - DELETE no elimina físicamente la reserva
   - Cambia el estado a "Cancelada" y retorna la reserva actualizada

### Nuevas Entidades:
- **EstadoReserva**: Gestión de estados de reservas mediante catálogo
- **Factura**: Sistema de facturación para usuarios
- **EstadoFactura**: Estados de facturas (Pagada, Pendiente, etc.)
- **HistorialEstadoUsuario**: Auditoría de cambios de estado de usuarios

### Cambios en Plan:
- Agregado campo `activo` para soft delete
- Removido campo `tiempoUsado`

---

## 📋 Notas Técnicas

1. **JPA/Hibernate**: Las entidades están mapeadas correctamente con el esquema `reservas`
2. **Lombok**: Se usa para generar getters, setters, constructores automáticamente
3. **Validaciones**: 
   - Hora de término > Hora de inicio
   - Referencias válidas a Usuario, Recurso y EstadoReserva
   - Constraints de base de datos: horario 9:00-21:00, días hábiles, mínimo 1 hora
4. **CORS**: Habilitado para todos los orígenes (`@CrossOrigin(origins = "*")`)
5. **Puerto**: La aplicación corre en el puerto `8060` (configurado en `application.properties`)

---

## ⚠️ Requisitos Previos

1. **Base de datos PostgreSQL** configurada con el esquema `reservas`
2. **Estados de Reserva** en la base de datos:
   - Debe existir un estado llamado "Cancelada" para el borrado lógico
   - Recomendado: "Activa", "Cancelada", "Completada"
3. **Datos de prueba** cargados (usuarios, recursos, planes, etc.)

---

¡El API REST del Sistema de Reservas está completo y listo para producción! 🎉

