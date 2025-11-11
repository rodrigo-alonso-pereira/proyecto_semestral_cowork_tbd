package cl.usach.tbd.coworkapp_backend.dto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaResponseDTO {
    private Long id;
    private LocalDateTime inicioReserva;
    private LocalDateTime terminoReserva;
    private LocalDate fechaCreacion;
    private Long valor;
    private Long usuarioId;
    private String usuarioNombre;
    private Long recursoId;
    private String recursoNombre;
    private Long estadoReservaId;
    private String estadoReservaNombre;
}
