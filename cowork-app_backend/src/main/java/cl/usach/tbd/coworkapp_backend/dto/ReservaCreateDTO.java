package cl.usach.tbd.coworkapp_backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaCreateDTO {
    private LocalDateTime inicioReserva;
    private LocalDateTime terminoReserva;
    private Long valor;
    private Long usuarioId;
    private Long recursoId;
    private Long estadoReservaId;
}
