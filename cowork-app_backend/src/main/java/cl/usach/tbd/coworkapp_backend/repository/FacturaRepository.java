package cl.usach.tbd.coworkapp_backend.repository;

import cl.usach.tbd.coworkapp_backend.entity.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Long> {

    // Buscar factura por número de factura
    Optional<Factura> findByNumeroFactura(Long numeroFactura);

    // Buscar facturas por usuario
    List<Factura> findByUsuarioId(Long usuarioId);

    // Buscar facturas por mes y año
    @Query("SELECT f FROM Factura f WHERE EXTRACT(MONTH FROM f.fechaEmision) = :mes AND EXTRACT(YEAR FROM f.fechaEmision) = :anio")
    List<Factura> findByMesAndAnio(@Param("mes") int mes, @Param("anio") int anio);

    // Buscar facturas por usuario, mes y año
    @Query("SELECT f FROM Factura f WHERE f.usuario.id = :usuarioId AND EXTRACT(MONTH FROM f.fechaEmision) = :mes AND EXTRACT(YEAR FROM f.fechaEmision) = :anio")
    List<Factura> findByUsuarioIdAndMesAndAnio(@Param("usuarioId") Long usuarioId, @Param("mes") int mes, @Param("anio") int anio);
}

