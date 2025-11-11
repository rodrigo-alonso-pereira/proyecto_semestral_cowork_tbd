package cl.usach.tbd.coworkapp_backend.repository;

import cl.usach.tbd.coworkapp_backend.entity.EstadoRecurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoRecursoRepository extends JpaRepository<EstadoRecurso, Long> {
    Optional<EstadoRecurso> findByNombre(String nombre);
}

