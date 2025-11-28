package cl.usach.tbd.coworkapp_backend.controller;

import cl.usach.tbd.coworkapp_backend.dto.PlanCreateDTO;
import cl.usach.tbd.coworkapp_backend.dto.PlanResponseDTO;
import cl.usach.tbd.coworkapp_backend.dto.PlanUpdateDTO;
import cl.usach.tbd.coworkapp_backend.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/plan")
@CrossOrigin(origins = "*")
public class PlanController {

    @Autowired
    private PlanService planService;

    /**
     * GET /api/v1/plan
     * Obtener todos los planes activos
     */
    @GetMapping
    public ResponseEntity<List<PlanResponseDTO>> getAllPlanes() {
        try {
            List<PlanResponseDTO> planes = planService.getAllPlanes();
            return ResponseEntity.ok(planes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/plan/{id}
     * Obtener un plan por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PlanResponseDTO> getPlanById(@PathVariable Long id) {
        try {
            PlanResponseDTO plan = planService.getPlanById(id);
            return ResponseEntity.ok(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/v1/plan
     * Crear un nuevo plan
     */
    @PostMapping
    public ResponseEntity<PlanResponseDTO> createPlan(@RequestBody PlanCreateDTO createDTO) {
        try {
            PlanResponseDTO plan = planService.createPlan(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /api/v1/plan/{id}
     * Actualizar un plan existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<PlanResponseDTO> updatePlan(
            @PathVariable Long id,
            @RequestBody PlanUpdateDTO updateDTO) {
        try {
            PlanResponseDTO plan = planService.updatePlan(id, updateDTO);
            return ResponseEntity.ok(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /api/v1/plan/{id}
     * Eliminar un plan (borrado lógico - cambia activo a false)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<PlanResponseDTO> deletePlan(@PathVariable Long id) {
        try {
            PlanResponseDTO plan = planService.deletePlan(id);
            return ResponseEntity.ok(plan);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/plan/nombre/{nombre}
     * Obtener plan por nombre
     */
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<PlanResponseDTO>> getPlanByNombre(@PathVariable String nombre) {
        try {
            List<PlanResponseDTO> planes = planService.getPlanByNombre(nombre);
            return ResponseEntity.ok(planes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

