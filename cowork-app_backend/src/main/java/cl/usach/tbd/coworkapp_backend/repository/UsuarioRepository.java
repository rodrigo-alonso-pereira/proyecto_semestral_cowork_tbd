package cl.usach.tbd.coworkapp_backend.repository;

import cl.usach.tbd.coworkapp_backend.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByRut(String rut);

    Optional<Usuario> findByEmail(String email);

    List<Usuario> findByEstadoUsuarioId(Long estadoUsuarioId);

    List<Usuario> findByTipoUsuarioId(Long tipoUsuarioId);

    List<Usuario> findByPlanId(Long planId);

    List<Usuario> findByNombreContainingIgnoreCase(String nombre);
}
