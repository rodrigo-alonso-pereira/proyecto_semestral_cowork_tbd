package cl.usach.tbd.coworkapp_backend.repository;

import cl.usach.tbd.coworkapp_backend.entity.HistorialEstadoUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialEstadoUsuarioRepository extends JpaRepository<HistorialEstadoUsuario, Long> {
    List<HistorialEstadoUsuario> findByUsuarioIdOrderByFechaCambioEstadoDesc(Long usuarioId);
}

