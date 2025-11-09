-- DML Cowork-App

SET search_path TO reservas;

INSERT INTO Plan (Nombre, Precio_mensual, Tiempo_incluido) VALUES
('Básico', 35000, 15),
('Medio', 75000, 35),
('Avanzado', 120000, 80),
('Sin Plan', 0, 0);

INSERT INTO Estado_Usuario (Nombre) VALUES
('Activo'),
('Inactivo'),
('Suspendido');

INSERT INTO Tipo_Usuario (Nombre) VALUES
('Administrador'),
('Gerente'),
('Cliente'),
('Walker-in');

INSERT INTO Tipo_Recurso (Nombre) VALUES
('Escritorio'), -- id 1
('Oficina'), -- id 2
('Sala de Reuniones'), -- id 3
('Cabina'), -- id 4
('Estudio'); -- id 5

INSERT INTO Estado_Recurso (Nombre) VALUES
('Activo'),
('En Mantenimiento'),
('Inactivo');

INSERT INTO Estado_Factura (Nombre) VALUES
('Pendiente'),
('Pagada'),
('Vencida'),
('Cancelada');

INSERT INTO Estado_Reserva (Nombre) VALUES
('Activa'),
('Cancelada'),
('Completada'),
('No Show');

INSERT INTO Recurso (Nombre, Precio, Capacidad, Tipo_recurso_id, Estado_recurso_id) VALUES
('Hot Desk 01', 5000, 1, 1, 1),
('Hot Desk 02', 5000, 1, 1, 1),
('Hot Desk 03', 5000, 1, 1, 1),
('Escritorio Dedicado 01', 8000, 1, 1, 2),
('Escritorio Dedicado 02', 8000, 1, 1, 2),
('Escritorio Dedicado 03', 8000, 1, 1, 2),
('Oficina Privada 01', 50000, 4, 2, 1),
('Oficina Privada 02', 50000, 4, 2, 1),
('Oficina Privada 03', 50000, 4, 2, 1),
('Sala de reuniones Pequeña', 8000, 4, 3, 1),
('Sala de reuniones Mediana', 15000, 8, 3, 1),
('Sala de reuniones Grande', 25000, 15, 3, 1),
('Cabina 01', 3000, 1, 4, 1),
('Cabina 02', 3000, 1, 4, 1),
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
INSERT INTO Historial_Estado_Usuario (Usuario_id, Estado_usuario_id, Fecha_cambio_estado) VALUES
(1, 1, '2025-11-09'),  -- Admin - Activo
(2, 1, '2025-11-09'),  -- Gerente - Activo
(3, 1, '2025-11-09'),  -- Ana - Activo
(4, 1, '2025-11-09'),  -- Benito - Activo
(5, 1, '2025-11-09'),  -- Cecilia - Activo
(6, 1, '2025-05-09'),  -- David - Activo (hace 6 meses)
(6, 3, '2025-10-09'),  -- David - pasó a Suspendido (hace 1 mes)
(7, 1, '2025-11-09'),  -- Elena - Activo
(8, 1, '2025-11-09'),  -- Felipe - Activo
(9, 1, '2025-11-09'),  -- Gabriela - Activo
(10, 1, '2025-09-09'), -- Héctor - Activo (hace 2 meses)
(10, 2, '2025-10-09'); -- Héctor - pasó a Inactivo (hace 1 mes)

-- 5. RESERVAS (Hija de Usuario y Recurso)
INSERT INTO Reserva (Inicio_reserva, Termino_reserva, Fecha_creacion, Valor, Usuario_id, Recurso_id, Estado_reserva_id) VALUES
-- Reservas del día (Lunes 10 Nov 2025)
('2025-11-10 09:00:00', '2025-11-10 11:00:00', '2025-11-10', 10000, 4, 1, 1),   -- Benito, Hot Desk 01, Activa
('2025-11-10 14:00:00', '2025-11-10 16:00:00', '2025-11-10', 16000, 7, 10, 1),  -- Elena, Sala Pequeña, Activa
('2025-11-10 16:00:00', '2025-11-10 17:00:00', '2025-11-10', 3000, 8, 13, 1),   -- Felipe, Cabina 01, Activa
('2025-11-10 10:00:00', '2025-11-10 18:00:00', '2025-11-10', 400000, 3, 7, 1),  -- Ana, Oficina Privada 01, Activa

-- Reservas Futuras (Martes 11 y Miércoles 12 Nov 2025)
('2025-11-11 10:00:00', '2025-11-11 12:00:00', '2025-11-10', 24000, 5, 15, 1),  -- Cecilia, Estudio Podcast, Activa
('2025-11-12 14:00:00', '2025-11-12 16:00:00', '2025-11-10', 100000, 4, 8, 1),  -- Benito, Oficina Privada 02, Activa

-- Reservas Pasadas (Historial) - Completadas (Lunes 3 Nov y Viernes 10 Oct 2025)
('2025-11-03 17:00:00', '2025-11-03 18:00:00', '2025-11-03', 15000, 9, 11, 3),  -- Gabriela, Sala Mediana, Completada
('2025-10-10 09:00:00', '2025-10-10 14:00:00', '2025-10-10', 250000, 3, 9, 3),  -- Ana, Oficina Privada 03, Completada

-- Reserva Cancelada (Jueves 6 Nov 2025)
('2025-11-06 12:00:00', '2025-11-06 14:00:00', '2025-11-06', 16000, 8, 3, 2),   -- Felipe, Hot Desk 03, Cancelada

-- Reserva Completada (Miércoles 5 Nov 2025)
('2025-11-05 09:00:00', '2025-11-05 10:00:00', '2025-11-05', 5000, 5, 2, 3);    -- Cecilia, Hot Desk 02, Completada

-- 6. FACTURAS (Hija de Usuario)
INSERT INTO Factura (Numero_factura, Fecha_emision, Total, Usuario_id, Estado_factura_id) VALUES
(20250001, '2025-10-10', 120000, 3, 2), -- Pagada - Ana
(20250002, '2025-11-09', 75000, 5, 1),  -- Pendiente - Cecilia
(20250003, '2025-10-25', 15000, 9, 2),  -- Pagada - Gabriela
(20250004, '2025-11-09', 35000, 4, 2),  -- Pagada - Benito
(20250005, '2025-11-14', 120000, 6, 1); -- Pendiente - David (fecha futura)

COMMIT;