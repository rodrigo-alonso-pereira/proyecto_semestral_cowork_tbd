package cl.usach.tbd.coworkapp_backend.service;

import cl.usach.tbd.coworkapp_backend.dto.TipoRecursoResponseDTO;
import cl.usach.tbd.coworkapp_backend.entity.TipoRecurso;
import cl.usach.tbd.coworkapp_backend.repository.TipoRecursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TipoRecursoService {

    @Autowired
    private TipoRecursoRepository tipoRecursoRepository;

    @Transactional(readOnly = true)
    public List<TipoRecursoResponseDTO> getAllTiposRecurso() {
        return tipoRecursoRepository.findAll().stream()
                .filter(this::isActive)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TipoRecursoResponseDTO getTipoRecursoById(Long id) {
        TipoRecurso tipoRecurso = tipoRecursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de recurso no encontrado con id: " + id));

        if (!isActive(tipoRecurso)) {
            throw new RuntimeException("Tipo de recurso no activo con id: " + id);
        }

        return convertToDTO(tipoRecurso);
    }

    /**
     * Valida que el tipo de recurso esté activo
     */
    private boolean isActive(TipoRecurso tipoRecurso) {
        return !tipoRecurso.getNombre().equalsIgnoreCase("Eliminado");
    }

    private TipoRecursoResponseDTO convertToDTO(TipoRecurso tipoRecurso) {
        TipoRecursoResponseDTO dto = new TipoRecursoResponseDTO();
        dto.setId(tipoRecurso.getId());
        dto.setNombre(tipoRecurso.getNombre());
        return dto;
    }
}

