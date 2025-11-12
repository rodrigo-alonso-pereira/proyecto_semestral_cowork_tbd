package cl.usach.tbd.coworkapp_backend.controller;

import cl.usach.tbd.coworkapp_backend.dto.RecursoCreateDTO;
import cl.usach.tbd.coworkapp_backend.dto.RecursoResponseDTO;
import cl.usach.tbd.coworkapp_backend.dto.RecursoUpdateDTO;
import cl.usach.tbd.coworkapp_backend.service.RecursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recurso")
@CrossOrigin(origins = "*")
public class RecursoController {

    @Autowired
    private RecursoService recursoService;

    /**
     * GET /api/v1/recurso
     * Obtener todos los recursos
     */
    @GetMapping
    public ResponseEntity<List<RecursoResponseDTO>> getAllRecursos() {
        try {
            List<RecursoResponseDTO> recursos = recursoService.getAllRecursos();
            return ResponseEntity.ok(recursos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/recurso/{id}
     * Obtener un recurso por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<RecursoResponseDTO> getRecursoById(@PathVariable Long id) {
        try {
            RecursoResponseDTO recurso = recursoService.getRecursoById(id);
            return ResponseEntity.ok(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/v1/recurso
     * Crear un nuevo recurso
     */
    @PostMapping
    public ResponseEntity<RecursoResponseDTO> createRecurso(@RequestBody RecursoCreateDTO createDTO) {
        try {
            RecursoResponseDTO recurso = recursoService.createRecurso(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /api/v1/recurso/{id}
     * Actualizar un recurso existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<RecursoResponseDTO> updateRecurso(
            @PathVariable Long id,
            @RequestBody RecursoUpdateDTO updateDTO) {
        try {
            RecursoResponseDTO recurso = recursoService.updateRecurso(id, updateDTO);
            return ResponseEntity.ok(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /api/v1/recurso/{id}
     * Eliminar un recurso (borrado lógico - cambia estado a "Eliminado")
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<RecursoResponseDTO> deleteRecurso(@PathVariable Long id) {
        try {
            RecursoResponseDTO recurso = recursoService.deleteRecurso(id);
            return ResponseEntity.ok(recurso);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/recurso/tipo/{tipoRecursoId}
     * Obtener recursos por tipo de recurso
     */
    @GetMapping("/tipo/{tipoRecursoId}")
    public ResponseEntity<List<RecursoResponseDTO>> getRecursosByTipoRecursoId(@PathVariable Long tipoRecursoId) {
        try {
            List<RecursoResponseDTO> recursos = recursoService.getRecursosByTipoRecursoId(tipoRecursoId);
            return ResponseEntity.ok(recursos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/recurso/estado/{estadoRecursoId}
     * Obtener recursos por estado de recurso
     */
    @GetMapping("/estado/{estadoRecursoId}")
    public ResponseEntity<List<RecursoResponseDTO>> getRecursosByEstadoRecursoId(@PathVariable Long estadoRecursoId) {
        try {
            List<RecursoResponseDTO> recursos = recursoService.getRecursosByEstadoRecursoId(estadoRecursoId);
            return ResponseEntity.ok(recursos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/recurso/nombre/{nombre}
     * Buscar recursos por nombre (búsqueda parcial, case-insensitive)
     */
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<RecursoResponseDTO>> getRecursosByNombre(@PathVariable String nombre) {
        try {
            List<RecursoResponseDTO> recursos = recursoService.getRecursosByNombre(nombre);
            return ResponseEntity.ok(recursos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/recurso/capacidad/{capacidad}
     * Obtener recursos con capacidad mayor o igual a la especificada
     */
    @GetMapping("/capacidad/{capacidad}")
    public ResponseEntity<List<RecursoResponseDTO>> getRecursosByCapacidad(@PathVariable Integer capacidad) {
        try {
            List<RecursoResponseDTO> recursos = recursoService.getRecursosByCapacidad(capacidad);
            return ResponseEntity.ok(recursos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

