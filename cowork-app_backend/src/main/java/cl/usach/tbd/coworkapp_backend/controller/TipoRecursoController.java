package cl.usach.tbd.coworkapp_backend.controller;

import cl.usach.tbd.coworkapp_backend.dto.TipoRecursoResponseDTO;
import cl.usach.tbd.coworkapp_backend.service.TipoRecursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tipo-recurso")
@CrossOrigin(origins = "*")
public class TipoRecursoController {

    @Autowired
    private TipoRecursoService tipoRecursoService;

    @GetMapping
    public ResponseEntity<List<TipoRecursoResponseDTO>> getAllTiposRecurso() {
        try {
            List<TipoRecursoResponseDTO> tiposRecurso = tipoRecursoService.getAllTiposRecurso();
            return ResponseEntity.ok(tiposRecurso);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoRecursoResponseDTO> getTipoRecursoById(@PathVariable Long id) {
        try {
            TipoRecursoResponseDTO tipoRecurso = tipoRecursoService.getTipoRecursoById(id);
            return ResponseEntity.ok(tipoRecurso);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

