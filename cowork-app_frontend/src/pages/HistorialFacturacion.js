import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Spinner,
  Alert,
  Badge,
  Form,
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";
import { getAllFacturas, updateFacturaEstado } from "../services/facturaService";
import { getAllUsuarios } from "../services/usuarioService";
import { getAllEstadosFactura } from "../services/estadoFacturaService";
import { FaEdit } from "react-icons/fa";

/**
 * Helper: parsea una fecha ISO "YYYY-MM-DD" o "YYYY-MM-DDTHH:mm:ss"
 * sin aplicar zona horaria, solo como texto.
 */
const parseFechaISO = (iso) => {
  if (!iso) return null;
  const [ymd] = iso.split("T");
  const [year, month, day] = ymd.split("-").map(Number);
  return {
    year,
    month,
    day,
    ymd, // string YYYY-MM-DD
  };
};

export default function HistorialFacturacion() {
  const [facturas, setFacturas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [estadosFactura, setEstadosFactura] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filtros, setFiltros] = useState({
    usuarioId: "TODOS",
    mes: "TODOS",
    anio: "TODOS",
  });

  // Modal detalle
  const [showModalDetalle, setShowModalDetalle] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);

  // Modal cambio de estado
  const [showModalEstado, setShowModalEstado] = useState(false);
  const [facturaEstadoSeleccionada, setFacturaEstadoSeleccionada] =
    useState(null);
  const [nuevoEstadoId, setNuevoEstadoId] = useState("");

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError("");
      try {
        const [resFacturas, resUsuarios, resEstados] = await Promise.all([
          getAllFacturas(),
          getAllUsuarios(),
          getAllEstadosFactura(),
        ]);

        // Ordenar por fechaEmision DESC usando el string YYYY-MM-DD
        const ordenadas = [...resFacturas.data].sort((a, b) => {
          const pa = parseFechaISO(a.fechaEmision);
          const pb = parseFechaISO(b.fechaEmision);
          if (!pa || !pb) return 0;
          return pb.ymd.localeCompare(pa.ymd); // más reciente primero
        });

        setFacturas(ordenadas);
        setUsuarios(resUsuarios.data || []);
        setEstadosFactura(resEstados.data || []);
      } catch (err) {
        console.error("Error al cargar historial de facturación:", err);
        setError(
          "No se pudo cargar el historial de facturación. Intenta más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);

  const formatearFecha = (iso) => {
    const partes = parseFechaISO(iso);
    if (!partes) return "-";
    const { day, month, year } = partes;
    return `${String(day).padStart(2, "0")}-${String(month).padStart(
      2,
      "0"
    )}-${year}`;
  };

  const formatearTotal = (valor) =>
    typeof valor === "number"
      ? `$${valor.toLocaleString("es-CL")}`
      : `$${Number(valor || 0).toLocaleString("es-CL")}`;

  const badgeEstado = (nombre) => {
    const n = (nombre || "").toLowerCase();
    if (n.includes("pagada")) return <Badge bg="success">Pagada</Badge>;
    if (n.includes("pend")) return <Badge bg="warning">Pendiente</Badge>;
    if (n.includes("venc")) return <Badge bg="danger">Vencida</Badge>;
    return <Badge bg="secondary">{nombre}</Badge>;
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((f) => ({ ...f, [name]: value }));
  };

  // Años disponibles en base a las facturas (sin new Date)
  const aniosDisponibles = useMemo(() => {
    const set = new Set();
    facturas.forEach((f) => {
      const partes = parseFechaISO(f.fechaEmision);
      if (partes) set.add(partes.year);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [facturas]);

  // Facturas filtradas por usuario, mes, año (sin new Date)
  const facturasFiltradas = useMemo(() => {
    let res = [...facturas];

    if (filtros.usuarioId !== "TODOS") {
      const idNum = Number(filtros.usuarioId);
      res = res.filter((f) => f.usuarioId === idNum);
    }

    if (filtros.mes !== "TODOS") {
      const mesNum = Number(filtros.mes);
      res = res.filter((f) => {
        const partes = parseFechaISO(f.fechaEmision);
        return partes && partes.month === mesNum;
      });
    }

    if (filtros.anio !== "TODOS") {
      const anioNum = Number(filtros.anio);
      res = res.filter((f) => {
        const partes = parseFechaISO(f.fechaEmision);
        return partes && partes.year === anioNum;
      });
    }

    return res;
  }, [facturas, filtros]);

  // --- Modales ---

  const abrirModalDetalle = (factura) => {
    setSelectedFactura(factura);
    setShowModalDetalle(true);
  };

  const cerrarModalDetalle = () => {
    setShowModalDetalle(false);
    setSelectedFactura(null);
  };

  const abrirModalEstado = (factura) => {
    setFacturaEstadoSeleccionada(factura);
    setNuevoEstadoId(factura.estadoFacturaId || "");
    setShowModalEstado(true);
  };

  const cerrarModalEstado = () => {
    setShowModalEstado(false);
    setFacturaEstadoSeleccionada(null);
    setNuevoEstadoId("");
  };

  const guardarCambioEstado = async () => {
    if (!facturaEstadoSeleccionada || !nuevoEstadoId) {
      alert("Debes seleccionar un estado.");
      return;
    }

    try {
      await updateFacturaEstado(
        facturaEstadoSeleccionada.id,
        Number(nuevoEstadoId)
      );

      alert("✅ Estado de la factura actualizado correctamente.");

      // Recargar facturas y volver a ordenar por fechaEmision DESC
      const res = await getAllFacturas();
      const ordenadas = [...res.data].sort((a, b) => {
        const pa = parseFechaISO(a.fechaEmision);
        const pb = parseFechaISO(b.fechaEmision);
        if (!pa || !pb) return 0;
        return pb.ymd.localeCompare(pa.ymd);
      });
      setFacturas(ordenadas);
      cerrarModalEstado();
    } catch (err) {
      console.error(
        "Error al actualizar estado de factura:",
        err.response?.data || err.message
      );
      alert("No se pudo actualizar el estado. Intenta más tarde.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Historial de facturación</h2>

      <Card className="mt-3 p-3 shadow-sm">
        {/* Filtros */}
        <Form className="mb-3">
          <Row className="g-2">
            {/* Usuario */}
            <Col xs={12} md={4}>
              <Form.Group>
                <Form.Label>Usuario</Form.Label>
                <Form.Select
                  name="usuarioId"
                  value={filtros.usuarioId}
                  onChange={handleFiltroChange}
                >
                  <option value="TODOS">Todos</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Mes */}
            <Col xs={6} md={4}>
              <Form.Group>
                <Form.Label>Mes</Form.Label>
                <Form.Select
                  name="mes"
                  value={filtros.mes}
                  onChange={handleFiltroChange}
                >
                  <option value="TODOS">Todos</option>
                  <option value="1">Enero</option>
                  <option value="2">Febrero</option>
                  <option value="3">Marzo</option>
                  <option value="4">Abril</option>
                  <option value="5">Mayo</option>
                  <option value="6">Junio</option>
                  <option value="7">Julio</option>
                  <option value="8">Agosto</option>
                  <option value="9">Septiembre</option>
                  <option value="10">Octubre</option>
                  <option value="11">Noviembre</option>
                  <option value="12">Diciembre</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Año */}
            <Col xs={6} md={4}>
              <Form.Group>
                <Form.Label>Año</Form.Label>
                <Form.Select
                  name="anio"
                  value={filtros.anio}
                  onChange={handleFiltroChange}
                >
                  <option value="TODOS">Todos</option>
                  {aniosDisponibles.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Form>

        {loading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" />
          </div>
        )}

        {!loading && error && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && facturasFiltradas.length === 0 && (
          <div className="text-center my-4">
            <p className="mb-1">
              No se encontraron facturas con los filtros seleccionados.
            </p>
            <p className="text-muted mb-0">
              Prueba cambiando el usuario, mes o año.
            </p>
          </div>
        )}

        {!loading && !error && facturasFiltradas.length > 0 && (
          <>
            <Table hover responsive className="mt-2">
              <thead>
                <tr>
                  <th>N° factura</th>
                  <th>Usuario</th>
                  <th>Fecha emisión</th>
                  <th>Estado</th>
                  <th className="text-end">Total</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturasFiltradas.map((f) => (
                  <tr key={f.id}>
                    <td>{f.numeroFactura}</td>
                    <td>{f.usuarioNombre}</td>
                    <td>{formatearFecha(f.fechaEmision)}</td>
                    <td>{badgeEstado(f.estadoFacturaNombre)}</td>
                    <td className="text-end">{formatearTotal(f.total)}</td>
                    <td className="text-center">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-2"
                        onClick={() => abrirModalDetalle(f)}
                      >
                        Ver detalle
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => abrirModalEstado(f)}
                        title="Cambiar estado"
                      >
                        <FaEdit />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Modal detalle factura */}
            <Modal show={showModalDetalle} onHide={cerrarModalDetalle} centered>
              <Modal.Header closeButton>
                <Modal.Title>Detalle de factura</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedFactura && (
                  <>
                    <p>
                      <strong>N° factura:</strong>{" "}
                      {selectedFactura.numeroFactura}
                    </p>
                    <p>
                      <strong>Usuario:</strong>{" "}
                      {selectedFactura.usuarioNombre}
                    </p>
                    <p>
                      <strong>Fecha emisión:</strong>{" "}
                      {formatearFecha(selectedFactura.fechaEmision)}
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      {badgeEstado(selectedFactura.estadoFacturaNombre)}
                    </p>
                    <p>
                      <strong>Total:</strong>{" "}
                      {formatearTotal(selectedFactura.total)}
                    </p>
                    <hr />
                    <p>
                      <strong>Descripción:</strong>
                      <br />
                      {selectedFactura.descripcion ||
                        "Sin descripción adicional."}
                    </p>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cerrarModalDetalle}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Modal cambio de estado */}
            <Modal show={showModalEstado} onHide={cerrarModalEstado} centered>
              <Modal.Header closeButton>
                <Modal.Title>Cambiar estado de factura</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {facturaEstadoSeleccionada && (
                  <>
                    <p className="mb-2">
                      <strong>N° factura:</strong>{" "}
                      {facturaEstadoSeleccionada.numeroFactura}
                    </p>
                    <p className="mb-3">
                      <strong>Usuario:</strong>{" "}
                      {facturaEstadoSeleccionada.usuarioNombre}
                    </p>
                    <Form.Group>
                      <Form.Label>Nuevo estado</Form.Label>
                      <Form.Select
                        value={nuevoEstadoId}
                        onChange={(e) => setNuevoEstadoId(e.target.value)}
                      >
                        <option value="">Seleccione estado</option>
                        {estadosFactura
                          .filter(
                            (e) =>
                              e.id !== 5 &&
                              !(e.nombre || "").toLowerCase().includes("elimin")
                          )
                          .map((e) => (
                            <option key={e.id} value={e.id}>
                              {e.nombre}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cerrarModalEstado}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={guardarCambioEstado}>
                  Guardar cambios
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Card>
    </div>
  );
}
