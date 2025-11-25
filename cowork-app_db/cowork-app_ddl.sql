-- DDL Cowork-App

DROP SCHEMA IF EXISTS reservas CASCADE;
CREATE SCHEMA IF NOT EXISTS reservas;
SET search_path TO reservas;


DROP TABLE IF EXISTS Reserva CASCADE;
DROP TABLE IF EXISTS Factura CASCADE;
DROP TABLE IF EXISTS Usuario_Estado_Usuario CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;
DROP TABLE IF EXISTS Plan CASCADE;
DROP TABLE IF EXISTS Recurso CASCADE;
DROP TABLE IF EXISTS Tipo_Usuario CASCADE;
DROP TABLE IF EXISTS Estado_Usuario CASCADE;
DROP TABLE IF EXISTS Tipo_Recurso CASCADE;
DROP TABLE IF EXISTS Estado_Recurso CASCADE;


-- Table: Plan
CREATE TABLE Plan (
    Id BIGSERIAL PRIMARY KEY,
    Nombre VARCHAR(200) NOT NULL,
    Precio_mensual BIGINT NOT NULL CHECK (Precio_mensual >= 0),
    Tiempo_incluido INT NOT NULL CHECK (Tiempo_incluido >= 0),
    Activo BOOLEAN NOT NULL DEFAULT TRUE
);


-- Table: Estado_Usuario
CREATE TABLE Estado_Usuario (
    Id BIGSERIAL PRIMARY KEY,
    Nombre VARCHAR(200) NOT NULL UNIQUE,
    Activo BOOLEAN NOT NULL DEFAULT TRUE
);


-- Table: Tipo_Usuario
CREATE TABLE Tipo_Usuario (
    Id BIGSERIAL PRIMARY KEY,
    Nombre VARCHAR(200) NOT NULL UNIQUE,
    Activo BOOLEAN NOT NULL DEFAULT TRUE
);


-- Table: Usuario
CREATE TABLE Usuario (
    Id BIGSERIAL PRIMARY KEY,
    Rut VARCHAR(30) NOT NULL UNIQUE,
    Nombre VARCHAR(200) NOT NULL,
    Password VARCHAR(200) NOT NULL,
    Email VARCHAR(200) NOT NULL UNIQUE,
    Estado_usuario_id BIGINT NOT NULL,
    Tipo_usuario_id BIGINT NOT NULL,
    Plan_id BIGINT,
    CONSTRAINT fk_usuario_estado_usuario FOREIGN KEY (Estado_usuario_id) REFERENCES Estado_Usuario(Id),
    CONSTRAINT fk_usuario_tipo_usuario FOREIGN KEY (Tipo_usuario_id) REFERENCES Tipo_Usuario(Id),
    CONSTRAINT fk_usuario_plan FOREIGN KEY (Plan_id) REFERENCES Plan(Id)
);

-- Table: Historial_Estado_Usuario
CREATE TABLE Historial_Estado_Usuario (
    Id BIGSERIAL PRIMARY KEY,
    Usuario_id BIGINT NOT NULL,
    Fecha_cambio_estado DATE NOT NULL DEFAULT CURRENT_DATE,
    Estado_usuario_id BIGINT NOT NULL,
    CONSTRAINT fk_historial_usuario FOREIGN KEY (Usuario_id) REFERENCES Usuario(Id),
    CONSTRAINT fk_historial_estado_usuario FOREIGN KEY (Estado_usuario_id) REFERENCES Estado_Usuario(Id)
);

-- Table: Estado_Factura
CREATE TABLE Estado_Factura (
    Id BIGSERIAL PRIMARY KEY,
    Nombre VARCHAR(200) NOT NULL UNIQUE,
    Activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Table: Factura
CREATE TABLE Factura (
    Id BIGSERIAL PRIMARY KEY,
    Numero_factura BIGINT NOT NULL UNIQUE,
    Fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
    Total BIGINT NOT NULL CHECK (Total >= 0),
    Descripcion VARCHAR(500),
    Usuario_id BIGINT NOT NULL,
    Estado_factura_id BIGINT NOT NULL,
    CONSTRAINT fk_factura_usuario FOREIGN KEY (Usuario_id)
        REFERENCES Usuario(Id),
    CONSTRAINT fk_factura_estado FOREIGN KEY (Estado_factura_id)
        REFERENCES Estado_Factura(Id)
);

-- Table: Tipo_Recurso
CREATE TABLE Tipo_Recurso (
    Id BIGSERIAL PRIMARY KEY,
    Nombre VARCHAR(200) NOT NULL UNIQUE,
    Activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Table: Estado_Recurso
CREATE TABLE Estado_Recurso (
    Id BIGSERIAL PRIMARY KEY,
    Nombre VARCHAR(200) NOT NULL UNIQUE,
    Activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Table: Recurso
CREATE TABLE Recurso (
    Id BIGSERIAL PRIMARY KEY,
    Nombre VARCHAR(200) NOT NULL,
    Precio BIGINT NOT NULL CHECK (Precio >= 0),
    Capacidad INT NOT NULL CHECK (Capacidad > 0),
    Tipo_recurso_id BIGINT NOT NULL,
    Estado_recurso_id BIGINT NOT NULL,
    CONSTRAINT fk_recurso_tipo FOREIGN KEY (Tipo_recurso_id) REFERENCES Tipo_Recurso(Id),
    CONSTRAINT fk_recurso_estado FOREIGN KEY (Estado_recurso_id) REFERENCES Estado_Recurso(Id)
);

-- Table: Estado_Reserva
CREATE TABLE Estado_Reserva (
    Id BIGSERIAL PRIMARY KEY,
    Nombre VARCHAR(200) NOT NULL UNIQUE,
    Activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Table: Reserva
CREATE TABLE Reserva (
    Id BIGSERIAL PRIMARY KEY,
    Inicio_reserva TIMESTAMP NOT NULL,
    Termino_reserva TIMESTAMP NOT NULL,
    Fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
    Valor BIGINT NOT NULL CHECK (Valor >= 0),
    Usuario_id BIGINT NOT NULL,
    Recurso_id BIGINT NOT NULL,
    Estado_reserva_id BIGINT NOT NULL,
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (Usuario_id) REFERENCES Usuario(Id),
    CONSTRAINT fk_reserva_recurso FOREIGN KEY (Recurso_id) REFERENCES Recurso(Id),
    CONSTRAINT fk_reserva_estado FOREIGN KEY (Estado_reserva_id) REFERENCES Estado_Reserva(Id),
    -- Reserva debe terminar después de iniciar
    CONSTRAINT chk_periodo_reserva CHECK (Termino_reserva > Inicio_reserva),
    -- Reserva debe ser al menos de 1 hora
    CONSTRAINT chk_minimo_1_hora CHECK (EXTRACT(EPOCH FROM (Termino_reserva - Inicio_reserva)) >= 3600),
    -- Reserva solo en días hábiles (lunes a viernes)
    CONSTRAINT chk_dias_habiles CHECK (EXTRACT(DOW FROM Inicio_reserva) BETWEEN 1 AND 5),
    -- Reserva deben ser en horario de oficina (09:00 a 21:00)
    CONSTRAINT chk_horario_oficina CHECK (
        EXTRACT(HOUR FROM Inicio_reserva) BETWEEN 9 AND 20
        AND EXTRACT(HOUR FROM Termino_reserva) BETWEEN 10 AND 21),
    -- Reserva deben empezar y terminan en "hora completa" (ej. 09:00, 14:00)
    CONSTRAINT chk_hora_completa CHECK (
        EXTRACT(MINUTE FROM Inicio_reserva) = 0
        AND EXTRACT(SECOND FROM Inicio_reserva) = 0
        AND EXTRACT(MINUTE FROM Termino_reserva) = 0
        AND EXTRACT(SECOND FROM Termino_reserva) = 0)
);

