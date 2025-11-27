package cl.usach.tbd.coworkapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private Long id;
    private String nombre;
    private String email;
    private Long tipoUsuarioId;
    private String tipoUsuarioNombre;
    private Long planId;
    private String planNombre;
}

