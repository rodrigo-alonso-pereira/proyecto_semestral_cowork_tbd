--  COWORK-APP - DATA MANIPULATION SQL

SET search_path TO reservas;

INSERT INTO Plan (Nombre, Precio_mensual, Tiempo_incluido) VALUES
('Básico', 35000, 15),
('Medio', 75000, 35),
('Avanzado', 120000, 80),
('Sin Plan', 0, 0);

INSERT INTO Estado_Usuario (Nombre) VALUES
('Activo'),
('Inactivo'),
('Suspendido'),
('Eliminado');

INSERT INTO Tipo_Usuario (Nombre) VALUES
('Administrador'),
('Gerente'),
('Cliente');

INSERT INTO Tipo_Recurso (Nombre) VALUES
('Escritorio'),
('Oficina'),
('Sala de Reuniones'),
('Cabina'),
('Estudio');

INSERT INTO Estado_Recurso (Nombre) VALUES
('Activo'),
('En Mantenimiento'),
('Inactivo'),
('Eliminado');

INSERT INTO Estado_Factura (Nombre) VALUES
('Pendiente'),
('Pagada'),
('Vencida'),
('Cancelada'),
('Eliminado');

INSERT INTO Estado_Reserva (Nombre) VALUES
('Activa'),
('Cancelada'),
('Completada'),
('Eliminado');

-- Usuarios
INSERT INTO Usuario (Rut, Nombre, Password, Email, Estado_usuario_id, Tipo_usuario_id, Plan_id) VALUES
('99999999-9', 'Admin Jefe', 'hash_admin', 'admin@cowork.cl', 1, 1, NULL),
('88888888-8', 'Javier Gerente', 'hash_gerente', 'javier.g@cowork.cl', 1, 2, NULL),
('11111111-1', 'Ana Fernández', 'hash_ana', 'ana.f@mail.com', 1, 3, 3),
('22222222-2', 'Benito Castro', 'hash_benito', 'benito.c@mail.com', 1, 3, 1),
('33333333-3', 'Cecilia Díaz', 'hash_ceci', 'ceci.d@mail.com', 1, 3, 2),
('44444444-4', 'David Riquelme', 'hash_david', 'david.r@mail.com', 3, 3, 3),
('55555555-5', 'Elena Morales', 'hash_elena', 'elena.m@mail.com', 1, 3, 2),
('66666666-6', 'Felipe Soto', 'hash_felipe', 'felipe.s@mail.com', 1, 3, 4),
('77777777-7', 'Gabriela Peña', 'hash_gabi', 'gabi.p@mail.com', 1, 3, 4),
('00000000-0', 'Héctor Vidal', 'hash_hector', 'hector.v@mail.com', 2, 3, 1);

-- Historial estados
INSERT INTO Historial_Estado_Usuario (Usuario_id, Estado_usuario_id, Fecha_cambio_estado) VALUES
(1, 1, '2025-11-09'),
(2, 1, '2025-11-09'),
(3, 1, '2025-11-09'),
(4, 1, '2025-11-09'),
(5, 1, '2025-11-09'),
(6, 1, '2025-05-09'),
(6, 3, '2025-10-09'),
(7, 1, '2025-11-09'),
(8, 1, '2025-11-09'),
(9, 1, '2025-11-09'),
(10, 1, '2025-09-09'),
(10, 2, '2025-10-09');

-- Recursos
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

-- Reservas
INSERT INTO Reserva (Inicio_reserva, Termino_reserva, Fecha_creacion, Valor, Usuario_id, Recurso_id, Estado_reserva_id) VALUES
('2025-11-10 09:00:00', '2025-11-10 11:00:00', '2025-11-10', 10000, 4, 1, 3),
('2025-11-10 14:00:00', '2025-11-10 16:00:00', '2025-11-10', 16000, 7, 10, 3),
('2025-11-10 16:00:00', '2025-11-10 17:00:00', '2025-11-10', 3000, 8, 13, 3),
('2025-11-10 10:00:00', '2025-11-10 18:00:00', '2025-11-10', 400000, 3, 7, 3),
('2025-11-11 10:00:00', '2025-11-11 12:00:00', '2025-11-10', 24000, 5, 15, 3),
('2025-11-12 14:00:00', '2025-11-12 16:00:00', '2025-11-10', 100000, 4, 8, 3),
('2025-11-03 17:00:00', '2025-11-03 18:00:00', '2025-11-03', 15000, 9, 11, 3),
('2025-10-10 09:00:00', '2025-10-10 14:00:00', '2025-10-10', 250000, 3, 9, 3),
('2025-11-06 12:00:00', '2025-11-06 14:00:00', '2025-11-06', 16000, 8, 3, 3),
('2025-11-05 09:00:00', '2025-11-05 10:00:00', '2025-11-05', 5000, 5, 2, 3);

COMMIT;
