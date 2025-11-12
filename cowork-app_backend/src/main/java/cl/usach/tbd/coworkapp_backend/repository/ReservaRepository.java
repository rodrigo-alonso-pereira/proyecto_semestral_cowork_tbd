package cl.usach.tbd.coworkapp_backend.repository;
import cl.usach.tbd.coworkapp_backend.entity.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByUsuarioId(Long usuarioId);

    List<Reserva> findByRecursoId(Long recursoId);

    List<Reserva> findByEstadoReservaId(Long estadoReservaId);
    
    List<Reserva> findByFechaCreacion(LocalDate fechaCreacion);
    
    @Query("SELECT r FROM Reserva r WHERE DATE(r.inicioReserva) = :fecha OR DATE(r.terminoReserva) = :fecha")
    List<Reserva> findByFechaReserva(@Param("fecha") LocalDate fecha);
    
    @Query("SELECT r FROM Reserva r WHERE r.recurso.id = :recursoId " +
           "AND DATE(r.inicioReserva) = :fecha")
    List<Reserva> findByRecursoAndFecha(@Param("recursoId") Long recursoId, 
                                         @Param("fecha") LocalDate fecha);

    @Query("SELECT r FROM Reserva r WHERE r.recurso.id = :recursoId " +
           "AND r.inicioReserva < :fin AND r.terminoReserva > :inicio")
    List<Reserva> findConflictingReservas(@Param("recursoId") Long recursoId,
                                          @Param("inicio") LocalDateTime inicio,
                                          @Param("fin") LocalDateTime fin);
}
