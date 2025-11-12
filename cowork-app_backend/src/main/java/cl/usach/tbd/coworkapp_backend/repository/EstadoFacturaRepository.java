package cl.usach.tbd.coworkapp_backend.repository;

import cl.usach.tbd.coworkapp_backend.entity.EstadoFactura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoFacturaRepository extends JpaRepository<EstadoFactura, Long> {
    Optional<EstadoFactura> findByNombre(String nombre);
}

