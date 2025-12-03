package cl.usach.tbd.coworkapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KpiChurnRateDTO {
    private String mes;
    private Integer clientesAbandonaron;
    private Integer clientesActivos;
    private Float churnRate;
}

