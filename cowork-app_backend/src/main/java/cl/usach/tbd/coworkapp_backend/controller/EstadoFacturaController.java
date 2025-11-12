package cl.usach.tbd.coworkapp_backend.controller;

import cl.usach.tbd.coworkapp_backend.dto.EstadoFacturaResponseDTO;
import cl.usach.tbd.coworkapp_backend.service.EstadoFacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/estado-factura")
@CrossOrigin(origins = "*")
public class EstadoFacturaController {

    @Autowired
    private EstadoFacturaService estadoFacturaService;

    @GetMapping
    public ResponseEntity<List<EstadoFacturaResponseDTO>> getAllEstadosFactura() {
        try {
            List<EstadoFacturaResponseDTO> estadosFactura = estadoFacturaService.getAllEstadosFactura();
            return ResponseEntity.ok(estadosFactura);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstadoFacturaResponseDTO> getEstadoFacturaById(@PathVariable Long id) {
        try {
            EstadoFacturaResponseDTO estadoFactura = estadoFacturaService.getEstadoFacturaById(id);
            return ResponseEntity.ok(estadoFactura);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

