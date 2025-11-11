package cl.usach.tbd.coworkapp_backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "historial_estado_usuario", schema = "reservas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialEstadoUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "fecha_cambio_estado", nullable = false)
    private LocalDate fechaCambioEstado = LocalDate.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_usuario_id", nullable = false)
    private EstadoUsuario estadoUsuario;
}

