# API REST - Sistema de Reservas Cowork-App v2.1.0

## ✅ Estado del Proyecto
El proyecto ha sido **compilado exitosamente** y está listo para usar.

**Última actualización:** 27 de Noviembre, 2025

---

## 🔒 Borrado Lógico y Filtrado de Entidades Eliminadas

### ⚠️ **IMPORTANTE: Todas las entidades usan borrado lógico**

El sistema implementa **borrado lógico** para las tres entidades principales (Reserva, Recurso y Usuario) y **filtrado de inactivos/eliminados** para las entidades de catálogo. Esto significa que:

1. **DELETE no elimina físicamente**: Cuando se llama a `DELETE /api/v1/{entidad}/{id}`, el registro NO se borra de la base de datos, sino que se cambia su estado a "Eliminado".

2. **Filtrado automático en consultas GET**: Todos los endpoints de consulta (GET) **excluyen automáticamente** las entidades con estado "Eliminado" o inactivas:
   
   **Entidades Principales:**
   - `GET /api/v1/reserva` - No retorna reservas con estado "Eliminado"
   - `GET /api/v1/reserva/{id}` - Retorna 404 si la reserva está "Eliminada"
   - `GET /api/v1/recurso` - No retorna recursos con estado "Eliminado"
   - `GET /api/v1/recurso/{id}` - Retorna 404 si el recurso está "Eliminado"
   - `GET /api/v1/usuario` - No retorna usuarios con estado "Eliminado"
   - `GET /api/v1/usuario/{id}` - Retorna 404 si el usuario está "Eliminado"
   - **Y todos los demás endpoints de búsqueda** también aplican este filtro
   
   **Catálogos:**
   - `GET /api/v1/tipo-usuario` - No retorna tipos con nombre "Eliminado"
   - `GET /api/v1/estado-usuario` - No retorna estados con nombre "Eliminado"
   - `GET /api/v1/plan` - No retorna planes con activo = false
   - `GET /api/v1/tipo-recurso` - No retorna tipos con nombre "Eliminado"
   - `GET /api/v1/estado-recurso` - No retorna estados con nombre "Eliminado"
   - `GET /api/v1/estado-reserva` - No retorna estados con activo = false
   - `GET /api/v1/estado-factura` - No retorna estados con activo = false

3. **Estado "Eliminado" por entidad**:
   - **Reserva**: Estado "Eliminado" (campo `estado_reserva_id`)
   - **Recurso**: Estado "Eliminado" (campo `estado_recurso_id`)
   - **Usuario**: Estado "Eliminado" (campo `estado_usuario_id`)
   - **Catálogos**: Filtrado por campo `activo` (Boolean) o nombre != "Eliminado"

4. **Búsqueda por estado**: Si deseas ver las entidades eliminadas, puedes buscar explícitamente por el estado "Eliminado" usando:
   - `GET /api/v1/reserva/estado-reserva/{idEstadoEliminado}`
   - `GET /api/v1/recurso/estado/{idEstadoEliminado}`
   - `GET /api/v1/usuario/estado/{idEstadoEliminado}`

5. **Historial de cambios de estado (solo Usuario)**: Cuando se cambia el estado de un usuario (incluyendo eliminación), se registra automáticamente en la tabla `Historial_Estado_Usuario`.

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

⚠️ **IMPORTANTE:** Este endpoint NO elimina físicamente la reserva. En su lugar, cambia el estado a "Eliminado".

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
  "estadoReservaNombre": "Eliminado"
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

⚠️ **IMPORTANTE:** Este endpoint NO elimina físicamente el recurso. En su lugar, cambia el estado a "Eliminado".

```json
Response: 200 OK
{
  "id": 1,
  "nombre": "Sala de Reuniones A",
  "precio": 50000,
  "capacidad": 10,
  "tipoRecursoId": 1,
  "tipoRecursoNombre": "Sala de Reuniones",
  "estadoRecursoId": 3,
  "estadoRecursoNombre": "Eliminado"
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

⚠️ **IMPORTANTE:** Este endpoint NO elimina físicamente el usuario. En su lugar, cambia el estado a "Eliminado" y registra el cambio en el historial.

```json
Response: 200 OK
{
  "id": 1,
  "rut": "12345678-9",
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "estadoUsuarioId": 3,
  "estadoUsuarioNombre": "Eliminado",
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

### 12. **POST** `/api/v1/usuario/login`
Login de usuario con email y password

**Descripción:** Valida las credenciales de un usuario y retorna su información si son correctas.

```json
Request Body:
{
  "email": "juan@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "tipoUsuarioId": 1,
  "tipoUsuarioNombre": "Usuario Regular",
  "planId": 1,
  "planNombre": "Plan Básico"
}

Response: 401 UNAUTHORIZED (credenciales incorrectas o usuario inactivo)
```

**Validaciones:**
- Email y password son obligatorios
- El usuario debe existir en la base de datos
- El password debe coincidir con el almacenado
- El usuario debe estar en estado "Activo"
- El usuario no debe estar "Eliminado"

**Nota de seguridad:** 
- El password NO se retorna en la respuesta
- En producción, los passwords deben estar hasheados (actualmente se comparan en texto plano)

### 13. **GET** `/api/v1/usuario/{id}/horas-restantes`
Obtener horas restantes del plan del usuario en el mes actual

**Descripción:** Calcula cuántas horas le quedan disponibles al usuario de su plan en el mes actual, considerando las reservas activas y completadas.

```json
Ejemplo: GET /api/v1/usuario/4/horas-restantes

Response: 200 OK
{
  "nombreUsuario": "Juan Pérez",
  "emailUsuario": "juan@example.com",
  "nombrePlan": "Plan Básico",
  "horasIncluidas": 50,
  "horasUsadas": 12,
  "horasRestantes": 38
}

Response: 404 NOT FOUND (usuario no encontrado)
```

**Funcionamiento:**
- Solo cuenta reservas con estado **Activa (1)** o **Completada (3)**
- Calcula automáticamente el mes y año actual usando `CURRENT_DATE`
- Suma las horas de diferencia entre `termino_reserva` e `inicio_reserva`
- Resta las horas usadas del total de horas incluidas en el plan

**Validaciones:**
- El usuario debe existir en la base de datos
- El usuario debe tener un plan asociado

**⚠️ Nota importante sobre usuarios sin plan:**
Los usuarios **sin plan** pueden obtener **horas restantes negativas**, ya que no tienen horas incluidas en su plan (`horasIncluidas` será `null` o `0`). Esto **NO es un error**, es el comportamiento esperado para este tipo de cliente. La API retornará valores negativos indicando las horas consumidas sin plan contratado.

Ejemplo de usuario sin plan:
```json
{
  "nombreUsuario": "Usuario Sin Plan",
  "emailUsuario": "sinplan@example.com",
  "nombrePlan": null,
  "horasIncluidas": 0,
  "horasUsadas": 5,
  "horasRestantes": -5
}
```

---

## 🔌 Endpoints de Plan

### Base URL: `/api/v1/plan`

### 1. **GET** `/api/v1/plan`
Obtener todos los planes activos
```json
Response: 200 OK
[
  {
    "id": 1,
    "nombre": "Plan Básico",
    "precioMensual": 50000,
    "tiempoIncluido": 20,
    "activo": true
  },
  {
    "id": 2,
    "nombre": "Plan Premium",
    "precioMensual": 100000,
    "tiempoIncluido": 50,
    "activo": true
  }
]
```

### 2. **GET** `/api/v1/plan/{id}`
Obtener un plan por ID
```json
Response: 200 OK
{
  "id": 1,
  "nombre": "Plan Básico",
  "precioMensual": 50000,
  "tiempoIncluido": 20,
  "activo": true
}

Response: 404 NOT FOUND (plan no existe o está inactivo)
```

### 3. **POST** `/api/v1/plan`
Crear un nuevo plan
```json
Request Body:
{
  "nombre": "Plan Empresarial",
  "precioMensual": 200000,
  "tiempoIncluido": 100,
  "activo": true
}

Response: 201 CREATED (plan creado exitosamente)
Response: 400 BAD REQUEST (datos inválidos)
```

**Validaciones:**
- El nombre es obligatorio y no puede estar vacío
- El nombre debe ser único (no puede existir otro plan con el mismo nombre)
- El precio mensual debe ser >= 0
- El tiempo incluido debe ser >= 0
- Si no se proporciona `activo`, se establece en `true` por defecto

### 4. **PUT** `/api/v1/plan/{id}`
Actualizar un plan existente
```json
Request Body:
{
  "nombre": "Plan Básico Plus",
  "precioMensual": 60000,
  "tiempoIncluido": 25,
  "activo": true
}

Response: 200 OK (plan actualizado)
Response: 404 NOT FOUND (plan no existe)
Response: 400 BAD REQUEST (datos inválidos)
```

**Nota:** Todos los campos son opcionales en el update.

### 5. **DELETE** `/api/v1/plan/{id}`
**Eliminar un plan (Borrado Lógico)**

⚠️ **IMPORTANTE:** Este endpoint NO elimina físicamente el plan. En su lugar, cambia el campo `activo` a `false`.

```json
Response: 200 OK
{
  "id": 1,
  "nombre": "Plan Básico",
  "precioMensual": 50000,
  "tiempoIncluido": 20,
  "activo": false
}

Response: 404 NOT FOUND (plan no existe)
```

### 6. **GET** `/api/v1/plan/nombre/{nombre}`
Obtener plan por nombre
```json
Ejemplo: GET /api/v1/plan/nombre/Plan Básico

Response: 200 OK
{
  "id": 1,
  "nombre": "Plan Básico",
  "precioMensual": 50000,
  "tiempoIncluido": 20,
  "activo": true
}

Response: 404 NOT FOUND (plan no existe o está inactivo)
```

---

## 🔌 Endpoints de Factura

### Base URL: `/api/v1/factura`

### 1. **GET** `/api/v1/factura`
Obtener todas las facturas del sistema
```json
Response: 200 OK
[
  {
    "id": 1,
    "numeroFactura": 1001,
    "fechaEmision": "2025-11-27",
    "total": 50000,
    "descripcion": "Factura mensual noviembre",
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "estadoFacturaId": 1,
    "estadoFacturaNombre": "Pagada"
  }
]
```

### 2. **GET** `/api/v1/factura/mes/{mes}/anio/{anio}`
Obtener todas las facturas por mes y año
```json
Ejemplo: GET /api/v1/factura/mes/11/anio/2025

Response: 200 OK
[
  {
    "id": 1,
    "numeroFactura": 1001,
    "fechaEmision": "2025-11-27",
    "total": 50000,
    "descripcion": "Factura mensual noviembre",
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "estadoFacturaId": 1,
    "estadoFacturaNombre": "Pagada"
  }
]

Response: 400 BAD REQUEST (mes o año inválidos)
```

**Validaciones:**
- Mes debe estar entre 1 y 12
- Año debe estar entre 2000 y 2100

### 3. **GET** `/api/v1/factura/usuario/{usuarioId}`
Obtener todas las facturas de un usuario específico
```json
Ejemplo: GET /api/v1/factura/usuario/1

Response: 200 OK (array de facturas del usuario)
```

### 4. **GET** `/api/v1/factura/usuario/{usuarioId}/mes/{mes}/anio/{anio}`
Obtener todas las facturas de un usuario en un mes específico
```json
Ejemplo: GET /api/v1/factura/usuario/1/mes/11/anio/2025

Response: 200 OK (array de facturas del usuario en el mes especificado)
Response: 400 BAD REQUEST (mes o año inválidos)
```

**Validaciones:**
- Mes debe estar entre 1 y 12
- Año debe estar entre 2000 y 2100

### 5. **GET** `/api/v1/factura/numero/{numeroFactura}`
Obtener factura por número de factura (único)
```json
Ejemplo: GET /api/v1/factura/numero/1001

Response: 200 OK
{
  "id": 1,
  "numeroFactura": 1001,
  "fechaEmision": "2025-11-27",
  "total": 50000,
  "descripcion": "Factura mensual noviembre",
  "usuarioId": 1,
  "usuarioNombre": "Juan Pérez",
  "estadoFacturaId": 1,
  "estadoFacturaNombre": "Pagada"
}

Response: 404 NOT FOUND (factura no encontrada)
```

### 6. **PATCH** `/api/v1/factura/{id}/estado`
Actualizar el estado de una factura
```json
Request Body:
{
  "estadoFacturaId": 2
}

Response: 200 OK
{
  "id": 1,
  "numeroFactura": 1001,
  "fechaEmision": "2025-11-27",
  "total": 50000,
  "descripcion": "Factura mensual noviembre",
  "usuarioId": 1,
  "usuarioNombre": "Juan Pérez",
  "estadoFacturaId": 2,
  "estadoFacturaNombre": "Pendiente"
}

Response: 404 NOT FOUND (factura o estado no encontrado)
```

**Validaciones:**
- La factura debe existir
- El estadoFacturaId es obligatorio
- El estado de factura debe existir en el sistema

**Nota:** Se usa PATCH en lugar de PUT porque solo se actualiza el estado, no toda la factura.

---

## 🔌 Endpoints de Catálogos

### Base URL: `/api/v1/[catalogo]`

Los siguientes endpoints están disponibles para consultar los catálogos del sistema. **Todos los endpoints de catálogo filtran automáticamente registros inactivos o eliminados.**

### 1. Tipo de Usuario

**GET** `/api/v1/tipo-usuario` - Obtener todos los tipos de usuario (excluye eliminados)
**GET** `/api/v1/tipo-usuario/{id}` - Obtener un tipo de usuario por ID

```json
Response: 200 OK
{
  "id": 1,
  "nombre": "Usuario Regular"
}
```

### 2. Estado de Usuario

**GET** `/api/v1/estado-usuario` - Obtener todos los estados de usuario (excluye eliminados)
**GET** `/api/v1/estado-usuario/{id}` - Obtener un estado de usuario por ID

```json
Response: 200 OK
{
  "id": 1,
  "nombre": "Activo"
}
```

### 3. Plan

**GET** `/api/v1/plan` - Obtener todos los planes (excluye inactivos)
**GET** `/api/v1/plan/{id}` - Obtener un plan por ID
**POST** `/api/v1/plan` - Crear un nuevo plan
**PUT** `/api/v1/plan/{id}` - Actualizar un plan existente
**DELETE** `/api/v1/plan/{id}` - Eliminar un plan (borrado lógico - cambia activo a false)
**GET** `/api/v1/plan/nombre/{nombre}` - Obtener un plan por nombre

```json
Response GET: 200 OK
{
  "id": 1,
  "nombre": "Plan Básico",
  "precioMensual": 50000,
  "tiempoIncluido": 20,
  "activo": true
}

Request POST/PUT:
{
  "nombre": "Plan Premium",
  "precioMensual": 100000,
  "tiempoIncluido": 50,
  "activo": true
}
```

**Validaciones:**
- Nombre es obligatorio y único
- Precio mensual debe ser >= 0
- Tiempo incluido debe ser >= 0
- Borrado lógico: cambia `activo` a false

### 4. Tipo de Recurso

**GET** `/api/v1/tipo-recurso` - Obtener todos los tipos de recurso (excluye eliminados)
**GET** `/api/v1/tipo-recurso/{id}` - Obtener un tipo de recurso por ID

```json
Response: 200 OK
{
  "id": 1,
  "nombre": "Sala de Reuniones"
}
```

### 5. Estado de Recurso

**GET** `/api/v1/estado-recurso` - Obtener todos los estados de recurso (excluye eliminados)
**GET** `/api/v1/estado-recurso/{id}` - Obtener un estado de recurso por ID

```json
Response: 200 OK
{
  "id": 1,
  "nombre": "Disponible"
}
```

### 6. Estado de Reserva

**GET** `/api/v1/estado-reserva` - Obtener todos los estados de reserva (excluye inactivos)
**GET** `/api/v1/estado-reserva/{id}` - Obtener un estado de reserva por ID

```json
Response: 200 OK
{
  "id": 1,
  "nombre": "Activa"
}
```

### 7. Estado de Factura

**GET** `/api/v1/estado-factura` - Obtener todos los estados de factura (excluye inactivos)
**GET** `/api/v1/estado-factura/{id}` - Obtener un estado de factura por ID

```json
Response: 200 OK
{
  "id": 1,
  "nombre": "Pagada"
}
```

---

3. **La API estará disponible en:**
```
http://localhost:8080/api/v1/reserva
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
6. **Borrado Lógico**: 
   - **Reserva, Recurso, Usuario**: Cambian estado a "Eliminado"
   - **Plan**: Cambia campo `activo` a `false`
7. **Queries JPQL**: Las facturas utilizan queries JPQL con `EXTRACT` para filtrar por mes y año
8. **Actualización de Estado**: Factura usa PATCH para actualizar solo el estado (no toda la entidad)
9. **Horas Restantes**: El endpoint `/api/v1/usuario/{id}/horas-restantes` usa una query nativa con CTE (Common Table Expression) para calcular las horas disponibles del mes actual. Los usuarios **sin plan** pueden obtener valores negativos, lo cual es el comportamiento esperado.
