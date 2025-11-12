package cl.usach.tbd.coworkapp_backend.service;

import cl.usach.tbd.coworkapp_backend.dto.RecursoCreateDTO;
import cl.usach.tbd.coworkapp_backend.dto.RecursoResponseDTO;
import cl.usach.tbd.coworkapp_backend.dto.RecursoUpdateDTO;
import cl.usach.tbd.coworkapp_backend.entity.EstadoRecurso;
import cl.usach.tbd.coworkapp_backend.entity.Recurso;
import cl.usach.tbd.coworkapp_backend.entity.TipoRecurso;
import cl.usach.tbd.coworkapp_backend.repository.EstadoRecursoRepository;
import cl.usach.tbd.coworkapp_backend.repository.RecursoRepository;
import cl.usach.tbd.coworkapp_backend.repository.TipoRecursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecursoService {

    @Autowired
    private RecursoRepository recursoRepository;

    @Autowired
    private TipoRecursoRepository tipoRecursoRepository;

    @Autowired
    private EstadoRecursoRepository estadoRecursoRepository;

    @Transactional(readOnly = true)
    public List<RecursoResponseDTO> getAllRecursos() {
        return recursoRepository.findAll().stream()
                .filter(this::isNotDeleted)
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RecursoResponseDTO getRecursoById(Long id) {
        Recurso recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con id: " + id));

        if (!isNotDeleted(recurso)) {
            throw new RuntimeException("Recurso 'Eliminado' con id: " + id);
        }

        return convertToResponseDTO(recurso);
    }

    @Transactional
    public RecursoResponseDTO createRecurso(RecursoCreateDTO createDTO) {
        // Validaciones
        if (createDTO.getNombre() == null || createDTO.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre del recurso es obligatorio");
        }

        if (createDTO.getPrecio() == null || createDTO.getPrecio() < 0) {
            throw new RuntimeException("El precio debe ser mayor o igual a 0");
        }

        if (createDTO.getCapacidad() == null || createDTO.getCapacidad() <= 0) {
            throw new RuntimeException("La capacidad debe ser mayor a 0");
        }

        TipoRecurso tipoRecurso = tipoRecursoRepository.findById(createDTO.getTipoRecursoId())
                .orElseThrow(() -> new RuntimeException("Tipo de recurso no encontrado con id: " + createDTO.getTipoRecursoId()));

        EstadoRecurso estadoRecurso = estadoRecursoRepository.findById(createDTO.getEstadoRecursoId())
                .orElseThrow(() -> new RuntimeException("Estado de recurso no encontrado con id: " + createDTO.getEstadoRecursoId()));

        Recurso recurso = new Recurso();
        recurso.setNombre(createDTO.getNombre().trim());
        recurso.setPrecio(createDTO.getPrecio());
        recurso.setCapacidad(createDTO.getCapacidad());
        recurso.setTipoRecurso(tipoRecurso);
        recurso.setEstadoRecurso(estadoRecurso);

        Recurso savedRecurso = recursoRepository.save(recurso);
        return convertToResponseDTO(savedRecurso);
    }

    @Transactional
    public RecursoResponseDTO updateRecurso(Long id, RecursoUpdateDTO updateDTO) {
        Recurso recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con id: " + id));

        if (updateDTO.getNombre() != null && !updateDTO.getNombre().trim().isEmpty()) {
            recurso.setNombre(updateDTO.getNombre().trim());
        }

        if (updateDTO.getPrecio() != null) {
            if (updateDTO.getPrecio() < 0) {
                throw new RuntimeException("El precio debe ser mayor o igual a 0");
            }
            recurso.setPrecio(updateDTO.getPrecio());
        }

        if (updateDTO.getCapacidad() != null) {
            if (updateDTO.getCapacidad() <= 0) {
                throw new RuntimeException("La capacidad debe ser mayor a 0");
            }
            recurso.setCapacidad(updateDTO.getCapacidad());
        }

        if (updateDTO.getTipoRecursoId() != null) {
            TipoRecurso tipoRecurso = tipoRecursoRepository.findById(updateDTO.getTipoRecursoId())
                    .orElseThrow(() -> new RuntimeException("Tipo de recurso no encontrado con id: " + updateDTO.getTipoRecursoId()));
            recurso.setTipoRecurso(tipoRecurso);
        }

        if (updateDTO.getEstadoRecursoId() != null) {
            EstadoRecurso estadoRecurso = estadoRecursoRepository.findById(updateDTO.getEstadoRecursoId())
                    .orElseThrow(() -> new RuntimeException("Estado de recurso no encontrado con id: " + updateDTO.getEstadoRecursoId()));
            recurso.setEstadoRecurso(estadoRecurso);
        }

        Recurso updatedRecurso = recursoRepository.save(recurso);
        return convertToResponseDTO(updatedRecurso);
    }

    @Transactional
    public RecursoResponseDTO deleteRecurso(Long id) {
        Recurso recurso = recursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado con id: " + id));

        // Borrado lógico: cambiar el estado a "Eliminado"
        EstadoRecurso estadoEliminado = estadoRecursoRepository.findByNombre("Eliminado")
                .orElseThrow(() -> new RuntimeException("Estado 'Eliminado' no encontrado en la base de datos"));

        recurso.setEstadoRecurso(estadoEliminado);
        Recurso updatedRecurso = recursoRepository.save(recurso);

        return convertToResponseDTO(updatedRecurso);
    }

    @Transactional(readOnly = true)
    public List<RecursoResponseDTO> getRecursosByTipoRecursoId(Long tipoRecursoId) {
        return recursoRepository.findByTipoRecursoId(tipoRecursoId).stream()
                .filter(this::isNotDeleted)
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecursoResponseDTO> getRecursosByEstadoRecursoId(Long estadoRecursoId) {
        return recursoRepository.findByEstadoRecursoId(estadoRecursoId).stream()
                .filter(this::isNotDeleted)
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecursoResponseDTO> getRecursosByNombre(String nombre) {
        return recursoRepository.findByNombreContainingIgnoreCase(nombre).stream()
                .filter(this::isNotDeleted)
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RecursoResponseDTO> getRecursosByCapacidad(Integer capacidad) {
        return recursoRepository.findByCapacidadGreaterThanEqual(capacidad).stream()
                .filter(this::isNotDeleted)
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Valida que el recurso no esté en estado "Eliminado"
     */
    private boolean isNotDeleted(Recurso recurso) {
        return !recurso.getEstadoRecurso().getNombre().equalsIgnoreCase("Eliminado");
    }

    private RecursoResponseDTO convertToResponseDTO(Recurso recurso) {
        RecursoResponseDTO dto = new RecursoResponseDTO();
        dto.setId(recurso.getId());
        dto.setNombre(recurso.getNombre());
        dto.setPrecio(recurso.getPrecio());
        dto.setCapacidad(recurso.getCapacidad());
        dto.setTipoRecursoId(recurso.getTipoRecurso().getId());
        dto.setTipoRecursoNombre(recurso.getTipoRecurso().getNombre());
        dto.setEstadoRecursoId(recurso.getEstadoRecurso().getId());
        dto.setEstadoRecursoNombre(recurso.getEstadoRecurso().getNombre());
        return dto;
    }
}

