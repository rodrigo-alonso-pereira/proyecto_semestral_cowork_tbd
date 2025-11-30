SET search_path TO reservas;

----------------------------------------------------------
-- KPI 1: Nuevos clientes por mes
-- Fórmula: cuenta cuántos clientes tienen su PRIMER estado = 'Activo'
--          dentro del rango indicado.
----------------------------------------------------------

CREATE OR REPLACE VIEW kpi_nuevos_clientes_base AS
WITH estados_cliente AS (
    SELECT
        heu.Usuario_id,
        heu.Estado_usuario_id,
        heu.Fecha_cambio_estado,
        ROW_NUMBER() OVER (
            PARTITION BY heu.Usuario_id
            ORDER BY heu.Fecha_cambio_estado
        ) AS orden_cambio
    FROM Historial_Estado_Usuario heu
    JOIN Usuario u ON u.Id = heu.Usuario_id
    JOIN Tipo_Usuario tu ON tu.Id = u.Tipo_usuario_id
    WHERE tu.Nombre = 'Cliente'
)
SELECT
    e.Usuario_id,
    e.Fecha_cambio_estado AS fecha_primer_estado_activo
FROM estados_cliente e
JOIN Estado_Usuario eu ON eu.Id = e.Estado_usuario_id
WHERE e.orden_cambio = 1
  AND eu.Nombre = 'Activo';


CREATE OR REPLACE FUNCTION kpi_nuevos_clientes_mes(
    fecha_inicio DATE,
    fecha_fin    DATE
)
RETURNS TABLE(nuevos_clientes INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT COUNT(*)::int
    FROM kpi_nuevos_clientes_base
    WHERE fecha_primer_estado_activo BETWEEN fecha_inicio AND fecha_fin;
END;
$$ LANGUAGE plpgsql;


----------------------------------------------------------
-- KPI 2: Utilización real de recursos
-- Fórmula:
--   horas_reservadas_total = SUM(horas reservadas de todas las reservas completadas)
--   horas_posibles         = (días hábiles del rango) * 12
--   porcentaje_utilizacion = (horas_reservadas_total / horas_posibles) * 100
----------------------------------------------------------

CREATE OR REPLACE VIEW kpi_reservas_reales AS
SELECT
    res.Id AS reserva_id,
    res.Inicio_reserva,
    res.Termino_reserva,
    EXTRACT(EPOCH FROM (res.Termino_reserva - res.Inicio_reserva)) / 3600.0
        AS horas_reservadas
FROM Reserva res
WHERE res.estado_reserva_id = 3;  -- solo reservas "Completadas"


CREATE OR REPLACE FUNCTION kpi_utilizacion_real(
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
        SELECT d::date
        FROM generate_series(fecha_inicio, fecha_fin, interval '1 day') d
        WHERE EXTRACT(DOW FROM d) BETWEEN 1 AND 5  -- lunes a viernes
    ),
    horas_posibles_cte AS (
        SELECT (COUNT(*) * 12)::numeric AS horas
        FROM dias
    ),
    horas_reservadas_cte AS (
        SELECT COALESCE(SUM(horas_reservadas),0)::numeric AS horas
        FROM kpi_reservas_reales
        WHERE Inicio_reserva::date BETWEEN fecha_inicio AND fecha_fin
    )
    SELECT
        horas_reservadas_cte.horas,
        horas_posibles_cte.horas,
        CASE
            WHEN horas_posibles_cte.horas = 0 THEN 0
            ELSE ROUND(
                (horas_reservadas_cte.horas / horas_posibles_cte.horas) * 100,
                2
            )
        END
    FROM horas_reservadas_cte, horas_posibles_cte;
END;
$$ LANGUAGE plpgsql;


----------------------------------------------------------
-- KPI 3: Churn rate
-- Fórmula:
--   clientes_que_se_fueron    = clientes que pasaron de Activo → (Inactivo/Suspendido)
--   clientes_activos_inicio  = clientes en estado Activo al inicio del periodo
--   churn_rate                = (clientes_que_se_fueron / clientes_activos_inicio) * 100
----------------------------------------------------------

CREATE OR REPLACE VIEW kpi_cambios_estado AS
SELECT
    heu.Usuario_id,
    heu.Estado_usuario_id,
    heu.Fecha_cambio_estado,
    LAG(heu.Estado_usuario_id) OVER (
        PARTITION BY heu.Usuario_id
        ORDER BY heu.Fecha_cambio_estado
    ) AS estado_anterior
FROM Historial_Estado_Usuario heu;


CREATE OR REPLACE FUNCTION kpi_churn_rate(
    fecha_inicio DATE,
    fecha_fin    DATE
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
        FROM estado_usuario
    ),
    activos AS (
        SELECT COUNT(*)::int AS total
        FROM usuario u
        JOIN estado_usuario eu ON eu.id = u.estado_usuario_id
        WHERE eu.nombre = 'Activo'
    ),
    bajas AS (
        SELECT DISTINCT e.usuario_id
        FROM kpi_cambios_estado e
        CROSS JOIN ids i
        WHERE e.fecha_cambio_estado BETWEEN fecha_inicio AND fecha_fin
          AND e.estado_anterior = i.id_activo
          AND e.Estado_usuario_id IN (i.id_inactivo, i.id_suspendido)
    )
    SELECT
        (SELECT COUNT(*)::int FROM bajas),
        (SELECT total FROM activos),
        CASE
            WHEN (SELECT total FROM activos) = 0 THEN 0
            ELSE ROUND(
                ((SELECT COUNT(*)::numeric FROM bajas)
                    /
                NULLIF((SELECT total FROM activos)::numeric,0)) * 100,
                2
            )
        END;
END;
$$ LANGUAGE plpgsql;
