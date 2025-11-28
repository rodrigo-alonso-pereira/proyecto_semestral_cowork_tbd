package cl.usach.tbd.coworkapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FacturaResponseDTO {
    private Long id;
    private Long numeroFactura;
    private LocalDate fechaEmision;
    private Long total;
    private String descripcion;
    private Long usuarioId;
    private String usuarioNombre;
    private Long estadoFacturaId;
    private String estadoFacturaNombre;
}

