package cl.usach.tbd.coworkapp_backend.controller;

import cl.usach.tbd.coworkapp_backend.dto.TipoUsuarioResponseDTO;
import cl.usach.tbd.coworkapp_backend.service.TipoUsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tipo-usuario")
@CrossOrigin(origins = "*")
public class TipoUsuarioController {

    @Autowired
    private TipoUsuarioService tipoUsuarioService;

    @GetMapping
    public ResponseEntity<List<TipoUsuarioResponseDTO>> getAllTiposUsuario() {
        try {
            List<TipoUsuarioResponseDTO> tiposUsuario = tipoUsuarioService.getAllTiposUsuario();
            return ResponseEntity.ok(tiposUsuario);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoUsuarioResponseDTO> getTipoUsuarioById(@PathVariable Long id) {
        try {
            TipoUsuarioResponseDTO tipoUsuario = tipoUsuarioService.getTipoUsuarioById(id);
            return ResponseEntity.ok(tipoUsuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

