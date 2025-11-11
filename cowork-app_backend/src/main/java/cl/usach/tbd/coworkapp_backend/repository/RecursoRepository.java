package cl.usach.tbd.coworkapp_backend.repository;

import cl.usach.tbd.coworkapp_backend.entity.Recurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecursoRepository extends JpaRepository<Recurso, Long> {
    List<Recurso> findByTipoRecursoId(Long tipoRecursoId);

    List<Recurso> findByEstadoRecursoId(Long estadoRecursoId);

    List<Recurso> findByNombreContainingIgnoreCase(String nombre);

    List<Recurso> findByPrecioBetween(Long precioMin, Long precioMax);

    List<Recurso> findByCapacidadGreaterThanEqual(Integer capacidad);
}
