--  COWORK-APP - DDL

-- ===========================================================
-- 1. SCHEMA
-- ===========================================================
DROP SCHEMA IF EXISTS reservas CASCADE;
CREATE SCHEMA IF NOT EXISTS reservas;
SET search_path TO reservas;

-- ===========================================================
-- 2. TABLAS
-- ===========================================================
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
    Fecha_creacion DATE NOT NULL DEFAULT CURRENT_DATE,
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
    CONSTRAINT chk_periodo_reserva CHECK (Termino_reserva > Inicio_reserva),
    CONSTRAINT chk_minimo_1_hora CHECK (EXTRACT(EPOCH FROM (Termino_reserva - Inicio_reserva)) >= 3600),
    CONSTRAINT chk_dias_habiles CHECK (EXTRACT(DOW FROM Inicio_reserva) BETWEEN 1 AND 5),
    CONSTRAINT chk_horario_oficina CHECK (
        EXTRACT(HOUR FROM Inicio_reserva) BETWEEN 9 AND 20
        AND EXTRACT(HOUR FROM Termino_reserva) BETWEEN 10 AND 21),
    CONSTRAINT chk_hora_completa CHECK (
        EXTRACT(MINUTE FROM Inicio_reserva) = 0
        AND EXTRACT(SECOND FROM Inicio_reserva) = 0
        AND EXTRACT(MINUTE FROM Termino_reserva) = 0
        AND EXTRACT(SECOND FROM Termino_reserva) = 0)
);

-- Tabla staging para procesos ETL de importación
CREATE TABLE IF NOT EXISTS Usuario_import (
    Rut_raw TEXT NOT NULL,
    Nombre TEXT NOT NULL,
    Password TEXT NOT NULL,
    Email TEXT NOT NULL,
    Estado_usuario_id INT NOT NULL,
    Tipo_usuario_id INT NOT NULL,
    Plan_id INT
);

-- Control de procesos de facturación
CREATE TABLE IF NOT EXISTS Control_Facturacion (
    id SERIAL PRIMARY KEY,
    fecha_llamada TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ===========================================================
-- 3. VISTAS KPI
-- ===========================================================
-- kpi que identifica los nuevos clientes
CREATE OR REPLACE VIEW reservas.kpi_nuevos_clientes_base AS
WITH estados_cliente AS (
    SELECT
        heu.Usuario_id,
        heu.Estado_usuario_id,
        heu.Fecha_cambio_estado,
        ROW_NUMBER() OVER (
            PARTITION BY heu.Usuario_id
            ORDER BY heu.Fecha_cambio_estado
        ) AS orden_cambio
    FROM reservas.Historial_Estado_Usuario heu
    JOIN reservas.Usuario u ON u.Id = heu.Usuario_id
    JOIN reservas.Tipo_Usuario tu ON tu.Id = u.Tipo_usuario_id
    WHERE tu.Nombre = 'Cliente'
)
SELECT
    e.Usuario_id,
    e.Fecha_cambio_estado AS fecha_primer_estado_activo
FROM estados_cliente e
JOIN reservas.Estado_Usuario eu ON eu.Id = e.Estado_usuario_id
WHERE e.orden_cambio = 1
  AND eu.Nombre = 'Activo';

-- kpi que calcula horas reservadas reales
CREATE OR REPLACE VIEW reservas.kpi_reservas_reales AS
SELECT
    res.Id AS reserva_id,
    res.Inicio_reserva,
    res.Termino_reserva,
    EXTRACT(EPOCH FROM (res.Termino_reserva - res.Inicio_reserva)) / 3600.0
        AS horas_reservadas
FROM reservas.Reserva res
WHERE res.estado_reserva_id = 3;

-- kpi que rastrea cambios de estado de usuario
CREATE OR REPLACE VIEW reservas.kpi_cambios_estado AS
SELECT
    heu.Usuario_id,
    heu.Estado_usuario_id,
    heu.Fecha_cambio_estado,
    LAG(heu.Estado_usuario_id) OVER (
        PARTITION BY heu.Usuario_id
        ORDER BY heu.Fecha_cambio_estado
    ) AS estado_anterior
FROM reservas.Historial_Estado_Usuario heu;

-- ===========================================================
-- 4. FUNCIONES KPI
-- ===========================================================
-- 1. FUNCIÓN: Nuevos clientes en un período
CREATE OR REPLACE FUNCTION reservas.kpi_nuevos_clientes_mes(
    fecha_inicio DATE,
    fecha_fin DATE
)
RETURNS TABLE(nuevos_clientes INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT COUNT(*)::int
    FROM reservas.kpi_nuevos_clientes_base
    WHERE fecha_primer_estado_activo BETWEEN fecha_inicio AND fecha_fin;
END;
$$ LANGUAGE plpgsql;

-- 2. FUNCIÓN: Utilización real de recursos en un período
CREATE OR REPLACE FUNCTION reservas.kpi_utilizacion_real(
    fecha_inicio DATE,
    fecha_fin    DATE
)
RETURNS TABLE(
    horas_reservadas_total NUMERIC,
    horas_posibles NUMERIC,
    porcentaje_utilizacion NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH dias AS (
        SELECT d::date AS dia
        FROM generate_series(fecha_inicio, fecha_fin, INTERVAL '1 day') d
        WHERE EXTRACT(DOW FROM d) BETWEEN 1 AND 5  -- lunes a viernes
    ),
    horas_posibles_cte AS (
        SELECT (COUNT(*) * 12)::numeric AS horas
        FROM dias
    ),
    horas_reservadas_cte AS (
        SELECT COALESCE(SUM(horas_reservadas),0)::numeric AS horas
        FROM reservas.kpi_reservas_reales
        WHERE inicio_reserva::date BETWEEN fecha_inicio AND fecha_fin
    )
    SELECT
        r.horas,
        p.horas,
        CASE
            WHEN p.horas = 0 THEN 0
            ELSE ROUND((r.horas / p.horas) * 100, 2)
        END
    FROM horas_reservadas_cte r
    CROSS JOIN horas_posibles_cte p;
END;
$$ LANGUAGE plpgsql;

-- 3. FUNCIÓN: Tasa de churn en un período
CREATE OR REPLACE FUNCTION reservas.kpi_churn_rate(
    fecha_inicio DATE,
    fecha_fin DATE
)
RETURNS TABLE(
    clientes_que_se_fueron INT,
    clientes_activos_inicio INT,
    churn_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH ids AS (
        SELECT
            MAX(CASE WHEN nombre = 'Activo' THEN id END) AS id_activo,
            MAX(CASE WHEN nombre = 'Inactivo' THEN id END) AS id_inactivo,
            MAX(CASE WHEN nombre = 'Suspendido' THEN id END) AS id_suspendido
        FROM reservas.estado_usuario
    ),

    -- ESTADO REAL DEL USUARIO AL INICIO DEL PERÍODO
    ultimo_estado AS (
        SELECT
            u.id AS usuario_id,
            u.fecha_creacion,
            CASE
                -- Si el usuario fue creado DESPUÉS del inicio del período,
                -- no existía aún, no se considera en la base.
                WHEN u.fecha_creacion > fecha_inicio THEN NULL
                ELSE COALESCE(
                    (
                        -- Último estado conocido ANTES o EN fecha_inicio
                        SELECT h.estado_usuario_id
                        FROM reservas.historial_estado_usuario h
                        WHERE h.usuario_id = u.id
                          AND h.fecha_cambio_estado <= fecha_inicio
                        ORDER BY h.fecha_cambio_estado DESC
                        LIMIT 1
                    ),
                    -- Si no tiene historial, asumimos su estado actual
                    -- como estado inicial (desde fecha_creacion hacia atrás).
                    u.estado_usuario_id
                )
            END AS estado_inicio
        FROM reservas.usuario u
    ),

    -- CLIENTES ACTIVOS AL INICIO DEL PERÍODO
    activos_en_inicio AS (
        SELECT COUNT(*)::int AS total
        FROM ultimo_estado ue
        CROSS JOIN ids i
        WHERE ue.estado_inicio = i.id_activo
    ),

    -- BAJAS DURANTE EL PERÍODO
    bajas AS (
        SELECT DISTINCT e.usuario_id
        FROM reservas.kpi_cambios_estado e
        CROSS JOIN ids i
        WHERE e.fecha_cambio_estado BETWEEN fecha_inicio AND fecha_fin
          AND e.estado_anterior = i.id_activo
          AND e.estado_usuario_id IN (i.id_inactivo, i.id_suspendido)
    )

    SELECT
        (SELECT COUNT(*)::int FROM bajas) AS clientes_que_se_fueron,
        (SELECT total FROM activos_en_inicio) AS clientes_activos_inicio,
        CASE
            WHEN (SELECT total FROM activos_en_inicio) = 0 THEN 0
            ELSE ROUND(
                ((SELECT COUNT(*)::numeric FROM bajas)
                    /
                NULLIF((SELECT total FROM activos_en_inicio)::numeric,0)) * 100,
                2
            )
        END AS churn_rate;
END;
$$ LANGUAGE plpgsql;

-- ===========================================================
-- 5. FUNCIONES DE FACTURACIÓN
-- ===========================================================
-- 1. FUNCIÓN: Generar descripción de factura
CREATE OR REPLACE FUNCTION reservas.fn_generar_descripcion_factura(
    p_usuario_id BIGINT,
    p_fecha DATE
)
RETURNS TEXT AS $$
DECLARE
    v_text TEXT;
BEGIN
    SELECT COALESCE(
        STRING_AGG(resumen.descripcion, ', ' ORDER BY resumen.nombre),
        'Sin reservas registradas'
    )
    INTO v_text
    FROM (
        SELECT
            rec.nombre,
            rec.nombre || ' (' ||
            TO_CHAR(SUM(EXTRACT(EPOCH FROM (res.termino_reserva - res.inicio_reserva)) / 3600), 'FM99')
            || 'HRS)' AS descripcion
        FROM Reserva res
        JOIN Recurso rec ON rec.id = res.recurso_id
        WHERE res.usuario_id = p_usuario_id
          AND res.estado_reserva_id = 3
          AND date_trunc('month', res.inicio_reserva) = date_trunc('month', p_fecha)
        GROUP BY rec.id, rec.nombre
    ) AS resumen;

    RETURN v_text;
END;
$$ LANGUAGE plpgsql;


-- 2. FUNCIÓN: Crear factura por usuario/mes
CREATE OR REPLACE FUNCTION reservas.fn_crear_factura_usuario_mes(
    p_usuario_id BIGINT,
    p_year INT,
    p_month INT
)
RETURNS BIGINT AS $$
DECLARE
    v_periodo DATE := make_date(p_year, p_month, 1);
    v_total BIGINT;
    v_numero BIGINT;
    v_estado_pendiente BIGINT;
    v_descripcion TEXT;
    v_id_factura BIGINT;
BEGIN
    SELECT id INTO v_id_factura
    FROM Factura
    WHERE usuario_id = p_usuario_id
      AND date_trunc('month', fecha_emision) = v_periodo;

    IF v_id_factura IS NOT NULL THEN
        RETURN v_id_factura;
    END IF;

    SELECT COALESCE(SUM(valor), 0)
    INTO v_total
    FROM Reserva
    WHERE usuario_id = p_usuario_id
      AND estado_reserva_id = 3
      AND date_trunc('month', inicio_reserva) = v_periodo;

    SELECT COALESCE(MAX(Numero_factura), 0) + 1
    INTO v_numero
    FROM Factura;

    SELECT id INTO v_estado_pendiente
    FROM Estado_Factura
    WHERE nombre = 'Pendiente';

    v_descripcion := reservas.fn_generar_descripcion_factura(p_usuario_id, v_periodo);

    INSERT INTO Factura (
        Numero_factura,
        Fecha_emision,
        Total,
        Usuario_id,
        Estado_factura_id,
        Descripcion
    )
    VALUES (
        v_numero,
        v_periodo,
        v_total,
        p_usuario_id,
        v_estado_pendiente,
        v_descripcion
    )
    RETURNING id INTO v_id_factura;

    RETURN v_id_factura;
END;
$$ LANGUAGE plpgsql;

-- 3. FUNCIÓN: Generar facturas para todos los usuarios clientes de un mes
CREATE OR REPLACE FUNCTION reservas.fn_generar_facturas_mes(
    p_year INT,
    p_month INT
)
RETURNS VOID AS $$
DECLARE
    r_user RECORD;
BEGIN
    FOR r_user IN 
        SELECT id
        FROM Usuario
        WHERE Tipo_usuario_id = 3
    LOOP
        PERFORM reservas.fn_crear_factura_usuario_mes(r_user.id, p_year, p_month);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ===========================================================
-- 6. FUNCIONES ETL
-- ===========================================================
-- 1. FUNCIÓN: Importar usuarios desde tabla staging
CREATE OR REPLACE FUNCTION reservas.fn_etl_importar_usuarios()
RETURNS VOID AS $$
BEGIN
    WITH datos_limpios AS (
        SELECT
            regexp_replace(Rut_raw, '[^0-9kK]', '', 'g') AS rut_limpio,
            Nombre,
            Password,
            Email,
            Estado_usuario_id,
            Tipo_usuario_id,
            Plan_id
        FROM Usuario_import
    )
    INSERT INTO Usuario (
        Rut,
        Nombre,
        Password,
        Email,
        Estado_usuario_id,
        Tipo_usuario_id,
        Plan_id
    )
    SELECT
        substring(rut_limpio FROM 1 FOR length(rut_limpio)-1)
        || '-' ||
        upper(substring(rut_limpio FROM length(rut_limpio) FOR 1)) AS Rut,
        Nombre,
        Password,
        Email,
        Estado_usuario_id,
        Tipo_usuario_id,
        Plan_id
    FROM datos_limpios;
END;
$$ LANGUAGE plpgsql;

-- ===========================================================
-- 7. TRIGGERS
-- ===========================================================

-- 1. TRIGGER: llama a fn_generar_facturas_mes con año/mes actuales
CREATE OR REPLACE FUNCTION reservas.trg_facturar_todos_mes_actual()
RETURNS TRIGGER AS $$
DECLARE
    v_year  INT := EXTRACT(YEAR  FROM CURRENT_DATE);
    v_month INT := EXTRACT(MONTH FROM CURRENT_DATE);
BEGIN
    PERFORM reservas.fn_generar_facturas_mes(v_year, v_month);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. TRIGGER: AL INSERTAR EN Control_Facturacion → FACTURAR A TODOS
CREATE TRIGGER tg_facturar_al_insertar
AFTER INSERT ON Control_Facturacion
FOR EACH ROW
EXECUTE FUNCTION reservas.trg_facturar_todos_mes_actual();