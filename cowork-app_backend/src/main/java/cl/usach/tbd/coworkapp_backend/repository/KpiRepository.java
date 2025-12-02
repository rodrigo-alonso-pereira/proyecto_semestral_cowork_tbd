package cl.usach.tbd.coworkapp_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import cl.usach.tbd.coworkapp_backend.entity.Usuario;

import java.time.LocalDate;
import java.util.Map;
import java.util.Optional;

@Repository
public interface KpiRepository extends JpaRepository<Usuario, Long> {

    @Query(value = "SELECT CAST(kpi.nuevos_clientes AS INTEGER) FROM reservas.kpi_nuevos_clientes_mes(CAST(:fechaInicio AS DATE), CAST(:fechaFin AS DATE)) AS kpi", nativeQuery = true)
    Integer getNuevosClientesPorMes(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);

    @Query(value = "SELECT CAST(kpi.horas_reservadas_total AS NUMERIC) as horas_reservadas_total, CAST(kpi.horas_posibles AS NUMERIC) as horas_posibles, CAST(kpi.porcentaje_utilizacion AS NUMERIC) as porcentaje_utilizacion FROM reservas.kpi_utilizacion_real(CAST(:fechaInicio AS DATE), CAST(:fechaFin AS DATE)) AS kpi", nativeQuery = true)
    Optional<Map<String, Object>> getUtilizacionReal(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);

    @Query(value = "SELECT CAST(kpi.clientes_que_se_fueron AS INTEGER) as clientes_que_se_fueron, CAST(kpi.clientes_activos_inicio AS INTEGER) as clientes_activos_inicio, CAST(kpi.churn_rate AS NUMERIC) as churn_rate FROM reservas.kpi_churn_rate(CAST(:fechaInicio AS DATE), CAST(:fechaFin AS DATE)) AS kpi", nativeQuery = true)
    Optional<Map<String, Object>> getChurnRate(@Param("fechaInicio") LocalDate fechaInicio, @Param("fechaFin") LocalDate fechaFin);
}
