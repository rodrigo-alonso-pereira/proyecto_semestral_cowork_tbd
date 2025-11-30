import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {getAllPlanes,createPlan,updatePlan,deletePlan,} from "../services/planService";

export default function Planes() {
  const [planes, setPlanes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    precioMensual: "",
    tiempoIncluido: "",
  });

  // 🔹 Cargar planes al iniciar
  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    try {
      const res = await getAllPlanes();
      const ordenados = (res.data || []).sort((a, b) => a.id - b.id);
      setPlanes(ordenados);
    } catch (error) {
      console.error("❌ Error al cargar planes:", error);
      alert("Error al cargar planes. Verifique la conexión.");
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      nombre: "",
      precioMensual: "",
      tiempoIncluido: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!formData.nombre || !formData.precioMensual || !formData.tiempoIncluido) {
        alert("⚠️ Complete los campos obligatorios: nombre, precio y horas incluidas.");
        return;
      }

      const payload = {
        nombre: formData.nombre.trim(),
        precioMensual: Number(formData.precioMensual),
        tiempoIncluido: Number(formData.tiempoIncluido),
      };

      if (formData.id) {
        await updatePlan(formData.id, payload);
        alert("✅ Plan actualizado correctamente");
      } else {
        await createPlan(payload);
        alert("✅ Plan creado correctamente");
      }

      await cargarPlanes();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error al guardar plan:", error.response?.data || error.message);
      alert("No se pudo guardar el plan. Verifique los datos.");
    }
  };

  const handleEdit = (p) => {
    setFormData({
      id: p.id,
      nombre: p.nombre || "",
      precioMensual: p.precioMensual ?? "",
      tiempoIncluido: p.tiempoIncluido ?? "",
    });
    setSelectedPlan(p);
    setShowModal(true);
  };

  const handleDelete = (p) => {
    setSelectedPlan(p);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await deletePlan(selectedPlan.id);
      alert(`🗑️ Plan "${selectedPlan.nombre}" eliminado.`);
      await cargarPlanes();
      setShowDelete(false);
    } catch (error) {
      console.error("❌ Error al eliminar plan:", error);
      alert("No se pudo eliminar el plan.");
    }
  };

  const formatearMoneda = (valor) =>
    `$${Number(valor || 0).toLocaleString("es-CL")}`;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Planes</h2>
        <Button
          variant="success"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Crear Plan
        </Button>
      </div>

      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio mensual</th>
            <th>Horas incluidas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {planes.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{formatearMoneda(p.precioMensual)}</td>
              <td>{p.tiempoIncluido}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(p)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(p)}
                >
                  <FaTrashAlt />
                </Button>
              </td>
            </tr>
          ))}
          {planes.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                No hay planes registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {formData.id ? "Editar Plan" : "Crear Plan"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio mensual (CLP)</Form.Label>
              <Form.Control
                type="number"
                name="precioMensual"
                value={formData.precioMensual}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-0">
              <Form.Label>Horas incluidas</Form.Label>
              <Form.Control
                type="number"
                name="tiempoIncluido"
                value={formData.tiempoIncluido}
                onChange={handleChange}
              />
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
          ¿Seguro que deseas eliminar el plan{" "}
          <strong>{selectedPlan?.nombre}</strong>?
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