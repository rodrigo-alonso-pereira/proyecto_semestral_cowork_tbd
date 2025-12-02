package cl.usach.tbd.coworkapp_backend.service;

import cl.usach.tbd.coworkapp_backend.dto.KpiNuevosClientesMesDTO;
import cl.usach.tbd.coworkapp_backend.dto.KpiUtilizacionRealDTO;
import cl.usach.tbd.coworkapp_backend.dto.KpiChurnRateDTO;
import cl.usach.tbd.coworkapp_backend.repository.KpiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class KpiService {

    @Autowired
    private KpiRepository kpiRepository;

    /**
     * Obtener nuevos clientes de un mes específico
     * @param yearMonth año-mes en formato "yyyy-MM"
     * @return DTO con el mes y número de nuevos clientes
     */
    public KpiNuevosClientesMesDTO getNuevosClientesPorMes(String yearMonth) {
        try {
            // Parsear el año-mes
            YearMonth ym = YearMonth.parse(yearMonth);
            LocalDate fechaInicio = ym.atDay(1);
            LocalDate fechaFin = ym.atEndOfMonth();

            // Consultar el KPI
            Integer nuevosClientes = kpiRepository.getNuevosClientesPorMes(fechaInicio, fechaFin);

            // Retornar DTO
            return new KpiNuevosClientesMesDTO(yearMonth, nuevosClientes != null ? nuevosClientes : 0);
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener KPI de nuevos clientes por mes: " + e.getMessage());
        }
    }

    /**
     * Obtener nuevos clientes de todos los meses de un año
     * @param year año en formato "yyyy"
     * @return Lista de DTOs con cada mes y número de nuevos clientes
     */
    public List<KpiNuevosClientesMesDTO> getNuevosClientesPorAnio(String year) {
        try {
            List<KpiNuevosClientesMesDTO> resultado = new ArrayList<>();
            int anio = Integer.parseInt(year);

            // Iterar sobre los 12 meses del año
            for (int mes = 1; mes <= 12; mes++) {
                YearMonth ym = YearMonth.of(anio, mes);
                LocalDate fechaInicio = ym.atDay(1);
                LocalDate fechaFin = ym.atEndOfMonth();

                // Consultar el KPI para cada mes
                Integer nuevosClientes = kpiRepository.getNuevosClientesPorMes(fechaInicio, fechaFin);

                // Formatear el mes como "yyyy-MM"
                String mesFormateado = ym.format(DateTimeFormatter.ofPattern("yyyy-MM"));

                // Agregar a la lista
                resultado.add(new KpiNuevosClientesMesDTO(mesFormateado, nuevosClientes != null ? nuevosClientes : 0));
            }

            return resultado;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener KPI de nuevos clientes por año: " + e.getMessage());
        }
    }

    /**
     * Obtener utilización real de recursos de un mes específico
     * @param yearMonth año-mes en formato "yyyy-MM"
     * @return DTO con el mes y datos de utilización
     */
    public KpiUtilizacionRealDTO getUtilizacionRealPorMes(String yearMonth) {
        try {
            // Parsear el año-mes
            YearMonth ym = YearMonth.parse(yearMonth);
            LocalDate fechaInicio = ym.atDay(1);
            LocalDate fechaFin = ym.atEndOfMonth();

            // Consultar el KPI
            Map<String, Object> resultado = kpiRepository.getUtilizacionReal(fechaInicio, fechaFin)
                    .orElseThrow(() -> new RuntimeException("No se pudo obtener la utilización real"));

            // Convertir los valores a Integer y Float
            Integer horasReservadas = new BigDecimal(resultado.get("horas_reservadas_total").toString()).intValue();
            Integer horasPosibles = new BigDecimal(resultado.get("horas_posibles").toString()).intValue();
            Float porcentajeUtilizacion = new BigDecimal(resultado.get("porcentaje_utilizacion").toString())
                    .setScale(2, RoundingMode.HALF_UP).floatValue();

            // Retornar DTO
            return new KpiUtilizacionRealDTO(yearMonth, horasReservadas, horasPosibles, porcentajeUtilizacion);
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener KPI de utilización real por mes: " + e.getMessage());
        }
    }

    /**
     * Obtener utilización real de recursos de todos los meses de un año
     * @param year año en formato "yyyy"
     * @return Lista de DTOs con cada mes y datos de utilización
     */
    public List<KpiUtilizacionRealDTO> getUtilizacionRealPorAnio(String year) {
        try {
            List<KpiUtilizacionRealDTO> resultado = new ArrayList<>();
            int anio = Integer.parseInt(year);

            // Iterar sobre los 12 meses del año
            for (int mes = 1; mes <= 12; mes++) {
                YearMonth ym = YearMonth.of(anio, mes);
                LocalDate fechaInicio = ym.atDay(1);
                LocalDate fechaFin = ym.atEndOfMonth();

                // Consultar el KPI para cada mes
                Map<String, Object> resultadoMes = kpiRepository.getUtilizacionReal(fechaInicio, fechaFin)
                        .orElse(null);

                if (resultadoMes != null) {
                    // Convertir los valores a Integer y Float
                    Integer horasReservadas = new BigDecimal(resultadoMes.get("horas_reservadas_total").toString()).intValue();
                    Integer horasPosibles = new BigDecimal(resultadoMes.get("horas_posibles").toString()).intValue();
                    Float porcentajeUtilizacion = new BigDecimal(resultadoMes.get("porcentaje_utilizacion").toString())
                            .setScale(2, RoundingMode.HALF_UP).floatValue();

                    // Formatear el mes como "yyyy-MM"
                    String mesFormateado = ym.format(DateTimeFormatter.ofPattern("yyyy-MM"));

                    // Agregar a la lista
                    resultado.add(new KpiUtilizacionRealDTO(mesFormateado, horasReservadas, horasPosibles, porcentajeUtilizacion));
                } else {
                    // Si no hay datos, agregar con ceros
                    String mesFormateado = ym.format(DateTimeFormatter.ofPattern("yyyy-MM"));
                    resultado.add(new KpiUtilizacionRealDTO(mesFormateado, 0, 0, 0.0f));
                }
            }

            return resultado;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener KPI de utilización real por año: " + e.getMessage());
        }
    }

    /**
     * Obtener tasa de churn de un mes específico
     * @param yearMonth año-mes en formato "yyyy-MM"
     * @return DTO con el mes y datos de churn rate
     */
    public KpiChurnRateDTO getChurnRatePorMes(String yearMonth) {
        try {
            // Parsear el año-mes
            YearMonth ym = YearMonth.parse(yearMonth);
            LocalDate fechaInicio = ym.atDay(1);
            LocalDate fechaFin = ym.atEndOfMonth();

            // Consultar el KPI
            Map<String, Object> resultado = kpiRepository.getChurnRate(fechaInicio, fechaFin)
                    .orElseThrow(() -> new RuntimeException("No se pudo obtener el churn rate"));

            // Convertir los valores a Integer y Float
            Integer clientesAbandonaron = new BigDecimal(resultado.get("clientes_que_se_fueron").toString()).intValue();
            Integer clientesActivos = new BigDecimal(resultado.get("clientes_activos_inicio").toString()).intValue();
            Float churnRate = new BigDecimal(resultado.get("churn_rate").toString())
                    .setScale(2, RoundingMode.HALF_UP).floatValue();

            // Retornar DTO
            return new KpiChurnRateDTO(yearMonth, clientesAbandonaron, clientesActivos, churnRate);
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener KPI de churn rate por mes: " + e.getMessage());
        }
    }

    /**
     * Obtener tasa de churn de todos los meses de un año
     * @param year año en formato "yyyy"
     * @return Lista de DTOs con cada mes y datos de churn rate
     */
    public List<KpiChurnRateDTO> getChurnRatePorAnio(String year) {
        try {
            List<KpiChurnRateDTO> resultado = new ArrayList<>();
            int anio = Integer.parseInt(year);

            // Iterar sobre los 12 meses del año
            for (int mes = 1; mes <= 12; mes++) {
                YearMonth ym = YearMonth.of(anio, mes);
                LocalDate fechaInicio = ym.atDay(1);
                LocalDate fechaFin = ym.atEndOfMonth();

                // Consultar el KPI para cada mes
                Map<String, Object> resultadoMes = kpiRepository.getChurnRate(fechaInicio, fechaFin)
                        .orElse(null);

                if (resultadoMes != null) {
                    // Convertir los valores a Integer y Float
                    Integer clientesAbandonaron = new BigDecimal(resultadoMes.get("clientes_que_se_fueron").toString()).intValue();
                    Integer clientesActivos = new BigDecimal(resultadoMes.get("clientes_activos_inicio").toString()).intValue();
                    Float churnRate = new BigDecimal(resultadoMes.get("churn_rate").toString())
                            .setScale(2, RoundingMode.HALF_UP).floatValue();

                    // Formatear el mes como "yyyy-MM"
                    String mesFormateado = ym.format(DateTimeFormatter.ofPattern("yyyy-MM"));

                    // Agregar a la lista
                    resultado.add(new KpiChurnRateDTO(mesFormateado, clientesAbandonaron, clientesActivos, churnRate));
                } else {
                    // Si no hay datos, agregar con ceros
                    String mesFormateado = ym.format(DateTimeFormatter.ofPattern("yyyy-MM"));
                    resultado.add(new KpiChurnRateDTO(mesFormateado, 0, 0, 0.0f));
                }
            }

            return resultado;
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener KPI de churn rate por año: " + e.getMessage());
        }
    }
}
