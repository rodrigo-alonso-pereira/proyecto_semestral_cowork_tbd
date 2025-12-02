package cl.usach.tbd.coworkapp_backend.controller;

import cl.usach.tbd.coworkapp_backend.dto.KpiNuevosClientesMesDTO;
import cl.usach.tbd.coworkapp_backend.dto.KpiUtilizacionRealDTO;
import cl.usach.tbd.coworkapp_backend.dto.KpiChurnRateDTO;
import cl.usach.tbd.coworkapp_backend.service.KpiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/kpi")
@CrossOrigin(origins = "*")
public class KpiController {

    @Autowired
    private KpiService kpiService;

    /**
     * GET /api/v1/kpi/nuevos-clientes/mes/{yearMonth}
     * Obtener nuevos clientes de un mes específico
     * @param yearMonth formato "yyyy-MM" (ejemplo: "2025-11")
     */
    @GetMapping("/nuevos-clientes/mes/{yearMonth}")
    public ResponseEntity<KpiNuevosClientesMesDTO> getNuevosClientesPorMes(@PathVariable String yearMonth) {
        try {
            KpiNuevosClientesMesDTO resultado = kpiService.getNuevosClientesPorMes(yearMonth);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/kpi/nuevos-clientes/anio/{year}
     * Obtener nuevos clientes de todos los meses de un año
     * @param year formato "yyyy" (ejemplo: "2025")
     */
    @GetMapping("/nuevos-clientes/anio/{year}")
    public ResponseEntity<List<KpiNuevosClientesMesDTO>> getNuevosClientesPorAnio(@PathVariable String year) {

        try {
            List<KpiNuevosClientesMesDTO> resultado = kpiService.getNuevosClientesPorAnio(year);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/kpi/utilizacion-real/mes/{yearMonth}
     * Obtener utilización real de recursos de un mes específico
     * @param yearMonth formato "yyyy-MM" (ejemplo: "2025-11")
     */
    @GetMapping("/utilizacion-real/mes/{yearMonth}")
    public ResponseEntity<KpiUtilizacionRealDTO> getUtilizacionRealPorMes(@PathVariable String yearMonth) {
        try {
            KpiUtilizacionRealDTO resultado = kpiService.getUtilizacionRealPorMes(yearMonth);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/kpi/utilizacion-real/anio/{year}
     * Obtener utilización real de recursos de todos los meses de un año
     * @param year formato "yyyy" (ejemplo: "2025")
     */
    @GetMapping("/utilizacion-real/anio/{year}")
    public ResponseEntity<List<KpiUtilizacionRealDTO>> getUtilizacionRealPorAnio(@PathVariable String year) {
        try {
            List<KpiUtilizacionRealDTO> resultado = kpiService.getUtilizacionRealPorAnio(year);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/kpi/churn-rate/mes/{yearMonth}
     * Obtener tasa de churn de un mes específico
     * @param yearMonth formato "yyyy-MM" (ejemplo: "2025-11")
     */
    @GetMapping("/churn-rate/mes/{yearMonth}")
    public ResponseEntity<KpiChurnRateDTO> getChurnRatePorMes(@PathVariable String yearMonth) {
        try {
            KpiChurnRateDTO resultado = kpiService.getChurnRatePorMes(yearMonth);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/kpi/churn-rate/anio/{year}
     * Obtener tasa de churn de todos los meses de un año
     * @param year formato "yyyy" (ejemplo: "2025")
     */
    @GetMapping("/churn-rate/anio/{year}")
    public ResponseEntity<List<KpiChurnRateDTO>> getChurnRatePorAnio(@PathVariable String year) {
        try {
            List<KpiChurnRateDTO> resultado = kpiService.getChurnRatePorAnio(year);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
