package cl.usach.tbd.coworkapp_backend.controller;

import cl.usach.tbd.coworkapp_backend.dto.EstadoUsuarioResponseDTO;
import cl.usach.tbd.coworkapp_backend.service.EstadoUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/estado-usuario")
@CrossOrigin(origins = "*")
public class EstadoUsuarioController {

    @Autowired
    private EstadoUsuarioService estadoUsuarioService;

    @GetMapping
    public ResponseEntity<List<EstadoUsuarioResponseDTO>> getAllEstadosUsuario() {
        try {
            List<EstadoUsuarioResponseDTO> estadosUsuario = estadoUsuarioService.getAllEstadosUsuario();
            return ResponseEntity.ok(estadosUsuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstadoUsuarioResponseDTO> getEstadoUsuarioById(@PathVariable Long id) {
        try {
            EstadoUsuarioResponseDTO estadoUsuario = estadoUsuarioService.getEstadoUsuarioById(id);
            return ResponseEntity.ok(estadoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

