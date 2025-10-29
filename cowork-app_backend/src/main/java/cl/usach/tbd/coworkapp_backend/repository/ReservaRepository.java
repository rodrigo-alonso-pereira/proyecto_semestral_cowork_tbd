package cl.usach.tbd.coworkapp_backend.repository;
import cl.usach.tbd.coworkapp_backend.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByUsuarioId(Long usuarioId);
    List<Reserva> findByRecursoId(Long recursoId);
    List<Reserva> findByEstado(Boolean estado);
    List<Reserva> findByFechaReserva(LocalDate fechaReserva);
    @Query("SELECT r FROM Reserva r WHERE r.recurso.id = :recursoId AND r.fechaReserva = :fecha")
    List<Reserva> findByRecursoAndFecha(@Param("recursoId") Long recursoId, @Param("fecha") LocalDate fecha);
}
