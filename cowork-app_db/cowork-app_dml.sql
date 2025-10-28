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
('Cabina s02', 3000, 1, 4, 1);

INSERT INTO Recurso (Nombre, Precio, Capacidad, Tipo_recurso_id, Estado_recurso_id) VALUES
('Estudio Podcast', 12000, 4, 5, 1);

COMMIT;