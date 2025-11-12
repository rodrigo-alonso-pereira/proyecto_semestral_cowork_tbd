package cl.usach.tbd.coworkapp_backend.service;

import cl.usach.tbd.coworkapp_backend.dto.EstadoRecursoResponseDTO;
import cl.usach.tbd.coworkapp_backend.entity.EstadoRecurso;
import cl.usach.tbd.coworkapp_backend.repository.EstadoRecursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstadoRecursoService {

    @Autowired
    private EstadoRecursoRepository estadoRecursoRepository;

    @Transactional(readOnly = true)
    public List<EstadoRecursoResponseDTO> getAllEstadosRecurso() {
        return estadoRecursoRepository.findAll().stream()
                .filter(this::isActive)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EstadoRecursoResponseDTO getEstadoRecursoById(Long id) {
        EstadoRecurso estadoRecurso = estadoRecursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estado de recurso no encontrado con id: " + id));

        if (!isActive(estadoRecurso)) {
            throw new RuntimeException("Estado de recurso no activo con id: " + id);
        }

        return convertToDTO(estadoRecurso);
    }

    /**
     * Valida que el estado de recurso esté activo
     */
    private boolean isActive(EstadoRecurso estadoRecurso) {
        return !estadoRecurso.getNombre().equalsIgnoreCase("Eliminado");
    }

    private EstadoRecursoResponseDTO convertToDTO(EstadoRecurso estadoRecurso) {
        EstadoRecursoResponseDTO dto = new EstadoRecursoResponseDTO();
        dto.setId(estadoRecurso.getId());
        dto.setNombre(estadoRecurso.getNombre());
        return dto;
    }
}

