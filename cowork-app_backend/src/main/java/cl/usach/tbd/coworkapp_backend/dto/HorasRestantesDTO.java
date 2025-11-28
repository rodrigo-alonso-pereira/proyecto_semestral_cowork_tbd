package cl.usach.tbd.coworkapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HorasRestantesDTO {
    private String nombreUsuario;
    private String emailUsuario;
    private String nombrePlan;
    private Integer horasIncluidas;
    private Long horasUsadas;
    private Long horasRestantes;
}

