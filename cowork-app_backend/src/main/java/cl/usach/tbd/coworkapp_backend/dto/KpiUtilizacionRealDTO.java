package cl.usach.tbd.coworkapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KpiUtilizacionRealDTO {
    private String mes;
    private Integer horasReservadasTotal;
    private Integer horasPosibles;
    private Float porcentajeUtilizacion;
}

