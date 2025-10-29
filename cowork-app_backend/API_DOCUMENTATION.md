# API REST - CRUD Reserva

## ✅ Estado del Proyecto
El proyecto ha sido **compilado exitosamente** y está listo para usar.

## 📁 Estructura Creada

### Entidades (Entity Layer)
- `Plan.java` - Entidad para planes de suscripción
- `EstadoUsuario.java` - Estados de usuarios
- `TipoUsuario.java` - Tipos de usuarios
- `Usuario.java` - Entidad principal de usuarios
- `TipoRecurso.java` - Tipos de recursos
- `EstadoRecurso.java` - Estados de recursos
- `Recurso.java` - Entidad de recursos (salas, espacios, etc.)
- `Reserva.java` - **Entidad principal para las reservas**

### DTOs (Data Transfer Objects)
- `ReservaResponseDTO.java` - DTO para respuestas de reservas (incluye datos completos)
- `ReservaCreateDTO.java` - DTO para crear nuevas reservas
- `ReservaUpdateDTO.java` - DTO para actualizar reservas existentes

### Repositories
- `ReservaRepository.java` - Repositorio con métodos de consulta personalizados
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
    "horaInicio": "10:00:00",
    "horaTermino": "12:00:00",
    "estado": true,
    "fechaReserva": "2025-10-29",
    "valorReserva": 50000,
    "usuarioId": 1,
    "usuarioNombre": "Juan Pérez",
    "recursoId": 1,
    "recursoNombre": "Sala de Reuniones A"
  }
]
```

### 2. **GET** `/api/v1/reserva/{id}`
Obtener una reserva por ID
```
Response: 200 OK (reserva encontrada)
Response: 404 NOT FOUND (reserva no existe)
```

### 3. **POST** `/api/v1/reserva`
Crear una nueva reserva
```json
Request Body:
{
  "horaInicio": "10:00:00",
  "horaTermino": "12:00:00",
  "fechaReserva": "2025-10-30",
  "valorReserva": 50000,
  "usuarioId": 1,
  "recursoId": 1
}

Response: 201 CREATED (reserva creada exitosamente)
Response: 400 BAD REQUEST (datos inválidos)
```

**Validaciones:**
- La hora de término debe ser posterior a la hora de inicio
- Usuario y recurso deben existir

### 4. **PUT** `/api/v1/reserva/{id}`
Actualizar una reserva existente
```json
Request Body:
{
  "horaInicio": "11:00:00",
  "horaTermino": "13:00:00",
  "estado": false,
  "fechaReserva": "2025-10-30",
  "valorReserva": 60000,
  "usuarioId": 1,
  "recursoId": 2
}

Response: 200 OK (reserva actualizada)
Response: 404 NOT FOUND (reserva no existe)
```

**Nota:** Todos los campos son opcionales en el update.

### 5. **DELETE** `/api/v1/reserva/{id}`
Eliminar una reserva
```
Response: 204 NO CONTENT (reserva eliminada)
Response: 404 NOT FOUND (reserva no existe)
```

---

## 🔍 Endpoints de Búsqueda

### 6. **GET** `/api/v1/reserva/usuario/{usuarioId}`
Obtener todas las reservas de un usuario específico

### 7. **GET** `/api/v1/reserva/recurso/{recursoId}`
Obtener todas las reservas de un recurso específico

### 8. **GET** `/api/v1/reserva/estado/{estado}`
Obtener reservas por estado (true=activas, false=inactivas)
```
Ejemplo: GET /api/v1/reserva/estado/true
```

### 9. **GET** `/api/v1/reserva/fecha/{fecha}`
Obtener reservas por fecha específica (formato: yyyy-MM-dd)
```
Ejemplo: GET /api/v1/reserva/fecha/2025-10-29
```

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
curl -X GET http://localhost:8080/api/v1/reserva
```

**Crear una reserva:**
```bash
curl -X POST http://localhost:8080/api/v1/reserva \
  -H "Content-Type: application/json" \
  -d '{
    "horaInicio": "10:00:00",
    "horaTermino": "12:00:00",
    "fechaReserva": "2025-10-30",
    "valorReserva": 50000,
    "usuarioId": 1,
    "recursoId": 1
  }'
```

**Actualizar una reserva:**
```bash
curl -X PUT http://localhost:8080/api/v1/reserva/1 \
  -H "Content-Type: application/json" \
  -d '{
    "estado": false
  }'
```

**Eliminar una reserva:**
```bash
curl -X DELETE http://localhost:8080/api/v1/reserva/1
```

---

## 📝 Notas Importantes

1. **JPA/Hibernate**: Las entidades están mapeadas correctamente con el esquema `reservas`
2. **Lombok**: Se usa para generar getters, setters, constructores automáticamente
3. **Validaciones**: 
   - Hora de término > Hora de inicio
   - Referencias válidas a Usuario y Recurso
4. **Estado por defecto**: Las reservas se crean con `estado = true`
5. **CORS**: Habilitado para todos los orígenes (`@CrossOrigin(origins = "*")`)

---

## 🎯 Próximos Pasos Sugeridos

1. Agregar validaciones con `@Valid` y `@NotNull` en los DTOs
2. Implementar manejo de excepciones personalizado con `@ControllerAdvice`
3. Agregar paginación en los endpoints de listado
4. Implementar autenticación y autorización con Spring Security
5. Agregar documentación con Swagger/OpenAPI
6. Crear tests unitarios y de integración

---

¡El CRUD de Reserva está completo y listo para pruebas! 🎉

