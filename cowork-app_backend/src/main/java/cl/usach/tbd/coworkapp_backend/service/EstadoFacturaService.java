package cl.usach.tbd.coworkapp_backend.service;

import cl.usach.tbd.coworkapp_backend.dto.EstadoFacturaResponseDTO;
import cl.usach.tbd.coworkapp_backend.entity.EstadoFactura;
import cl.usach.tbd.coworkapp_backend.repository.EstadoFacturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EstadoFacturaService {

    @Autowired
    private EstadoFacturaRepository estadoFacturaRepository;

    @Transactional(readOnly = true)
    public List<EstadoFacturaResponseDTO> getAllEstadosFactura() {
        return estadoFacturaRepository.findAll().stream()
                .filter(this::isActive)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EstadoFacturaResponseDTO getEstadoFacturaById(Long id) {
        EstadoFactura estadoFactura = estadoFacturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estado de factura no encontrado con id: " + id));

        if (!isActive(estadoFactura)) {
            throw new RuntimeException("Estado de factura no activo con id: " + id);
        }

        return convertToDTO(estadoFactura);
    }

    /**
     * Valida que el estado de factura esté activo
     */
    private boolean isActive(EstadoFactura estadoFactura) {
        return estadoFactura.getActivo();
    }

    private EstadoFacturaResponseDTO convertToDTO(EstadoFactura estadoFactura) {
        EstadoFacturaResponseDTO dto = new EstadoFacturaResponseDTO();
        dto.setId(estadoFactura.getId());
        dto.setNombre(estadoFactura.getNombre());
        return dto;
    }
}

