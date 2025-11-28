package cl.usach.tbd.coworkapp_backend.controller;

import cl.usach.tbd.coworkapp_backend.dto.FacturaResponseDTO;
import cl.usach.tbd.coworkapp_backend.dto.FacturaUpdateEstadoDTO;
import cl.usach.tbd.coworkapp_backend.service.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/factura")
@CrossOrigin(origins = "*")
public class FacturaController {

    @Autowired
    private FacturaService facturaService;

    /**
     * GET /api/v1/factura
     * 1. Obtener todas las facturas
     */
    @GetMapping
    public ResponseEntity<List<FacturaResponseDTO>> getAllFacturas() {
        try {
            List<FacturaResponseDTO> facturas = facturaService.getAllFacturas();
            return ResponseEntity.ok(facturas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/factura/mes/{mes}/anio/{anio}
     * 2. Obtener todas las facturas por mes
     */
    @GetMapping("/mes/{mes}/anio/{anio}")
    public ResponseEntity<List<FacturaResponseDTO>> getFacturasByMes(
            @PathVariable int mes,
            @PathVariable int anio) {
        try {
            List<FacturaResponseDTO> facturas = facturaService.getFacturasByMes(mes, anio);
            return ResponseEntity.ok(facturas);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/factura/usuario/{usuarioId}
     * 3. Obtener todas las facturas por id usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<FacturaResponseDTO>> getFacturasByUsuarioId(@PathVariable Long usuarioId) {
        try {
            List<FacturaResponseDTO> facturas = facturaService.getFacturasByUsuarioId(usuarioId);
            return ResponseEntity.ok(facturas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/factura/usuario/{usuarioId}/mes/{mes}/anio/{anio}
     * 4. Obtener todas las facturas por id usuario por mes
     */
    @GetMapping("/usuario/{usuarioId}/mes/{mes}/anio/{anio}")
    public ResponseEntity<List<FacturaResponseDTO>> getFacturasByUsuarioIdAndMes(
            @PathVariable Long usuarioId,
            @PathVariable int mes,
            @PathVariable int anio) {
        try {
            List<FacturaResponseDTO> facturas = facturaService.getFacturasByUsuarioIdAndMes(usuarioId, mes, anio);
            return ResponseEntity.ok(facturas);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/factura/numero/{numeroFactura}
     * 5. Obtener factura por número
     */
    @GetMapping("/numero/{numeroFactura}")
    public ResponseEntity<FacturaResponseDTO> getFacturaByNumeroFactura(@PathVariable Long numeroFactura) {
        try {
            FacturaResponseDTO factura = facturaService.getFacturaByNumeroFactura(numeroFactura);
            return ResponseEntity.ok(factura);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PATCH /api/v1/factura/{id}/estado
     * 6. Actualizar estado de factura
     */
    @PatchMapping("/{id}/estado")
    public ResponseEntity<FacturaResponseDTO> updateEstadoFactura(
            @PathVariable Long id,
            @RequestBody FacturaUpdateEstadoDTO updateDTO) {
        try {
            FacturaResponseDTO factura = facturaService.updateEstadoFactura(id, updateDTO);
            return ResponseEntity.ok(factura);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

