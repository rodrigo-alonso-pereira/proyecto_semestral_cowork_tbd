package cl.usach.tbd.coworkapp_backend.controller;

import cl.usach.tbd.coworkapp_backend.dto.PlanResponseDTO;
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

    @GetMapping
    public ResponseEntity<List<PlanResponseDTO>> getAllPlanes() {
        try {
            List<PlanResponseDTO> planes = planService.getAllPlanes();
            return ResponseEntity.ok(planes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

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
}

