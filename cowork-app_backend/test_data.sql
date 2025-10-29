-- Datos de prueba para el CRUD de Reservas
-- Asegúrate de ejecutar estos inserts DESPUÉS de tener el DDL ejecutado

SET search_path TO reservas;

-- 1. Insertar Planes
INSERT INTO Plan (Nombre, Precio_mensual, Tiempo_incluido, Tiempo_usado) VALUES
('Plan Básico', 50000, 20, 0),
('Plan Premium', 100000, 50, 0),
('Plan Corporativo', 200000, 100, 0);

-- 2. Insertar Estados de Usuario
INSERT INTO Estado_Usuario (Nombre) VALUES
('Activo'),
('Inactivo'),
('Suspendido');

-- 3. Insertar Tipos de Usuario
INSERT INTO Tipo_Usuario (Nombre) VALUES
('Cliente'),
('Administrador'),
('Empleado');

-- 4. Insertar Usuarios de prueba
INSERT INTO Usuario (Rut, Nombre, Password, Email, Estado_usuario_id, Tipo_usuario_id, Plan_id) VALUES
('12345678-9', 'Juan Pérez', 'password123', 'juan.perez@email.com', 1, 1, 1),
('98765432-1', 'María González', 'password456', 'maria.gonzalez@email.com', 1, 1, 2),
('11111111-1', 'Pedro Martínez', 'password789', 'pedro.martinez@email.com', 1, 1, 3),
('22222222-2', 'Ana López', 'passwordabc', 'ana.lopez@email.com', 1, 2, NULL);

-- 5. Insertar Tipos de Recurso
INSERT INTO Tipo_Recurso (Nombre) VALUES
('Sala de Reuniones'),
('Oficina Privada'),
('Escritorio Compartido'),
('Sala de Conferencias');

-- 6. Insertar Estados de Recurso
INSERT INTO Estado_Recurso (Nombre) VALUES
('Disponible'),
('Ocupado'),
('Mantenimiento');

-- 7. Insertar Recursos
INSERT INTO Recurso (Nombre, Precio, Capacidad, Tipo_recurso_id, Estado_recurso_id) VALUES
('Sala de Reuniones A', 25000, 8, 1, 1),
('Sala de Reuniones B', 30000, 12, 1, 1),
('Oficina Ejecutiva 1', 50000, 4, 2, 1),
('Oficina Ejecutiva 2', 50000, 4, 2, 1),
('Escritorio Zona Norte 1', 15000, 1, 3, 1),
('Escritorio Zona Norte 2', 15000, 1, 3, 1),
('Sala Conferencias Principal', 80000, 50, 4, 1);

-- 8. Insertar Reservas de ejemplo
INSERT INTO Reserva (Hora_inicio, Hora_termino, Estado, Fecha_reserva, Valor_reserva, Usuario_id, Recurso_id) VALUES
('09:00:00', '11:00:00', TRUE, CURRENT_DATE, 25000, 1, 1),
('14:00:00', '16:00:00', TRUE, CURRENT_DATE, 30000, 2, 2),
('10:00:00', '12:00:00', TRUE, CURRENT_DATE + INTERVAL '1 day', 50000, 3, 3),
('15:00:00', '17:00:00', TRUE, CURRENT_DATE + INTERVAL '2 days', 15000, 1, 5),
('09:00:00', '18:00:00', TRUE, CURRENT_DATE + INTERVAL '3 days', 80000, 4, 7);

-- Verificar datos insertados
SELECT 'Usuarios insertados:' as info, COUNT(*) as total FROM Usuario;
SELECT 'Recursos insertados:' as info, COUNT(*) as total FROM Recurso;
SELECT 'Reservas insertadas:' as info, COUNT(*) as total FROM Reserva;

