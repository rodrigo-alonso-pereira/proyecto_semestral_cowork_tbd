package cl.usach.tbd.coworkapp_backend.service;

import cl.usach.tbd.coworkapp_backend.dto.EstadoUsuarioResponseDTO;
import cl.usach.tbd.coworkapp_backend.entity.EstadoUsuario;
import cl.usach.tbd.coworkapp_backend.repository.EstadoUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstadoUsuarioService {

    @Autowired
    private EstadoUsuarioRepository estadoUsuarioRepository;

    @Transactional(readOnly = true)
    public List<EstadoUsuarioResponseDTO> getAllEstadosUsuario() {
        return estadoUsuarioRepository.findAll().stream()
                .filter(this::isActive)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EstadoUsuarioResponseDTO getEstadoUsuarioById(Long id) {
        EstadoUsuario estadoUsuario = estadoUsuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estado de usuario no encontrado con id: " + id));

        if (!isActive(estadoUsuario)) {
            throw new RuntimeException("Estado de usuario no activo con id: " + id);
        }

        return convertToDTO(estadoUsuario);
    }

    /**
     * Valida que el estado de usuario esté activo
     */
    private boolean isActive(EstadoUsuario estadoUsuario) {
        return !estadoUsuario.getNombre().equalsIgnoreCase("Eliminado");
    }

    private EstadoUsuarioResponseDTO convertToDTO(EstadoUsuario estadoUsuario) {
        EstadoUsuarioResponseDTO dto = new EstadoUsuarioResponseDTO();
        dto.setId(estadoUsuario.getId());
        dto.setNombre(estadoUsuario.getNombre());
        return dto;
    }
}

