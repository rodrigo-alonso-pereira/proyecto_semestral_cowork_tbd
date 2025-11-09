-- DDL Cowork-App

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

-- Table: Usuario_Estado_Usuario (Historial de Estados)
CREATE TABLE Usuario_Estado_Usuario (
    Id BIGSERIAL PRIMARY KEY,
    Usuario_id BIGINT NOT NULL,
    Estado_usuario_id BIGINT NOT NULL,
    CONSTRAINT fk_historial_usuario FOREIGN KEY (Usuario_id) REFERENCES Usuario(Id),
    CONSTRAINT fk_historial_estado_usuario FOREIGN KEY (Estado_usuario_id) REFERENCES Estado_Usuario(Id)
);

-- Table: Factura
CREATE TABLE Factura (
    Id BIGSERIAL PRIMARY KEY,
    Numero_factura BIGINT NOT NULL UNIQUE,
    Fecha_emision DATE NOT NULL DEFAULT CURRENT_DATE,
    Estado BOOLEAN DEFAULT TRUE,
    Total BIGINT NOT NULL CHECK (Total >= 0),
    Usuario_id BIGINT NOT NULL,
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

-- Table: Reserva
CREATE TABLE Reserva (
    Id BIGSERIAL PRIMARY KEY,
    Hora_inicio TIME NOT NULL,
    Hora_termino TIME NOT NULL,
    Estado BOOLEAN DEFAULT TRUE,
    Fecha_reserva DATE NOT NULL DEFAULT CURRENT_DATE,
    Valor_reserva BIGINT NOT NULL CHECK (Valor_reserva >= 0),
    Usuario_id BIGINT NOT NULL,
    Recurso_id BIGINT NOT NULL,
    CONSTRAINT chk_hora_reserva CHECK (Hora_termino > Hora_inicio),
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (Usuario_id)
        REFERENCES Usuario(Id) ON DELETE CASCADE,
    CONSTRAINT fk_reserva_recurso FOREIGN KEY (Recurso_id)
        REFERENCES Recurso(Id) ON DELETE CASCADE
    CONSTRAINT fk_reserva_usuario FOREIGN KEY (Usuario_id) REFERENCES Usuario(Id),
    CONSTRAINT fk_reserva_recurso FOREIGN KEY (Recurso_id) REFERENCES Recurso(Id),
    CONSTRAINT fk_reserva_estado FOREIGN KEY (Estado_reserva_id) REFERENCES Estado_Reserva(Id),
);