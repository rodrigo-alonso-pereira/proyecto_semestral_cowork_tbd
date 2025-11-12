package cl.usach.tbd.coworkapp_backend.service;

import cl.usach.tbd.coworkapp_backend.dto.TipoUsuarioResponseDTO;
import cl.usach.tbd.coworkapp_backend.entity.TipoUsuario;
import cl.usach.tbd.coworkapp_backend.repository.TipoUsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TipoUsuarioService {

    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;

    @Transactional(readOnly = true)
    public List<TipoUsuarioResponseDTO> getAllTiposUsuario() {
        return tipoUsuarioRepository.findAll().stream()
                .filter(this::isActive)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TipoUsuarioResponseDTO getTipoUsuarioById(Long id) {
        TipoUsuario tipoUsuario = tipoUsuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de usuario no encontrado con id: " + id));

        if (!isActive(tipoUsuario)) {
            throw new RuntimeException("Tipo de usuario no activo con id: " + id);
        }

        return convertToDTO(tipoUsuario);
    }

    /**
     * Valida que el tipo de usuario esté activo
     */
    private boolean isActive(TipoUsuario tipoUsuario) {
        return !tipoUsuario.getNombre().equalsIgnoreCase("Eliminado");
    }

    private TipoUsuarioResponseDTO convertToDTO(TipoUsuario tipoUsuario) {
        TipoUsuarioResponseDTO dto = new TipoUsuarioResponseDTO();
        dto.setId(tipoUsuario.getId());
        dto.setNombre(tipoUsuario.getNombre());
        return dto;
    }
}

