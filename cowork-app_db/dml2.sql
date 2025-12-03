-----------------------------------------------------------------------
-- DML.SQL
-- Población completa de datos dummy para entorno de desarrollo
-- Incluye:
--   • Catálogos base
--   • 100 usuarios cliente
--   • Historial realista (activo, inactivo, suspendido, reactivado)
--   • Reservas reales (solo 2025)
--
-- Este archivo se debe ejecutar ANTES de pruebas de backend/frontend.
-----------------------------------------------------------------------

SET search_path TO reservas;

-----------------------------------------------------------------------
-- 0. LIMPIEZA (en orden seguro)
-----------------------------------------------------------------------
TRUNCATE TABLE
    Reserva,
    Historial_Estado_Usuario,
    Usuario
RESTART IDENTITY CASCADE;

-----------------------------------------------------------------------
-- 1. CATÁLOGOS BASE (NO MODIFICAR)
-----------------------------------------------------------------------

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

-- Recursos base (IDs garantizados del 1 al 15)
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

-----------------------------------------------------------------------
-- 2. USUARIOS + HISTORIAL + RESERVAS 2025 (AUTOGENERADO)
-----------------------------------------------------------------------

DO $$
DECLARE
    i                INT;
    v_user_id        BIGINT;
    v_fecha_creacion DATE;
    v_mes            INT;
    v_dia            INT;
    v_plan_id        INT;
    v_rut            TEXT;
    v_nombre         TEXT;
    v_email          TEXT;

    v_num_res        INT;
    k                INT;
    v_base_month     INT;
    v_target_month   INT;
    v_base_day       INT;
    v_res_date       DATE;
    v_dow            INT;
    v_inicio         INT;
    v_duracion       INT;
    v_termino        INT;
    v_valor          BIGINT;
    v_recurso_id     INT;
BEGIN
    FOR i IN 1..100 LOOP

        -------------------------------------------------------------------
        -- FECHA DE CREACIÓN (distribución realista por cuatrimestres)
        -------------------------------------------------------------------
        IF i <= 20 THEN
            IF i <= 7 THEN v_mes := 1;
            ELSIF i <= 13 THEN v_mes := 2;
            ELSE v_mes := 3;
            END IF;
        ELSIF i <= 50 THEN
            IF i <= 30 THEN v_mes := 4;
            ELSIF i <= 40 THEN v_mes := 5;
            ELSE v_mes := 6;
            END IF;
        ELSIF i <= 75 THEN
            IF i <= 60 THEN v_mes := 7;
            ELSIF i <= 68 THEN v_mes := 8;
            ELSE v_mes := 9;
            END IF;
        ELSE
            IF i <= 85 THEN v_mes := 10;
            ELSIF i <= 93 THEN v_mes := 11;
            ELSE v_mes := 12;
            END IF;
        END IF;

        v_dia := 5 + (i % 20);
        IF v_dia > 28 THEN v_dia := 28; END IF;

        v_fecha_creacion := make_date(2025, v_mes, v_dia);

        -------------------------------------------------------------------
        -- USUARIO
        -------------------------------------------------------------------
        v_rut    := lpad(i::text, 8, '0') || '-' || (i % 10)::text;
        v_nombre := format('Cliente %s', lpad(i::text, 3, '0'));
        v_email  := format('cliente%s@mail.com', lpad(i::text, 3, '0'));
        v_plan_id := (i % 4) + 1;

        INSERT INTO Usuario (
            Rut, Nombre, Password, Email,
            Fecha_creacion, Estado_usuario_id, Tipo_usuario_id, Plan_id
        )
        VALUES (
            v_rut, v_nombre, 'pwd', v_email,
            v_fecha_creacion, 1, 3, v_plan_id
        )
        RETURNING Id INTO v_user_id;

        INSERT INTO Historial_Estado_Usuario VALUES (v_user_id, 1, v_fecha_creacion);

        -------------------------------------------------------------------
        -- CHURN / SUSPENSIONES / REACTIVACIONES
        -------------------------------------------------------------------
        IF (i % 4) = 0 THEN
            INSERT INTO Historial_Estado_Usuario VALUES (v_user_id, 2, v_fecha_creacion + INTERVAL '60 days');

        ELSIF (i % 6) = 0 THEN
            INSERT INTO Historial_Estado_Usuario VALUES (v_user_id, 3, v_fecha_creacion + INTERVAL '90 days');

        ELSIF (i % 10) = 0 THEN
            INSERT INTO Historial_Estado_Usuario VALUES (v_user_id, 3, v_fecha_creacion + INTERVAL '60 days');
            INSERT INTO Historial_Estado_Usuario VALUES (v_user_id, 1, v_fecha_creacion + INTERVAL '90 days');
        END IF;

        -------------------------------------------------------------------
        -- RESERVAS 2025
        -------------------------------------------------------------------
        IF (i % 5) = 4 THEN
            v_num_res := 0;
        ELSIF (i % 5) = 3 THEN
            v_num_res := 2;
        ELSIF (i % 5) IN (1, 2) THEN
            v_num_res := 4;
        ELSE
            v_num_res := 8;
        END IF;

        v_base_month := v_mes;

        FOR k IN 0..v_num_res-1 LOOP

            v_target_month := v_base_month + (k / 2);
            IF v_target_month > 12 THEN EXIT; END IF;

            v_base_day := 5 + (10*k) % 20;
            IF v_base_day > 25 THEN v_base_day := 25; END IF;

            v_res_date := make_date(2025, v_target_month, v_base_day);

            v_dow := EXTRACT(DOW FROM v_res_date);
            IF v_dow = 6 THEN v_res_date := v_res_date + INTERVAL '2 days';
            ELSIF v_dow = 0 THEN v_res_date := v_res_date + INTERVAL '1 day';
            END IF;

            IF v_res_date < v_fecha_creacion THEN
                v_res_date := v_fecha_creacion;
                v_dow := EXTRACT(DOW FROM v_res_date);
                IF v_dow = 6 THEN v_res_date := v_res_date + INTERVAL '2 days';
                ELSIF v_dow = 0 THEN v_res_date := v_res_date + INTERVAL '1 day';
                END IF;
            END IF;

            v_inicio   := 9 + ((i + k*2) % 9);
            v_duracion := 1 + ((i + k) % 4);
            v_termino  := v_inicio + v_duracion;
            IF v_termino > 21 THEN v_termino := 21; END IF;

            v_valor      := (v_termino - v_inicio) * 5000;
            v_recurso_id := ((i + k) % 15) + 1;

            INSERT INTO Reserva (
                Inicio_reserva,
                Termino_reserva,
                Fecha_creacion,
                Valor,
                Usuario_id,
                Recurso_id,
                Estado_reserva_id
            )
            VALUES (
                v_res_date::timestamp + (v_inicio  || ' hours')::interval,
                v_res_date::timestamp + (v_termino || ' hours')::interval,
                v_res_date::date,
                v_valor,
                v_user_id,
                v_recurso_id,
                3
            );
        END LOOP;
    END LOOP;
END $$;

-----------------------------------------------------------------------
-- FIN DEL DML
-----------------------------------------------------------------------
