package cl.usach.tbd.coworkapp_backend.service;

import cl.usach.tbd.coworkapp_backend.dto.EstadoReservaResponseDTO;
import cl.usach.tbd.coworkapp_backend.entity.EstadoReserva;
import cl.usach.tbd.coworkapp_backend.repository.EstadoReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstadoReservaService {

    @Autowired
    private EstadoReservaRepository estadoReservaRepository;

    @Transactional(readOnly = true)
    public List<EstadoReservaResponseDTO> getAllEstadosReserva() {
        return estadoReservaRepository.findAll().stream()
                .filter(this::isActive)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EstadoReservaResponseDTO getEstadoReservaById(Long id) {
        EstadoReserva estadoReserva = estadoReservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estado de reserva no encontrado con id: " + id));

        if (!isActive(estadoReserva)) {
            throw new RuntimeException("Estado de reserva no activo con id: " + id);
        }

        return convertToDTO(estadoReserva);
    }

    /**
     * Valida que el estado de reserva esté activo
     */
    private boolean isActive(EstadoReserva estadoReserva) {
        return estadoReserva.getActivo();
    }

    private EstadoReservaResponseDTO convertToDTO(EstadoReserva estadoReserva) {
        EstadoReservaResponseDTO dto = new EstadoReservaResponseDTO();
        dto.setId(estadoReserva.getId());
        dto.setNombre(estadoReserva.getNombre());
        return dto;
    }
}

