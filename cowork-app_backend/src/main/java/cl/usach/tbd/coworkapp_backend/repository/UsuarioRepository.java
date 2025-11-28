package cl.usach.tbd.coworkapp_backend.repository;

import cl.usach.tbd.coworkapp_backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByRut(String rut);

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByEstadoUsuarioId(Long estadoUsuarioId);

    List<Usuario> findByTipoUsuarioId(Long tipoUsuarioId);

    List<Usuario> findByPlanId(Long planId);

    List<Usuario> findByNombreContainingIgnoreCase(String nombre);

    @Query(value = """
        WITH tiempo_usado AS (
            SELECT COALESCE(SUM(EXTRACT(HOUR FROM (r.termino_reserva - r.inicio_reserva))), 0) as horas_usadas
            FROM reservas.reserva r
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
        FROM reservas.usuario u
        JOIN reservas.plan p ON u.plan_id = p.id
        CROSS JOIN tiempo_usado tu
        WHERE u.id = :usuarioId
        """, nativeQuery = true)
    Optional<Map<String, Object>> findHorasRestantesMesActual(@Param("usuarioId") Long usuarioId);
}


