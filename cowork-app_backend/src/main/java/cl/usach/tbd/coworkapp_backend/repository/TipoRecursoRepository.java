package cl.usach.tbd.coworkapp_backend.repository;

import cl.usach.tbd.coworkapp_backend.entity.TipoRecurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TipoRecursoRepository extends JpaRepository<TipoRecurso, Long> {
    Optional<TipoRecurso> findByNombre(String nombre);
}

