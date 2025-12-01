import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Spinner,
  Alert,
  Badge,
  Button,
  Modal,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import {
  getReservasByUsuario,
  updateReserva,
} from "../services/reservaService";
import { getAllEstadosReserva } from "../services/estadoReservaService";

export default function MisReservas() {
  const { currentUser } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [estadosReserva, setEstadosReserva] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 👇 estados para el modal de cancelación
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  useEffect(() => {
    if (!currentUser?.id) return;

    const cargar = async () => {
      setLoading(true);
      setError("");
      try {
        const [resReservas, resEstados] = await Promise.all([
          getReservasByUsuario(currentUser.id),
          getAllEstadosReserva(),
        ]);

        const ordenadas = [...resReservas.data].sort(
          (a, b) => new Date(b.inicioReserva) - new Date(a.inicioReserva)
        );
        setReservas(ordenadas);
        setEstadosReserva(resEstados.data || []);
      } catch (err) {
        console.error("Error al cargar reservas del usuario:", err);
        setError("No se pudieron cargar tus reservas. Intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [currentUser]);

  const formatearFecha = (iso) =>
    new Date(iso).toLocaleDateString("es-CL");

  const formatearHora = (iso) =>
    new Date(iso).toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatearEstado = (nombre) => {
    const n = (nombre || "").toLowerCase();
    if (n.includes("activa")) return <Badge bg="success">Activa</Badge>;
    if (n.includes("cancel")) return <Badge bg="danger">Cancelada</Badge>;
    if (n.includes("final")) return <Badge bg="secondary">Finalizada</Badge>;
    return <Badge bg="secondary">{nombre}</Badge>;
  };

  // Puede cancelar solo si la reserva está Activa y faltan 3+ horas
  const puedeCancelar = (reserva) => {
    const nombreEstado = (reserva.estadoReservaNombre || "").toLowerCase();
    const esActiva =
      nombreEstado.includes("activa") || reserva.estadoReservaId === 1;

    if (!esActiva) return false;
    if (!reserva.inicioReserva) return false;

    const ahora = new Date();
    const inicio = new Date(reserva.inicioReserva);
    const diffMs = inicio.getTime() - ahora.getTime();
    const TRES_HORAS_MS = 3 * 60 * 60 * 1000;

    return diffMs >= TRES_HORAS_MS;
  };

  // Abrir modal de cancelación
  const abrirModalCancelar = (reserva) => {
    if (!puedeCancelar(reserva)) {
      alert(
        "Solo puedes cancelar una reserva hasta 3 horas antes de su inicio."
      );
      return;
    }
    setReservaSeleccionada(reserva);
    setShowCancelModal(true);
  };

  const cerrarModalCancelar = () => {
    setShowCancelModal(false);
    setReservaSeleccionada(null);
  };

  // Confirmar cancelación (cambia estado a 'Cancelada')
  const confirmarCancelar = async () => {
    if (!reservaSeleccionada) return;

    const reserva = reservaSeleccionada;

    // Buscar el estado "Cancelada"
    const estadoCancelado = estadosReserva.find((e) =>
      (e.nombre || "").toLowerCase().includes("cancel")
    );

    if (!estadoCancelado) {
      alert(
        "No se encontró el estado 'Cancelada' en el sistema. Contacta al administrador."
      );
      return;
    }

    const payload = {
      usuarioId: reserva.usuarioId,
      recursoId: reserva.recursoId,
      inicioReserva: reserva.inicioReserva,
      terminoReserva: reserva.terminoReserva,
      valor: reserva.valor,
      estadoReservaId: estadoCancelado.id,
    };

    try {
      await updateReserva(reserva.id, payload);
      alert("✅ Reserva cancelada correctamente.");

      // Recargar listado
      const res = await getReservasByUsuario(currentUser.id);
      const ordenadas = [...res.data].sort(
        (a, b) => new Date(b.inicioReserva) - new Date(a.inicioReserva)
      );
      setReservas(ordenadas);
      cerrarModalCancelar();
    } catch (err) {
      console.error("Error al cancelar reserva:", err);
      alert("No se pudo cancelar la reserva. Intenta más tarde.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Mis reservas</h2>

      <Card className="mt-3 p-3 shadow-sm">
        {loading && (
          <div className="d-flex justify-content-center my-4">
            <Spinner animation="border" />
          </div>
        )}

        {error && !loading && <Alert variant="danger">{error}</Alert>}

        {!loading && !error && reservas.length === 0 && (
          <div className="text-center my-4">
            <p className="mb-1">
              Aún no has realizado reservas en el sistema.
            </p>
            <p className="text-muted">
              Puedes crear una nueva reserva desde el menú{" "}
              <strong>Reservas &gt; Crear reserva</strong>.
            </p>
          </div>
        )}

        {!loading && !error && reservas.length > 0 && (
          <>
            <Table hover responsive className="mt-2">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Fecha</th>
                  <th>Horario</th>
                  <th>Recurso</th>
                  <th>Estado</th>
                  <th className="text-end">Valor</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((r, idx) => {
                  const cancelable = puedeCancelar(r);
                  return (
                    <tr key={r.id}>
                      <td>{idx + 1}</td>
                      <td>{formatearFecha(r.inicioReserva)}</td>
                      <td>
                        {formatearHora(r.inicioReserva)} -{" "}
                        {formatearHora(r.terminoReserva)}
                      </td>
                      <td>{r.recursoNombre}</td>
                      <td>{formatearEstado(r.estadoReservaNombre)}</td>
                      <td className="text-end">
                        ${r.valor.toLocaleString("es-CL")}
                      </td>
                      <td className="text-center">
                        <Button
                          size="sm"
                          variant={cancelable ? "outline-danger" : "secondary"}
                          disabled={!cancelable}
                          title={
                            cancelable
                              ? "Cancelar reserva"
                              : "Solo puedes cancelar hasta 3 horas antes del inicio."
                          }
                          onClick={() => abrirModalCancelar(r)}
                        >
                          Cancelar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            {/* Modal de confirmación de cancelación */}
            <Modal
              show={showCancelModal}
              onHide={cerrarModalCancelar}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Confirmar cancelación</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {reservaSeleccionada && (
                  <>
                    <p>
                      ¿Deseas cancelar la reserva del{" "}
                      <strong>
                        {formatearFecha(reservaSeleccionada.inicioReserva)}
                      </strong>{" "}
                      a las{" "}
                      <strong>
                        {formatearHora(reservaSeleccionada.inicioReserva)}
                      </strong>{" "}
                      para el recurso{" "}
                      <strong>{reservaSeleccionada.recursoNombre}</strong>?
                    </p>
                    <p className="text-muted mb-0">
                      Recuerda que solo puedes cancelar hasta 3 horas antes del
                      inicio de la reserva.
                    </p>
                  </>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={cerrarModalCancelar}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={confirmarCancelar}>
                  Confirmar cancelación
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </Card>
    </div>
  );
}
