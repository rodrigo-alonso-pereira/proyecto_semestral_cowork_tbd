select * from recurso;
select * from estado_recurso;
select * from tipo_recurso;
select * from reserva;
select * from usuario;
select * from tipo_usuario;

-- 1. Usuarios con Plan y Horas Restantes (Asumiendo que Tiempo_usado se actualiza)
SELECT
    u.Nombre AS Cliente,
    u.Email,
    p.Nombre AS Nombre_Plan,
    p.Precio_mensual,
    (p.Tiempo_incluido - p.Tiempo_usado) AS Horas_Restantes
FROM
    Usuario u
JOIN
    Plan p ON u.Plan_id = p.Id
JOIN
    Tipo_Usuario tu ON u.Tipo_usuario_id = tu.Id
WHERE
    tu.Nombre = 'Cliente'
    AND u.Estado_usuario_id = 1
ORDER BY
    Horas_Restantes DESC;


-- 4. Reservas de Hoy por Tipo de Recurso
SELECT
    tr.Nombre AS Tipo_Recurso,
    r.Nombre AS Recurso_Reservado,
    u.Nombre AS Cliente,
    res.Hora_inicio,
    res.Hora_termino
FROM
    Reserva res
JOIN
    Recurso r ON res.Recurso_id = r.Id
JOIN
    Tipo_Recurso tr ON r.Tipo_recurso_id = tr.Id
JOIN
    Usuario u ON res.Usuario_id = u.Id
WHERE
    res.Fecha_reserva = CURRENT_DATE
    AND res.Estado = TRUE
ORDER BY
    tr.Nombre, res.Hora_inicio;