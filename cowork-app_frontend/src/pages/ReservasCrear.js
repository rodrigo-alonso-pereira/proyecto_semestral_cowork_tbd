import React, { useState, useEffect } from "react";
import { Card, Button, Form, Modal } from "react-bootstrap";
import reservasData from "../data/reservas.json";
import recursosData from "../data/recursos.json";

export default function ReservasCrear() {
  const [recursos, setRecursos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [selectedRecurso, setSelectedRecurso] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBloque, setSelectedBloque] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Cargar recursos y reservas iniciales
  useEffect(() => {
    setRecursos(recursosData);
    setReservas(reservasData);
  }, []);

  // Generar bloques de 8:00 a 13:00
  useEffect(() => {
    const horas = [];
    for (let h = 8; h < 13; h++) {
      horas.push(`${h.toString().padStart(2, "0")}:00`);
    }
    setBloques(horas);
  }, []);

  // Verificar si un bloque está ocupado en esa fecha
  const isOcupado = (recursoId, fecha, hora) => {
    return reservas.some((r) => {
      const inicio = new Date(r.inicioReserva);
      const termino = new Date(r.terminoReserva);
      const bloqueHora = parseInt(hora.split(":")[0]);

      const mismoDia =
        inicio.toISOString().split("T")[0] === fecha &&
        r.recurso.id === recursoId;

      return (
        mismoDia &&
        bloqueHora >= inicio.getHours() &&
        bloqueHora < termino.getHours()
      );
    });
  };

  // Seleccionar bloque disponible
  const handleSelectBloque = (hora) => {
    setSelectedBloque(hora);
    setShowConfirm(true);
  };

  // Confirmar reserva
  const confirmarReserva = () => {
    if (!selectedRecurso || !selectedBloque || !selectedDate) return;

    const inicioISO = `${selectedDate}T${selectedBloque}:00`;
    const terminoISO = `${selectedDate}T${(
      parseInt(selectedBloque.split(":")[0]) + 1
    )
      .toString()
      .padStart(2, "0")}:00`;

    const nuevaReserva = {
      id: Date.now(),
      inicioReserva: inicioISO,
      terminoReserva: terminoISO,
      fechaCreacion: new Date().toISOString().split("T")[0],
      valor: selectedRecurso.precio,
      usuario: { id: 1, nombre: "Usuario Actual" },
      recurso: selectedRecurso,
      estadoReserva: { id: 1, nombre: "Confirmada" },
    };

    setReservas([...reservas, nuevaReserva]);
    setShowConfirm(false);
    setSelectedBloque(null);
    alert("✅ Reserva confirmada correctamente.");
  };

  return (
    <div className="container mt-4">
      <h2>Reservar recurso</h2>

      {/* Selección de recurso */}
      <Form.Group className="mt-3 mb-3">
        <Form.Label>Selecciona un recurso:</Form.Label>
        <Form.Select
          value={selectedRecurso?.nombre || ""}
          onChange={(e) => {
            const recurso = recursos.find((r) => r.nombre === e.target.value);
            setSelectedRecurso(recurso || null);
            setSelectedDate("");
            setSelectedBloque(null);
          }}
        >
          <option value="">-- Selecciona un recurso --</option>
          {recursos.map((r) => (
            <option key={r.id}>{r.nombre}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Mostrar valor del recurso */}
      {selectedRecurso && (
        <div className="mb-4">
          <p>
            💰 <strong>Valor por hora:</strong>{" "}
            ${selectedRecurso.precio.toLocaleString("es-CL")}
          </p>
        </div>
      )}

      {/* Selección de fecha */}
      {selectedRecurso && (
        <Form.Group className="mb-4">
          <Form.Label>Selecciona el día:</Form.Label>
          <Form.Control
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedBloque(null);
            }}
          />
        </Form.Group>
      )}

      {/* Mostrar bloques horarios */}
      {selectedRecurso && selectedDate && (
        <div className="mt-4">
          <h5>Disponibilidad para el {selectedDate}</h5>
          <div className="d-flex flex-wrap gap-3 mt-3">
            {bloques.map((hora) => {
              const ocupado = isOcupado(selectedRecurso.id, selectedDate, hora);
              return (
                <Button
                  key={hora}
                  variant={ocupado ? "secondary" : "outline-success"}
                  disabled={ocupado}
                  onClick={() => handleSelectBloque(hora)}
                  style={{
                    width: "100px",
                    height: "50px",
                    pointerEvents: ocupado ? "none" : "auto",
                  }}
                >
                  {hora}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecurso && selectedBloque ? (
            <Card className="p-3">
              <p><strong>Usuario:</strong> Usuario Actual</p>
              <p><strong>Recurso:</strong> {selectedRecurso.nombre}</p>
              <p>
                <strong>Fecha:</strong> {selectedDate}
              </p>
              <p>
                <strong>Horario:</strong> {selectedBloque} -{" "}
                {parseInt(selectedBloque.split(":")[0]) + 1}:00
              </p>
              <p>
                <strong>Valor:</strong>{" "}
                ${selectedRecurso.precio.toLocaleString("es-CL")}
              </p>
            </Card>
          ) : (
            <p>Selecciona un bloque horario disponible.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={confirmarReserva}>
            Confirmar reserva
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

