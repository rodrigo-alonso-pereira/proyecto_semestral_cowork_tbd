package cl.usach.tbd.coworkapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecursoUpdateDTO {
    private String nombre;
    private Long precio;
    private Integer capacidad;
    private Long tipoRecursoId;
    private Long estadoRecursoId;
}

