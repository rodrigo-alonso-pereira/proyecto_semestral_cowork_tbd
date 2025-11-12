package cl.usach.tbd.coworkapp_backend.controller;

import cl.usach.tbd.coworkapp_backend.dto.EstadoRecursoResponseDTO;
import cl.usach.tbd.coworkapp_backend.service.EstadoRecursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/estado-recurso")
@CrossOrigin(origins = "*")
public class EstadoRecursoController {

    @Autowired
    private EstadoRecursoService estadoRecursoService;

    @GetMapping
    public ResponseEntity<List<EstadoRecursoResponseDTO>> getAllEstadosRecurso() {
        try {
            List<EstadoRecursoResponseDTO> estadosRecurso = estadoRecursoService.getAllEstadosRecurso();
            return ResponseEntity.ok(estadosRecurso);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstadoRecursoResponseDTO> getEstadoRecursoById(@PathVariable Long id) {
        try {
            EstadoRecursoResponseDTO estadoRecurso = estadoRecursoService.getEstadoRecursoById(id);
            return ResponseEntity.ok(estadoRecurso);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

