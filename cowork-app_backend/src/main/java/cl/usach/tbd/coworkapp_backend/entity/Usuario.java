package cl.usach.tbd.coworkapp_backend.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "usuario", schema = "reservas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "rut", nullable = false, unique = true, length = 30)
    private String rut;
    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;
    @Column(name = "password", nullable = false, length = 200)
    private String password;
    @Column(name = "email", nullable = false, unique = true, length = 200)
    private String email;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_usuario_id", nullable = false)
    private EstadoUsuario estadoUsuario;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_usuario_id", nullable = false)
    private TipoUsuario tipoUsuario;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id")
    private Plan plan;
}
