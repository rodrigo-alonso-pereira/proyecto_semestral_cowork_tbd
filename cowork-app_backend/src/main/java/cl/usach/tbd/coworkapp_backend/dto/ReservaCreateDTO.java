package cl.usach.tbd.coworkapp_backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaCreateDTO {
    private LocalTime horaInicio;
    private LocalTime horaTermino;
    private LocalDate fechaReserva;
    private Long valorReserva;
    private Long usuarioId;
    private Long recursoId;
}
