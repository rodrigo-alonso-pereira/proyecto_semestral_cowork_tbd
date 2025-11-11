package cl.usach.tbd.coworkapp_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioUpdateDTO {
    private String nombre;
    private String password;
    private String email;
    private Long estadoUsuarioId;
    private Long tipoUsuarioId;
    private Long planId;
}

