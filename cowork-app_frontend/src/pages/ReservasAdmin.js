import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { getAllReservas, updateReserva } from "../services/reservaService";
import { getAllUsuarios } from "../services/usuarioService";
import { getAllRecursos } from "../services/recursoService";
import { getAllEstadosReserva } from "../services/estadoReservaService";

export default function ReservasAdmin() {
  const [reservas, setReservas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [estadosReserva, setEstadosReserva] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    usuario: { id: null, nombre: "" },
    recurso: { id: null, nombre: "" },
    inicioReserva: "",
    terminoReserva: "",
    valor: "",
    estadoReserva: { id: null, nombre: "" },
  });

  // 🔹 Cargar datos
  useEffect(() => {
    cargarReservas();
    cargarUsuarios();
    cargarRecursos();
    cargarEstadosReserva();
  }, []);

  const cargarReservas = async () => {
    try {
      const res = await getAllReservas();
      const activas = res.data
        .filter((r) => r.estadoReservaId !== 3) // 3 = cancelada/eliminada
        .sort((a, b) => a.id - b.id);
      setReservas(activas);
    } catch (error) {
      console.error("❌ Error al cargar reservas:", error);
      alert("Error al cargar reservas. Verifique la conexión.");
    }
  };

  const cargarUsuarios = async () => {
    try {
      const res = await getAllUsuarios();
      setUsuarios(res.data);
    } catch (error) {
      console.error("❌ Error al cargar usuarios:", error);
    }
  };

  const cargarRecursos = async () => {
    try {
      const res = await getAllRecursos();
      setRecursos(res.data);
    } catch (error) {
      console.error("❌ Error al cargar recursos:", error);
    }
  };

  const cargarEstadosReserva = async () => {
    try {
      const res = await getAllEstadosReserva();
      setEstadosReserva(res.data);
    } catch (error) {
      console.error("❌ Error al cargar estados de reserva:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (r) => {
    setFormData({
      id: r.id,
      usuario: { id: r.usuarioId, nombre: r.usuarioNombre },
      recurso: { id: r.recursoId, nombre: r.recursoNombre },
      inicioReserva: r.inicioReserva,
      terminoReserva: r.terminoReserva,
      valor: r.valor,
      estadoReserva: { id: r.estadoReservaId, nombre: r.estadoReservaNombre },
    });
    setSelectedReserva(r);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (!formData.estadoReserva.id) {
        alert("⚠️ Debes seleccionar un estado para continuar.");
        return;
      }

      const payload = {
        usuarioId: formData.usuario.id,
        recursoId: formData.recurso.id,
        inicioReserva: formData.inicioReserva,
        terminoReserva: formData.terminoReserva,
        valor: formData.valor,
        estadoReservaId: formData.estadoReserva.id,
      };

      await updateReserva(formData.id, payload);
      alert("✅ Reserva actualizada correctamente.");
      await cargarReservas();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error al guardar reserva:", error);
      alert("No se pudo actualizar la reserva. Verifique la conexión.");
    }
  };

  const handleDelete = (r) => {
    setSelectedReserva(r);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const payload = {
        usuarioId: selectedReserva.usuarioId,
        recursoId: selectedReserva.recursoId,
        inicioReserva: selectedReserva.inicioReserva,
        terminoReserva: selectedReserva.terminoReserva,
        valor: selectedReserva.valor,
        estadoReservaId: 3, // 3 = Cancelada / Eliminada
      };

      await updateReserva(selectedReserva.id, payload);
      alert(`🗑️ Reserva ${selectedReserva.id} eliminada.`);
      await cargarReservas();
      setShowDelete(false);
    } catch (error) {
      console.error("❌ Error al eliminar reserva:", error);
      alert("No se pudo eliminar la reserva.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Administración de Reservas</h2>
      <table className="table table-hover mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Recurso</th>
            <th>Inicio</th>
            <th>Término</th>
            <th>Valor</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.usuarioNombre}</td>
              <td>{r.recursoNombre}</td>
              <td>{new Date(r.inicioReserva).toLocaleString("es-CL")}</td>
              <td>{new Date(r.terminoReserva).toLocaleString("es-CL")}</td>
              <td>${r.valor.toLocaleString("es-CL")}</td>
              <td>{r.estadoReservaNombre}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(r)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(r)}
                >
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Estado de Reserva</Form.Label>
              <Form.Select
                value={formData.estadoReserva?.id || ""}
                onChange={(e) => {
                  const sel = estadosReserva.find((t) => t.id === Number(e.target.value));
                  setFormData((f) => ({ ...f, estadoReserva: sel }));
                }}
              >
                <option value="">Seleccione estado</option>
                {estadosReserva.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Eliminar */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Deseas eliminar la reserva <strong>#{selectedReserva?.id}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
