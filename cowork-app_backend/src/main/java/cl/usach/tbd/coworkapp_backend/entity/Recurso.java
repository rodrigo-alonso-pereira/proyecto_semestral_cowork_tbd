package cl.usach.tbd.coworkapp_backend.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "recurso", schema = "reservas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recurso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;
    @Column(name = "precio", nullable = false)
    private Long precio;
    @Column(name = "capacidad", nullable = false)
    private Integer capacidad;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_recurso_id", nullable = false)
    private TipoRecurso tipoRecurso;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_recurso_id", nullable = false)
    private EstadoRecurso estadoRecurso;
}
