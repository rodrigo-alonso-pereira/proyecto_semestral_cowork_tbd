SET search_path TO reservas;

-- 1. FUNCIÓN: Generar descripción de factura
CREATE OR REPLACE FUNCTION fn_generar_descripcion_factura(
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
            TO_CHAR(SUM(EXTRACT(EPOCH FROM (res.termino_reserva - res.inicio_reserva)) / 3600), 'FM99') || 'HRS)' AS descripcion
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
CREATE OR REPLACE FUNCTION fn_crear_factura_usuario_mes(
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
    -- Si YA EXISTE FACTURA para ese mes → no crear otra
    SELECT id INTO v_id_factura
    FROM Factura
    WHERE usuario_id = p_usuario_id
      AND date_trunc('month', fecha_emision) = v_periodo;

    IF v_id_factura IS NOT NULL THEN
        RETURN v_id_factura;
    END IF;

    -- Total del mes
    SELECT COALESCE(SUM(valor), 0)
    INTO v_total
    FROM Reserva
    WHERE usuario_id = p_usuario_id
      AND estado_reserva_id = 3
      AND date_trunc('month', inicio_reserva) = v_periodo;

    -- Numeración continua desde 1
    SELECT COALESCE(MAX(Numero_factura), 0) + 1
    INTO v_numero
    FROM Factura;

    -- Estado Pendiente
    SELECT id INTO v_estado_pendiente
    FROM Estado_Factura
    WHERE nombre = 'Pendiente';

    -- Descripción
    v_descripcion := fn_generar_descripcion_factura(p_usuario_id, v_periodo);

    -- Insertar factura
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

-- TRIGGER AL COMPLETAR RESERVA (COMENTADO YA QUE AHORA SE USA MENSUAL)
/* -- 3. TRIGGER: al completar reserva → generar factura
CREATE OR REPLACE FUNCTION trg_actualizar_factura_reserva()
RETURNS TRIGGER AS $$
DECLARE
    v_year INT;
    v_month INT;
BEGIN
    IF NEW.estado_reserva_id = 3 THEN
        v_year := EXTRACT(YEAR FROM NEW.inicio_reserva);
        v_month := EXTRACT(MONTH FROM NEW.inicio_reserva);

        PERFORM fn_crear_factura_usuario_mes(NEW.usuario_id, v_year, v_month);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER tg_reserva_completada_factura
AFTER UPDATE ON Reserva
FOR EACH ROW
WHEN (OLD.estado_reserva_id IS DISTINCT FROM NEW.estado_reserva_id)
EXECUTE FUNCTION trg_actualizar_factura_reserva(); */


-- 4. FUNCIÓN: generar facturas para todos los clientes de un mes específico
CREATE OR REPLACE FUNCTION fn_generar_facturas_mes(
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
        WHERE Tipo_usuario_id = 3  -- Clientes
    LOOP
        PERFORM fn_crear_factura_usuario_mes(r_user.id, p_year, p_month);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 5. FUNCIÓN: llama a fn_generar_facturas_mes con año/mes actuales
CREATE OR REPLACE FUNCTION trg_facturar_todos_mes_actual()
RETURNS TRIGGER AS $$
DECLARE
    v_year  INT := EXTRACT(YEAR  FROM CURRENT_DATE);
    v_month INT := EXTRACT(MONTH FROM CURRENT_DATE);
BEGIN
    PERFORM fn_generar_facturas_mes(v_year, v_month);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. TRIGGER: AL INSERTAR EN Control_Facturacion → FACTURAR A TODOS
CREATE TRIGGER tg_facturar_al_insertar
AFTER INSERT ON Control_Facturacion
FOR EACH ROW
EXECUTE FUNCTION trg_facturar_todos_mes_actual();

-- 7. ETL: Importar usuarios desde CSV, limpiando el RUT (sin guión)

/*  Proceso de importación:
    Se sube un archivo CSV desde el panel admin
    El backend ejecuta: 
        TRUNCATE TABLE Usuario_import;
    Luego hace el COPY:
        COPY Usuario_import (Rut_raw, Nombre, Password, Email, Estado_usuario_id, Tipo_usuario_id, Plan_id)
        FROM '/cowork-app_db/raw.csv'
        CSV HEADER;
        SELECT fn_etl_importar_usuarios();
    Listo: los usuarios quedan cargados, con el RUT corregido. 
*/
CREATE OR REPLACE FUNCTION fn_etl_importar_usuarios()
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