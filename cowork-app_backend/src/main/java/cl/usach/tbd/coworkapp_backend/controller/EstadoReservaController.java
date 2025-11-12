package cl.usach.tbd.coworkapp_backend.controller;

import cl.usach.tbd.coworkapp_backend.dto.EstadoReservaResponseDTO;
import cl.usach.tbd.coworkapp_backend.service.EstadoReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/estado-reserva")
@CrossOrigin(origins = "*")
public class EstadoReservaController {

    @Autowired
    private EstadoReservaService estadoReservaService;

    @GetMapping
    public ResponseEntity<List<EstadoReservaResponseDTO>> getAllEstadosReserva() {
        try {
            List<EstadoReservaResponseDTO> estadosReserva = estadoReservaService.getAllEstadosReserva();
            return ResponseEntity.ok(estadosReserva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstadoReservaResponseDTO> getEstadoReservaById(@PathVariable Long id) {
        try {
            EstadoReservaResponseDTO estadoReserva = estadoReservaService.getEstadoReservaById(id);
            return ResponseEntity.ok(estadoReserva);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

