-- DML Cowork-App

INSERT INTO Tipo_Usuario (Nombre) VALUES
('Administrador'),
('Gerente'),
('Cliente'),
('Walker-in');

INSERT INTO Estado_Usuario (Nombre) VALUES
('Activo'),
('Inactivo'),
('Suspendido');

INSERT INTO Plan (Nombre, Precio_mensual, Tiempo_incluido) VALUES
('Básico', 35000, 15),
('Medio', 75000, 35),
('Avanzado', 120000, 80),
('Sin Plan', 0, 0);

INSERT INTO Tipo_Recurso (Nombre) VALUES
('Escritorio'), -- id 1
('Oficina'), -- id 2
('Sala'), -- id 3
('Cabina'), -- id 4
('Estudio'); -- id 5

INSERT INTO Estado_Recurso (Nombre) VALUES
('Disponible'),
('No Disponible'),
('En Mantenimiento');

INSERT INTO Recurso (Nombre, Precio, Capacidad, Tipo_recurso_id, Estado_recurso_id) VALUES
('Hot Desk 01', 5000, 1, 1, 1),
('Hot Desk 02', 5000, 1, 1, 1),
('Hot Desk 03', 5000, 1, 1, 1),
('Escritorio Dedicado 01', 8000, 1, 1, 2),
('Escritorio Dedicado 02', 8000, 1, 1, 2),
('Escritorio Dedicado 03', 8000, 1, 1, 2),
('Oficina Privada 01', 50000, 4, 2, 1),
('Oficina Privada 02', 50000, 4, 2, 1),
('Oficina Privada 03', 50000, 4, 2, 1);

INSERT INTO Recurso (Nombre, Precio, Capacidad, Tipo_recurso_id, Estado_recurso_id) VALUES
('Sala Reuniones (S)', 8000, 4, 3, 1),
('Sala Reuniones (M)', 15000, 8, 3, 1),
('Sala Reuniones (L)', 25000, 15, 3, 1);

INSERT INTO Recurso (Nombre, Precio, Capacidad, Tipo_recurso_id, Estado_recurso_id) VALUES
('Cabina 01', 3000, 1, 4, 1),
('Cabina 02', 3000, 1, 4, 1);

INSERT INTO Recurso (Nombre, Precio, Capacidad, Tipo_recurso_id, Estado_recurso_id) VALUES
('Estudio Podcast', 12000, 4, 5, 1);


-- DATOS PARA PRUEBAS

-- 3. USUARIOS (Padre de Factura, Reserva, Usuario_Estado_Usuario)
INSERT INTO Usuario (Rut, Nombre, Password, Email, Estado_usuario_id, Tipo_usuario_id, Plan_id) VALUES
-- Personal (Tipo ID 1, 2)
('99999999-9', 'Admin Jefe', 'hash_admin', 'admin@cowork.cl', 1, 1, NULL),     -- ID 1: Administrador, Activo
('88888888-8', 'Javier Gerente', 'hash_gerente', 'javier.g@cowork.cl', 1, 2, NULL), -- ID 2: Gerente, Activo

-- Clientes Frecuentes (Tipo ID 3)
('11111111-1', 'Ana Fernández', 'hash_ana', 'ana.f@mail.com', 1, 3, 3),        -- ID 3: Activo, Plan Avanzado
('22222222-2', 'Benito Castro', 'hash_benito', 'benito.c@mail.com', 1, 3, 1),    -- ID 4: Activo, Plan Básico
('33333333-3', 'Cecilia Díaz', 'hash_ceci', 'ceci.d@mail.com', 1, 3, 2),        -- ID 5: Activo, Plan Medio
('44444444-4', 'David Riquelme', 'hash_david', 'david.r@mail.com', 3, 3, 3),   -- ID 6: Suspendido, Plan Avanzado
('55555555-5', 'Elena Morales', 'hash_elena', 'elena.m@mail.com', 1, 3, 2),     -- ID 7: Activo, Plan Medio

-- Walker-in (Tipo ID 4)
('66666666-6', 'Felipe Soto', 'hash_felipe', 'felipe.s@mail.com', 1, 4, 4),      -- ID 8: Walker-in, Sin Plan
('77777777-7', 'Gabriela Peña', 'hash_gabi', 'gabi.p@mail.com', 1, 4, 4),      -- ID 9: Walker-in, Sin Plan

-- Cliente Inactivo
('00000000-0', 'Héctor Vidal', 'hash_hector', 'hector.v@mail.com', 2, 3, 1);    -- ID 10: Inactivo, Plan Básico


-- 4. HISTORIAL DE ESTADOS DE USUARIO (Hija de Usuario)
INSERT INTO Usuario_Estado_Usuario (Usuario_id, Estado_usuario_id, Fecha_cambio_estado) VALUES
(1, 1, CURRENT_DATE),
(2, 1, CURRENT_DATE),
(3, 1, CURRENT_DATE),
(4, 1, CURRENT_DATE),
(5, 1, CURRENT_DATE),
(6, 1, CURRENT_DATE - INTERVAL '6 months'),
(6, 3, CURRENT_DATE - INTERVAL '1 month'),  -- David pasó a Suspendido
(7, 1, CURRENT_DATE),
(8, 1, CURRENT_DATE),
(9, 1, CURRENT_DATE),
(10, 1, CURRENT_DATE - INTERVAL '2 months'),
(10, 2, CURRENT_DATE - INTERVAL '1 month');  -- Héctor pasó a Inactivo

-- 5. RESERVAS (Hija de Usuario y Recurso)
INSERT INTO Reserva (Hora_inicio, Hora_termino, Estado, Fecha_reserva, Valor_reserva, Usuario_id, Recurso_id) VALUES
-- Reservas de Hoy
('09:00:00', '11:00:00', TRUE, CURRENT_DATE, 10000, 4, 1),
('14:00:00', '16:00:00', TRUE, CURRENT_DATE, 30000, 7, 10),
('16:30:00', '17:30:00', TRUE, CURRENT_DATE, 3000, 8, 13),
('10:00:00', '18:00:00', TRUE, CURRENT_DATE, 400000, 3, 7),

-- Reservas Futuras
('10:00:00', '12:00:00', TRUE, CURRENT_DATE + INTERVAL '1 day', 24000, 5, 15),
('14:00:00', '16:00:00', TRUE, CURRENT_DATE + INTERVAL '2 days', 50000, 4, 8),

-- Reservas Pasadas (Historial)
('17:00:00', '18:00:00', TRUE, CURRENT_DATE - INTERVAL '1 week', 15000, 9, 11),
('08:00:00', '13:00:00', TRUE, CURRENT_DATE - INTERVAL '1 month', 250000, 3, 9),
('12:00:00', '14:00:00', FALSE, CURRENT_DATE - INTERVAL '2 days', 16000, 8, 3),
('09:00:00', '10:00:00', TRUE, CURRENT_DATE - INTERVAL '3 days', 5000, 5, 2);

-- 6. FACTURAS (Hija de Usuario)
INSERT INTO Factura (Numero_factura, Fecha_emision, Estado, Total, Usuario_id) VALUES
(20250001, CURRENT_DATE - INTERVAL '30 days', TRUE, 120000, 3),
(20250002, CURRENT_DATE, FALSE, 75000, 5),
(20250003, CURRENT_DATE - INTERVAL '15 days', TRUE, 15000, 9),
(20250004, CURRENT_DATE, TRUE, 35000, 4),
(20250005, CURRENT_DATE + INTERVAL '5 days', FALSE, 120000, 6);

COMMIT;