import React, { useState, useEffect } from "react";
import reservasData from "../data/reservas.json";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function Reservas() {
  const [reservas, setReservas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    inicioReserva: "",
    terminoReserva: "",
    fechaCreacion: "",
    valor: "",
    usuario: { id: 1, nombre: "Juan Pérez" },
    recurso: { id: 1, nombre: "Sala de reuniones pequeña" },
    estadoReserva: { id: 1, nombre: "Confirmada" },
  });

  // Cargar datos simulados
  useEffect(() => {
    setReservas(reservasData);
  }, []);

  // Manejar cambios en formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Crear o actualizar reserva
  const handleSave = () => {
    if (formData.id) {
      setReservas(
        reservas.map((r) => (r.id === formData.id ? { ...formData } : r))
      );
    } else {
      const newReserva = {
        ...formData,
        id: Date.now(),
        fechaCreacion: new Date().toISOString().split("T")[0],
      };
      setReservas([...reservas, newReserva]);
    }

    setShowModal(false);
    setFormData({
      id: "",
      inicioReserva: "",
      terminoReserva: "",
      fechaCreacion: "",
      valor: "",
      usuario: { id: 1, nombre: "Juan Pérez" },
      recurso: { id: 1, nombre: "Sala de reuniones pequeña" },
      estadoReserva: { id: 1, nombre: "Confirmada" },
    });
  };

  // Editar reserva
  const handleEdit = (reserva) => {
    setFormData(reserva);
    setSelectedReserva(reserva);
    setShowModal(true);
  };

  // Eliminar reserva
  const handleDelete = (reserva) => {
    setSelectedReserva(reserva);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    setReservas(reservas.filter((r) => r.id !== selectedReserva.id));
    setShowDelete(false);
    setSelectedReserva(null);
  };

  // Formatear fecha para mostrar
  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Reservas</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          + Crear Reserva
        </Button>
      </div>

      {/* Tabla */}
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Recurso</th>
            <th>Inicio</th>
            <th>Término</th>
            <th>Fecha creación</th>
            <th>Valor</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.usuario.nombre}</td>
              <td>{r.recurso.nombre}</td>
              <td>{formatDate(r.inicioReserva)}</td>
              <td>{formatDate(r.terminoReserva)}</td>
              <td>{r.fechaCreacion}</td>
              <td>${r.valor.toLocaleString("es-CL")}</td>
              <td>{r.estadoReserva.nombre}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  title="Editar reserva"
                  onClick={() => handleEdit(r)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  title="Eliminar reserva"
                  onClick={() => handleDelete(r)}
                >
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {formData.id ? "Editar Reserva" : "Crear Reserva"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Inicio de reserva</Form.Label>
              <Form.Control
                type="datetime-local"
                name="inicioReserva"
                value={formData.inicioReserva}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Término de reserva</Form.Label>
              <Form.Control
                type="datetime-local"
                name="terminoReserva"
                value={formData.terminoReserva}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Valor</Form.Label>
              <Form.Control
                type="number"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                placeholder="Ej: 10000"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Select
                name="usuario"
                value={formData.usuario.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    usuario: { id: 1, nombre: e.target.value },
                  })
                }
              >
                <option>Juan Pérez</option>
                <option>María González</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Recurso</Form.Label>
              <Form.Select
                name="recurso"
                value={formData.recurso.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recurso: { id: 1, nombre: e.target.value },
                  })
                }
              >
                <option>Sala de reuniones pequeña</option>
                <option>Cabina telefónica</option>
                <option>Estudio de podcast</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estadoReserva"
                value={formData.estadoReserva.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estadoReserva: {
                      id: e.target.value === "Confirmada" ? 1 : 2,
                      nombre: e.target.value,
                    },
                  })
                }
              >
                <option>Confirmada</option>
                <option>Pendiente</option>
                <option>Cancelada</option>
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

      {/* Modal de eliminación */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro que deseas eliminar la reserva del usuario{" "}
          <strong>{selectedReserva?.usuario?.nombre}</strong>?
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
