package cl.usach.tbd.coworkapp_backend.controller;
import cl.usach.tbd.coworkapp_backend.dto.ReservaCreateDTO;
import cl.usach.tbd.coworkapp_backend.dto.ReservaResponseDTO;
import cl.usach.tbd.coworkapp_backend.dto.ReservaUpdateDTO;
import cl.usach.tbd.coworkapp_backend.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
@RestController
@RequestMapping("/api/v1/reserva")
@CrossOrigin(origins = "*")
public class ReservaController {
    @Autowired
    private ReservaService reservaService;
    /**
     * GET /api/v1/reserva
     * Obtener todas las reservas
     */
    @GetMapping
    public ResponseEntity<List<ReservaResponseDTO>> getAllReservas() {
        try {
            List<ReservaResponseDTO> reservas = reservaService.getAllReservas();
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /**
     * GET /api/v1/reserva/{id}
     * Obtener una reserva por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> getReservaById(@PathVariable Long id) {
        try {
            ReservaResponseDTO reserva = reservaService.getReservaById(id);
            return ResponseEntity.ok(reserva);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /**
     * POST /api/v1/reserva
     * Crear una nueva reserva
     */
    @PostMapping
    public ResponseEntity<ReservaResponseDTO> createReserva(@RequestBody ReservaCreateDTO createDTO) {
        try {
            ReservaResponseDTO reserva = reservaService.createReserva(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(reserva);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /**
     * PUT /api/v1/reserva/{id}
     * Actualizar una reserva existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ReservaResponseDTO> updateReserva(
            @PathVariable Long id,
            @RequestBody ReservaUpdateDTO updateDTO) {
        try {
            ReservaResponseDTO reserva = reservaService.updateReserva(id, updateDTO);
            return ResponseEntity.ok(reserva);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /**
     * DELETE /api/v1/reserva/{id}
     * Eliminar una reserva
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReserva(@PathVariable Long id) {
        try {
            reservaService.deleteReserva(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /**
     * GET /api/v1/reserva/usuario/{usuarioId}
     * Obtener reservas por usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ReservaResponseDTO>> getReservasByUsuarioId(@PathVariable Long usuarioId) {
        try {
            List<ReservaResponseDTO> reservas = reservaService.getReservasByUsuarioId(usuarioId);
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /**
     * GET /api/v1/reserva/recurso/{recursoId}
     * Obtener reservas por recurso
     */
    @GetMapping("/recurso/{recursoId}")
    public ResponseEntity<List<ReservaResponseDTO>> getReservasByRecursoId(@PathVariable Long recursoId) {
        try {
            List<ReservaResponseDTO> reservas = reservaService.getReservasByRecursoId(recursoId);
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /**
     * GET /api/v1/reserva/estado/{estado}
     * Obtener reservas por estado (true=activas, false=inactivas)
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<ReservaResponseDTO>> getReservasByEstado(@PathVariable Boolean estado) {
        try {
            List<ReservaResponseDTO> reservas = reservaService.getReservasByEstado(estado);
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /**
     * GET /api/v1/reserva/fecha/{fecha}
     * Obtener reservas por fecha (formato: yyyy-MM-dd)
     */
    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<ReservaResponseDTO>> getReservasByFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        try {
            List<ReservaResponseDTO> reservas = reservaService.getReservasByFecha(fecha);
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
