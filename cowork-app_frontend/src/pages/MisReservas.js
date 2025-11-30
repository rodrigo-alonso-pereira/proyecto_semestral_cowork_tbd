import React, { useEffect, useState } from "react";
import { Card, Table, Spinner, Alert, Badge } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { getReservasByUsuario } from "../services/reservaService";

export default function MisReservas() {
  const { currentUser } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser?.id) return;

    const cargar = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getReservasByUsuario(currentUser.id);
        // Ordenamos por fecha de inicio DESC (más recientes primero)
        const ordenadas = [...res.data].sort(
          (a, b) => new Date(b.inicioReserva) - new Date(a.inicioReserva)
        );
        setReservas(ordenadas);
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
          <Table hover responsive className="mt-2">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Recurso</th>
                <th>Estado</th>
                <th className="text-end">Valor</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r, idx) => (
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
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
