package cl.usach.tbd.coworkapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecursoResponseDTO {
    private Long id;
    private String nombre;
    private Long precio;
    private Integer capacidad;
    private Long tipoRecursoId;
    private String tipoRecursoNombre;
    private Long estadoRecursoId;
    private String estadoRecursoNombre;
}

