package cl.usach.tbd.coworkapp_backend.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "estado_recurso", schema = "reservas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstadoRecurso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "nombre", nullable = false, unique = true, length = 200)
    private String nombre;
}
