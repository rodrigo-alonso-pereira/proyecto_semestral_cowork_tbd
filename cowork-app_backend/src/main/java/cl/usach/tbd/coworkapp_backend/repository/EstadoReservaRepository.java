package cl.usach.tbd.coworkapp_backend.repository;

import cl.usach.tbd.coworkapp_backend.entity.EstadoReserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoReservaRepository extends JpaRepository<EstadoReserva, Long> {
    Optional<EstadoReserva> findByNombre(String nombre);
}

