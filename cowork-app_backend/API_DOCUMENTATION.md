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

#### Reserva:
- `ReservaResponseDTO.java` - DTO para respuestas de reservas (con `LocalDateTime` y estado de reserva)
- `ReservaCreateDTO.java` - DTO para crear nuevas reservas (requiere `estadoReservaId`)
- `ReservaUpdateDTO.java` - DTO para actualizar reservas existentes

#### Recurso:
- `RecursoResponseDTO.java` - DTO para respuestas de recursos (incluye tipo y estado)
- `RecursoCreateDTO.java` - DTO para crear nuevos recursos
- `RecursoUpdateDTO.java` - DTO para actualizar recursos existentes

#### Usuario:
- `UsuarioResponseDTO.java` - DTO para respuestas de usuarios (sin password, incluye estado, tipo y plan)
- `UsuarioCreateDTO.java` - DTO para crear nuevos usuarios
- `UsuarioUpdateDTO.java` - DTO para actualizar usuarios existentes

### Repositories

#### Repositorios de Reserva:
- `ReservaRepository.java` - Repositorio con métodos de consulta personalizados
- `EstadoReservaRepository.java` - **[NUEVO]** Repositorio para estados de reserva

#### Repositorios de Recurso:
- `RecursoRepository.java` - Repositorio con métodos de búsqueda por tipo, estado, nombre y capacidad
- `EstadoRecursoRepository.java` - **[NUEVO]** Repositorio para estados de recurso
- `TipoRecursoRepository.java` - **[NUEVO]** Repositorio para tipos de recurso

#### Repositorios de Usuario:
- `UsuarioRepository.java` - Repositorio con métodos de búsqueda por RUT, email, estado, tipo, plan y nombre
- `EstadoUsuarioRepository.java` - **[NUEVO]** Repositorio para estados de usuario
- `TipoUsuarioRepository.java` - **[NUEVO]** Repositorio para tipos de usuario
- `PlanRepository.java` - **[NUEVO]** Repositorio para planes
- `HistorialEstadoUsuarioRepository.java` - **[NUEVO]** Repositorio para historial de cambios de estado

### Service Layer
- `ReservaService.java` - Lógica de negocio para el CRUD de reservas
- `RecursoService.java` - **[NUEVO]** Lógica de negocio para el CRUD de recursos
- `UsuarioService.java` - **[NUEVO]** Lógica de negocio para el CRUD de usuarios (incluye registro de historial)

### Controller Layer
- `ReservaController.java` - Controlador REST para reservas
- `RecursoController.java` - **[NUEVO]** Controlador REST para recursos
- `UsuarioController.java` - **[NUEVO]** Controlador REST para usuarios

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
- `2` - Cancelada
- `3` - Completada

### 9. **GET** `/api/v1/reserva/fecha/{fecha}`
Obtener reservas por fecha de la reserva (formato: yyyy-MM-dd)

**Busca reservas donde la fecha proporcionada coincida con la fecha de inicio o término de la reserva**

```json
Ejemplo: GET /api/v1/reserva/fecha/2025-11-10

Response: 200 OK
[
  {
    "id": 1,
    "inicioReserva": "2025-11-10T10:00:00",
    "terminoReserva": "2025-11-10T12:00:00",
    "fechaCreacion": "2025-11-09",
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
    "inicioReserva": "2025-11-10T14:00:00",
    "terminoReserva": "2025-11-10T16:00:00",
    "fechaCreacion": "2025-11-09",
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

**Nota:** Este endpoint busca reservas cuyo `inicioReserva` O `terminoReserva` coincidan con la fecha proporcionada.

---

## 🔌 Endpoints de Recurso

### Base URL: `/api/v1/recurso`

### 1. **GET** `/api/v1/recurso`
Obtener todos los recursos
```json
Response: 200 OK
[
  {
    "id": 1,
    "nombre": "Sala de Reuniones A",
    "precio": 50000,
    "capacidad": 10,
    "tipoRecursoId": 1,
    "tipoRecursoNombre": "Sala de Reuniones",
    "estadoRecursoId": 1,
    "estadoRecursoNombre": "Disponible"
  }
]
```

### 2. **GET** `/api/v1/recurso/{id}`
Obtener un recurso por ID
```json
Response: 200 OK
{
  "id": 1,
  "nombre": "Sala de Reuniones A",
  "precio": 50000,
  "capacidad": 10,
  "tipoRecursoId": 1,
  "tipoRecursoNombre": "Sala de Reuniones",
  "estadoRecursoId": 1,
  "estadoRecursoNombre": "Disponible"
}

Response: 404 NOT FOUND (recurso no existe)
```

### 3. **POST** `/api/v1/recurso`
Crear un nuevo recurso
```json
Request Body:
{
  "nombre": "Sala de Reuniones A",
  "precio": 50000,
  "capacidad": 10,
  "tipoRecursoId": 1,
  "estadoRecursoId": 1
}

Response: 201 CREATED (recurso creado exitosamente)
Response: 400 BAD REQUEST (datos inválidos)
```

**Validaciones:**
- El nombre es obligatorio y no puede estar vacío
- El precio debe ser >= 0
- La capacidad debe ser > 0
- TipoRecurso y EstadoRecurso deben existir

### 4. **PUT** `/api/v1/recurso/{id}`
Actualizar un recurso existente
```json
Request Body:
{
  "nombre": "Sala de Reuniones B",
  "precio": 60000,
  "capacidad": 15,
  "tipoRecursoId": 2,
  "estadoRecursoId": 2
}

Response: 200 OK (recurso actualizado)
Response: 404 NOT FOUND (recurso no existe)
```

**Nota:** Todos los campos son opcionales en el update.

### 5. **DELETE** `/api/v1/recurso/{id}`
**Eliminar un recurso (Borrado Lógico)**

⚠️ **IMPORTANTE:** Este endpoint NO elimina físicamente el recurso. En su lugar, cambia el estado a "Inactivo".

```json
Response: 200 OK
{
  "id": 1,
  "nombre": "Sala de Reuniones A",
  "precio": 50000,
  "capacidad": 10,
  "tipoRecursoId": 1,
  "tipoRecursoNombre": "Sala de Reuniones",
  "estadoRecursoId": 2,
  "estadoRecursoNombre": "Inactivo"
}

Response: 404 NOT FOUND (recurso no existe)
```

### 6. **GET** `/api/v1/recurso/tipo/{tipoRecursoId}`
Obtener recursos por tipo de recurso
```json
Ejemplo: GET /api/v1/recurso/tipo/1

Response: 200 OK
[
  {
    "id": 1,
    "nombre": "Sala de Reuniones A",
    "precio": 50000,
    "capacidad": 10,
    "tipoRecursoId": 1,
    "tipoRecursoNombre": "Sala de Reuniones",
    "estadoRecursoId": 1,
    "estadoRecursoNombre": "Disponible"
  }
]
```

### 7. **GET** `/api/v1/recurso/estado/{estadoRecursoId}`
Obtener recursos por estado
```json
Ejemplo: GET /api/v1/recurso/estado/1

Response: 200 OK (array de recursos con ese estado)
```

**Estados comunes:**
- `1` - Disponible
- `2` - Inactivo
- `3` - Mantenimiento
- `4` - Ocupado

### 8. **GET** `/api/v1/recurso/nombre/{nombre}`
Buscar recursos por nombre (búsqueda parcial, case-insensitive)
```json
Ejemplo: GET /api/v1/recurso/nombre/sala

Response: 200 OK
[
  {
    "id": 1,
    "nombre": "Sala de Reuniones A",
    "precio": 50000,
    "capacidad": 10,
    "tipoRecursoId": 1,
    "tipoRecursoNombre": "Sala de Reuniones",
    "estadoRecursoId": 1,
    "estadoRecursoNombre": "Disponible"
  },
  {
    "id": 2,
    "nombre": "Sala de Reuniones B",
    "precio": 60000,
    "capacidad": 15,
    "tipoRecursoId": 1,
    "tipoRecursoNombre": "Sala de Reuniones",
    "estadoRecursoId": 1,
    "estadoRecursoNombre": "Disponible"
  }
]
```

**Nota:** Búsqueda case-insensitive. "sala" encuentra "Sala de Reuniones A", "SALA B", etc.

### 9. **GET** `/api/v1/recurso/capacidad/{capacidad}`
Obtener recursos con capacidad mayor o igual a la especificada
```json
Ejemplo: GET /api/v1/recurso/capacidad/10

Response: 200 OK
[
  {
    "id": 1,
    "nombre": "Sala de Reuniones A",
    "precio": 50000,
    "capacidad": 10,
    "tipoRecursoId": 1,
    "tipoRecursoNombre": "Sala de Reuniones",
    "estadoRecursoId": 1,
    "estadoRecursoNombre": "Disponible"
  },
  {
    "id": 2,
    "nombre": "Sala de Reuniones B",
    "precio": 60000,
    "capacidad": 15,
    "tipoRecursoId": 1,
    "tipoRecursoNombre": "Sala de Reuniones",
    "estadoRecursoId": 1,
    "estadoRecursoNombre": "Disponible"
  }
]
```

**Nota:** Útil para encontrar recursos que acomoden un número mínimo de personas.

---

## 🔌 Endpoints de Usuario

### Base URL: `/api/v1/usuario`

### 1. **GET** `/api/v1/usuario`
Obtener todos los usuarios
```json
Response: 200 OK
[
  {
    "id": 1,
    "rut": "12345678-9",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "estadoUsuarioId": 1,
    "estadoUsuarioNombre": "Activo",
    "tipoUsuarioId": 1,
    "tipoUsuarioNombre": "Usuario Regular",
    "planId": 1,
    "planNombre": "Plan Básico"
  }
]
```

**Nota:** El password NO se retorna por seguridad.

### 2. **GET** `/api/v1/usuario/{id}`
Obtener un usuario por ID
```json
Response: 200 OK
{
  "id": 1,
  "rut": "12345678-9",
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "estadoUsuarioId": 1,
  "estadoUsuarioNombre": "Activo",
  "tipoUsuarioId": 1,
  "tipoUsuarioNombre": "Usuario Regular",
  "planId": 1,
  "planNombre": "Plan Básico"
}

Response: 404 NOT FOUND (usuario no existe)
```

### 3. **POST** `/api/v1/usuario`
Crear un nuevo usuario
```json
Request Body:
{
  "rut": "12345678-9",
  "nombre": "Juan Pérez",
  "password": "password123",
  "email": "juan@example.com",
  "estadoUsuarioId": 1,
  "tipoUsuarioId": 1,
  "planId": 1
}

Response: 201 CREATED (usuario creado exitosamente)
Response: 400 BAD REQUEST (datos inválidos)
```

**Validaciones:**
- RUT es obligatorio y único en el sistema
- Nombre es obligatorio
- Password es obligatorio
- Email es obligatorio, único y debe tener formato válido
- Email se convierte a minúsculas automáticamente
- EstadoUsuario y TipoUsuario deben existir
- Plan es opcional (puede ser null)

### 4. **PUT** `/api/v1/usuario/{id}`
Actualizar un usuario existente
```json
Request Body:
{
  "nombre": "Juan Pérez Actualizado",
  "password": "newpassword123",
  "email": "juan.nuevo@example.com",
  "estadoUsuarioId": 2,
  "tipoUsuarioId": 1,
  "planId": 2
}

Response: 200 OK (usuario actualizado)
Response: 404 NOT FOUND (usuario no existe)
```

**Notas:** 
- Todos los campos son opcionales en el update
- RUT NO se puede actualizar (es inmutable)
- Si se cambia el estado, se registra automáticamente en Historial_Estado_Usuario

### 5. **DELETE** `/api/v1/usuario/{id}`
**Eliminar un usuario (Borrado Lógico)**

⚠️ **IMPORTANTE:** Este endpoint NO elimina físicamente el usuario. En su lugar, cambia el estado a "Inactivo" y registra el cambio en el historial.

```json
Response: 200 OK
{
  "id": 1,
  "rut": "12345678-9",
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "estadoUsuarioId": 2,
  "estadoUsuarioNombre": "Inactivo",
  "tipoUsuarioId": 1,
  "tipoUsuarioNombre": "Usuario Regular",
  "planId": 1,
  "planNombre": "Plan Básico"
}

Response: 404 NOT FOUND (usuario no existe)
```

### 6. **GET** `/api/v1/usuario/rut/{rut}`
Obtener usuario por RUT (único)
```json
Ejemplo: GET /api/v1/usuario/rut/12345678-9

Response: 200 OK
{
  "id": 1,
  "rut": "12345678-9",
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "estadoUsuarioId": 1,
  "estadoUsuarioNombre": "Activo",
  "tipoUsuarioId": 1,
  "tipoUsuarioNombre": "Usuario Regular",
  "planId": 1,
  "planNombre": "Plan Básico"
}

Response: 404 NOT FOUND (usuario no encontrado)
```

### 7. **GET** `/api/v1/usuario/email/{email}`
Obtener usuario por email (único)
```json
Ejemplo: GET /api/v1/usuario/email/juan@example.com

Response: 200 OK (mismo formato que por RUT)
Response: 404 NOT FOUND (usuario no encontrado)
```

### 8. **GET** `/api/v1/usuario/estado/{estadoUsuarioId}`
Obtener usuarios por estado
```json
Ejemplo: GET /api/v1/usuario/estado/1

Response: 200 OK
[
  {
    "id": 1,
    "rut": "12345678-9",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "estadoUsuarioId": 1,
    "estadoUsuarioNombre": "Activo",
    "tipoUsuarioId": 1,
    "tipoUsuarioNombre": "Usuario Regular",
    "planId": 1,
    "planNombre": "Plan Básico"
  }
]

Response: 200 OK (lista vacía si no hay usuarios con ese estado)
[]
```

**Estados comunes:**
- `1` - Activo
- `2` - Inactivo
- `3` - Suspendido

### 9. **GET** `/api/v1/usuario/tipo/{tipoUsuarioId}`
Obtener usuarios por tipo de usuario
```json
Ejemplo: GET /api/v1/usuario/tipo/1

Response: 200 OK (array de usuarios con ese tipo)
```

**Tipos comunes:**
- `1` - Usuario Regular
- `2` - Administrador

### 10. **GET** `/api/v1/usuario/plan/{planId}`
Obtener usuarios por plan
```json
Ejemplo: GET /api/v1/usuario/plan/1

Response: 200 OK (array de usuarios con ese plan)
```

### 11. **GET** `/api/v1/usuario/nombre/{nombre}`
Buscar usuarios por nombre (búsqueda parcial, case-insensitive)
```json
Ejemplo: GET /api/v1/usuario/nombre/juan

Response: 200 OK
[
  {
    "id": 1,
    "rut": "12345678-9",
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "estadoUsuarioId": 1,
    "estadoUsuarioNombre": "Activo",
    "tipoUsuarioId": 1,
    "tipoUsuarioNombre": "Usuario Regular",
    "planId": 1,
    "planNombre": "Plan Básico"
  },
  {
    "id": 2,
    "rut": "98765432-1",
    "nombre": "Juan García",
    "email": "jgarcia@example.com",
    "estadoUsuarioId": 1,
    "estadoUsuarioNombre": "Activo",
    "tipoUsuarioId": 1,
    "tipoUsuarioNombre": "Usuario Regular",
    "planId": 2,
    "planNombre": "Plan Premium"
  }
]
```

**Nota:** Búsqueda case-insensitive. "juan" encuentra "Juan Pérez", "JUAN García", etc.

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

**Buscar reservas por fecha:**
```bash
curl -X GET http://localhost:8060/api/v1/reserva/fecha/2025-11-10
```

### Ejemplos para Recurso:

**Obtener todos los recursos:**
```bash
curl -X GET http://localhost:8060/api/v1/recurso
```

**Crear un recurso:**
```bash
curl -X POST http://localhost:8060/api/v1/recurso \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Sala de Reuniones A",
    "precio": 50000,
    "capacidad": 10,
    "tipoRecursoId": 1,
    "estadoRecursoId": 1
  }'
```

**Actualizar un recurso:**
```bash
curl -X PUT http://localhost:8060/api/v1/recurso/1 \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 60000,
    "capacidad": 15
  }'
```

**Eliminar recurso (borrado lógico):**
```bash
curl -X DELETE http://localhost:8060/api/v1/recurso/1
```

**Buscar recursos por tipo:**
```bash
curl -X GET http://localhost:8060/api/v1/recurso/tipo/1
```

**Buscar recursos por estado:**
```bash
curl -X GET http://localhost:8060/api/v1/recurso/estado/1
```

**Buscar recursos por nombre:**
```bash
curl -X GET http://localhost:8060/api/v1/recurso/nombre/sala
```

**Buscar recursos por capacidad mínima:**
```bash
curl -X GET http://localhost:8060/api/v1/recurso/capacidad/10
```

### Ejemplos para Usuario:

**Obtener todos los usuarios:**
```bash
curl -X GET http://localhost:8060/api/v1/usuario
```

**Crear un usuario:**
```bash
curl -X POST http://localhost:8060/api/v1/usuario \
  -H "Content-Type: application/json" \
  -d '{
    "rut": "12345678-9",
    "nombre": "Juan Pérez",
    "password": "password123",
    "email": "juan@example.com",
    "estadoUsuarioId": 1,
    "tipoUsuarioId": 1,
    "planId": 1
  }'
```

**Actualizar un usuario:**
```bash
curl -X PUT http://localhost:8060/api/v1/usuario/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez Actualizado",
    "estadoUsuarioId": 2
  }'
```

**Eliminar usuario (borrado lógico):**
```bash
curl -X DELETE http://localhost:8060/api/v1/usuario/1
```

**Buscar usuario por RUT:**
```bash
curl -X GET http://localhost:8060/api/v1/usuario/rut/12345678-9
```

**Buscar usuario por email:**
```bash
curl -X GET http://localhost:8060/api/v1/usuario/email/juan@example.com
```

**Buscar usuarios por estado:**
```bash
curl -X GET http://localhost:8060/api/v1/usuario/estado/1
```

**Buscar usuarios por tipo:**
```bash
curl -X GET http://localhost:8060/api/v1/usuario/tipo/1
```

**Buscar usuarios por plan:**
```bash
curl -X GET http://localhost:8060/api/v1/usuario/plan/1
```

**Buscar usuarios por nombre:**
```bash
curl -X GET http://localhost:8060/api/v1/usuario/nombre/juan
```

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
   - Debe existir un estado llamado "Cancelada" para el borrado lógico de reservas
   - Recomendado: "Activa", "Cancelada", "Completada"

3. **Estados de Recurso** en la base de datos:
   - Debe existir un estado llamado "Inactivo" para el borrado lógico de recursos
   - Recomendado: "Disponible", "Inactivo", "Mantenimiento", "Ocupado"

4. **Tipos de Recurso** en la base de datos:
   - Al menos 1 tipo de recurso (ej: "Sala de Reuniones", "Escritorio", "Sala de Conferencias")

5. **Estados de Usuario** en la base de datos:
   - Debe existir un estado llamado "Inactivo" para el borrado lógico de usuarios
   - Recomendado: "Activo", "Inactivo", "Suspendido"

6. **Tipos de Usuario** en la base de datos:
   - Al menos 1 tipo de usuario (ej: "Usuario Regular", "Administrador")

7. **Planes** en la base de datos:
   - Los planes son opcionales para los usuarios (pueden ser NULL)
   - Recomendado: "Plan Básico", "Plan Premium", "Plan Empresarial"

8. **Datos de prueba** cargados (usuarios, recursos, planes, etc.)

---
