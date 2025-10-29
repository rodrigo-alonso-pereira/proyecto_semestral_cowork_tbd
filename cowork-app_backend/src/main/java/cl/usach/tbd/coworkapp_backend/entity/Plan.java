package cl.usach.tbd.coworkapp_backend.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "plan", schema = "reservas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;
    @Column(name = "precio_mensual", nullable = false)
    private Long precioMensual;
    @Column(name = "tiempo_incluido", nullable = false)
    private Integer tiempoIncluido;
    @Column(name = "tiempo_usado")
    private Integer tiempoUsado = 0;
}
