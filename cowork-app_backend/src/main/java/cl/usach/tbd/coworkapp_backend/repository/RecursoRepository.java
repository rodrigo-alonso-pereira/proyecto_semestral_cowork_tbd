package cl.usach.tbd.coworkapp_backend.repository;
import cl.usach.tbd.coworkapp_backend.entity.Recurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface RecursoRepository extends JpaRepository<Recurso, Long> {
}
