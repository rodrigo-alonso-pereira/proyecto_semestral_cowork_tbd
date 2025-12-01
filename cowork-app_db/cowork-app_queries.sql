--  COWORK-APP - QUERIES SQL

SET search_path TO reservas;

-- ===========================================================
-- 1. KPIs - SELECT
-- ===========================================================

-- 1.1 Nuevos clientes en un período
SELECT * 
FROM kpi_nuevos_clientes_mes('2025-11-01', '2025-11-30');

-- 1.2 Utilización real en un período
SELECT *
FROM kpi_utilizacion_real('2025-11-01', '2025-11-30');

-- 1.3 Tasa de churn en un período
SELECT *
FROM kpi_churn_rate('2025-11-01', '2025-11-30');

-- 1.4 Horas reservadas reales por reserva (vista base)
SELECT *
FROM kpi_reservas_reales
ORDER BY reserva_id;

-- 1.5 Cambios de estado de usuario (vista base)
SELECT *
FROM kpi_cambios_estado
ORDER BY usuario_id, fecha_cambio_estado;

-- ===========================================================
-- 2. FUNCIONES DE FACTURACIÓN
-- ===========================================================

-- 2.1 Generar todas las facturas del mes para todos los clientes
SELECT fn_generar_facturas_mes(2025, 11);

-- 2.2 (Opcional) Generar facturas llamando a Control_Facturacion
/* También se pueden crear las facturas  llamando a la 
función Control_Facturacion con DEFAULT VALUES, lo cual
ejecuta la generación de facturas para el mes actual, dejando un timestamp de cuándo se ejecutó por última vez. */
INSERT INTO Control_Facturacion DEFAULT VALUES;

-- ===========================================================
-- Queries antiguas

select *
from estado_factura;
select *
from estado_reserva;
select *
from estado_recurso;
select *
from estado_usuario;
select *
from tipo_recurso;
select *
from tipo_usuario;
select * from plan;
select * from factura;
select * from historial_estado_usuario;
select * from usuario;
select * from recurso;
select * from reserva;

WITH tiempo_usado AS
         (select COALESCE(sum(extract(hour from (r.termino_reserva - r.inicio_reserva)))) as horas_usadas
          from reserva r
          where r.usuario_id = 4
            and EXTRACT(MONTH FROM r.inicio_reserva) = 11
            and EXTRACT(YEAR FROM r.inicio_reserva) = 2025
            and r.estado_reserva_id IN (1, 3))
SELECT u.nombre                              AS nombre_usuario,
       u.email                               AS email_usuario,
       p.nombre                              AS nombre_plan,
       p.tiempo_incluido                     AS horas_incluidas,
       tu.horas_usadas                       AS horas_usadas,
       (p.tiempo_incluido - tu.horas_usadas) AS horas_restantes
FROM usuario u
         join plan p on u.plan_id = p.id
         cross join tiempo_usado tu
WHERE u.id = 4;

WITH tiempo_usado AS (
    SELECT COALESCE(SUM(EXTRACT(HOUR FROM (r.termino_reserva - r.inicio_reserva))), 0) as horas_usadas
    FROM reserva r
    WHERE r.usuario_id = :usuarioId
      AND EXTRACT(MONTH FROM r.inicio_reserva) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM r.inicio_reserva) = EXTRACT(YEAR FROM CURRENT_DATE)
      AND r.estado_reserva_id IN (1, 3)
)
SELECT u.nombre AS nombre_usuario,
       u.email AS email_usuario,
       p.nombre AS nombre_plan,
       p.tiempo_incluido AS horas_incluidas,
       tu.horas_usadas,
       (p.tiempo_incluido - tu.horas_usadas) AS horas_restantes
FROM usuario u
         JOIN plan p ON u.plan_id = p.id
         CROSS JOIN tiempo_usado tu
WHERE u.id = :usuarioId;

-- Duración total de reservas del usuario 4 en noviembre de 2025
select
    --r.id as reserva_id,
    sum(extract(hour from (r.termino_reserva - r.inicio_reserva))) as duracion_horas
--r.usuario_id as usuario_id,
--r.estado_reserva_id as estado_reserva_id
from reserva r
where r.usuario_id = 4
  and EXTRACT(MONTH FROM r.inicio_reserva) = 11
  and EXTRACT(YEAR FROM r.inicio_reserva) = 2025
  and (r.estado_reserva_id = 3 or r.estado_reserva_id = 1);

-- 1. Usuarios con Plan y Horas Restantes (Asumiendo que Tiempo_usado se actualiza)
SELECT u.Nombre                             AS Cliente,
       u.Email,
       p.Nombre                             AS Nombre_Plan,
       p.Precio_mensual,
       (p.Tiempo_incluido - p.Tiempo_usado) AS Horas_Restantes
FROM Usuario u
         JOIN
     Plan p ON u.Plan_id = p.Id
         JOIN
     Tipo_Usuario tu ON u.Tipo_usuario_id = tu.Id
WHERE tu.Nombre = 'Cliente'
  AND u.Estado_usuario_id = 1
ORDER BY Horas_Restantes DESC;


-- 4. Reservas de Hoy por Tipo de Recurso
SELECT tr.Nombre AS Tipo_Recurso,
       r.Nombre  AS Recurso_Reservado,
       u.Nombre  AS Cliente,
       res.Hora_inicio,
       res.Hora_termino
FROM Reserva res
         JOIN
     Recurso r ON res.Recurso_id = r.Id
         JOIN
     Tipo_Recurso tr ON r.Tipo_recurso_id = tr.Id
         JOIN
     Usuario u ON res.Usuario_id = u.Id
WHERE res.Fecha_reserva = CURRENT_DATE
  AND res.Estado = TRUE
ORDER BY tr.Nombre, res.Hora_inicio;