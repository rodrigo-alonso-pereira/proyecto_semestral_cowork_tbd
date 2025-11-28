package cl.usach.tbd.coworkapp_backend.service;

import cl.usach.tbd.coworkapp_backend.dto.FacturaResponseDTO;
import cl.usach.tbd.coworkapp_backend.dto.FacturaUpdateEstadoDTO;
import cl.usach.tbd.coworkapp_backend.entity.EstadoFactura;
import cl.usach.tbd.coworkapp_backend.entity.Factura;
import cl.usach.tbd.coworkapp_backend.repository.EstadoFacturaRepository;
import cl.usach.tbd.coworkapp_backend.repository.FacturaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacturaService {

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private EstadoFacturaRepository estadoFacturaRepository;

    /**
     * 1. Obtener todas las facturas
     */
    @Transactional(readOnly = true)
    public List<FacturaResponseDTO> getAllFacturas() {
        return facturaRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * 2. Obtener todas las facturas por mes (mes y año)
     */
    @Transactional(readOnly = true)
    public List<FacturaResponseDTO> getFacturasByMes(int mes, int anio) {
        // Validar mes
        if (mes < 1 || mes > 12) {
            throw new RuntimeException("El mes debe estar entre 1 y 12");
        }

        // Validar año
        if (anio < 2000 || anio > 2100) {
            throw new RuntimeException("El año debe estar entre 2000 y 2100");
        }

        return facturaRepository.findByMesAndAnio(mes, anio).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * 3. Obtener todas las facturas por id usuario
     */
    @Transactional(readOnly = true)
    public List<FacturaResponseDTO> getFacturasByUsuarioId(Long usuarioId) {
        return facturaRepository.findByUsuarioId(usuarioId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * 4. Obtener todas las facturas por id usuario por mes
     */
    @Transactional(readOnly = true)
    public List<FacturaResponseDTO> getFacturasByUsuarioIdAndMes(Long usuarioId, int mes, int anio) {
        // Validar mes
        if (mes < 1 || mes > 12) {
            throw new RuntimeException("El mes debe estar entre 1 y 12");
        }

        // Validar año
        if (anio < 2000 || anio > 2100) {
            throw new RuntimeException("El año debe estar entre 2000 y 2100");
        }

        return facturaRepository.findByUsuarioIdAndMesAndAnio(usuarioId, mes, anio).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * 5. Obtener factura por número
     */
    @Transactional(readOnly = true)
    public FacturaResponseDTO getFacturaByNumeroFactura(Long numeroFactura) {
        Factura factura = facturaRepository.findByNumeroFactura(numeroFactura)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada con número: " + numeroFactura));

        return convertToResponseDTO(factura);
    }

    /**
     * 6. Actualizar estado de factura
     */
    @Transactional
    public FacturaResponseDTO updateEstadoFactura(Long id, FacturaUpdateEstadoDTO updateDTO) {
        Factura factura = facturaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada con id: " + id));

        // Validar que el estado de factura exista
        if (updateDTO.getEstadoFacturaId() == null) {
            throw new RuntimeException("El estado de factura es obligatorio");
        }

        EstadoFactura estadoFactura = estadoFacturaRepository.findById(updateDTO.getEstadoFacturaId())
                .orElseThrow(() -> new RuntimeException("Estado de factura no encontrado con id: " + updateDTO.getEstadoFacturaId()));

        factura.setEstadoFactura(estadoFactura);
        Factura updatedFactura = facturaRepository.save(factura);

        return convertToResponseDTO(updatedFactura);
    }

    /**
     * Convertir entidad Factura a DTO
     */
    private FacturaResponseDTO convertToResponseDTO(Factura factura) {
        FacturaResponseDTO dto = new FacturaResponseDTO();
        dto.setId(factura.getId());
        dto.setNumeroFactura(factura.getNumeroFactura());
        dto.setFechaEmision(factura.getFechaEmision());
        dto.setTotal(factura.getTotal());
        dto.setDescripcion(factura.getDescripcion());
        dto.setUsuarioId(factura.getUsuario().getId());
        dto.setUsuarioNombre(factura.getUsuario().getNombre());
        dto.setEstadoFacturaId(factura.getEstadoFactura().getId());
        dto.setEstadoFacturaNombre(factura.getEstadoFactura().getNombre());
        return dto;
    }
}

