package cl.usach.tbd.coworkapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlanCreateDTO {
    private String nombre;
    private Long precioMensual;
    private Integer tiempoIncluido;
    private Boolean activo;
}

