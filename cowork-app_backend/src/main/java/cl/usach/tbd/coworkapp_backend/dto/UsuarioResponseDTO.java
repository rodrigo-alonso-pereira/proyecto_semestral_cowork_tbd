package cl.usach.tbd.coworkapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponseDTO {
    private Long id;
    private String rut;
    private String nombre;
    private String email;
    private Long estadoUsuarioId;
    private String estadoUsuarioNombre;
    private Long tipoUsuarioId;
    private String tipoUsuarioNombre;
    private Long planId;
    private String planNombre;
}

