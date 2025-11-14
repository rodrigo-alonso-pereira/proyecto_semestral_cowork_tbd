import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  getAllRecursos,
  createRecurso,
  updateRecurso,
} from "../services/recursoService";
import { getAllTiposRecurso } from "../services/tipoRecursoService";
import { getAllEstadosRecurso } from "../services/estadoRecursoService";

export default function Recursos() {
  const [recursos, setRecursos] = useState([]);
  const [tiposRecurso, setTiposRecurso] = useState([]);
  const [estadosRecurso, setEstadosRecurso] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecurso, setSelectedRecurso] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    precio: "",
    capacidad: "",
    tipoRecurso: { id: null, nombre: "" },
    estadoRecurso: { id: null, nombre: "" },
  });

  // 🔹 Cargar datos al iniciar
  useEffect(() => {
    cargarRecursos();
    cargarTiposRecurso();
    cargarEstadosRecurso();
  }, []);

  const cargarRecursos = async () => {
    try {
      const res = await getAllRecursos();
      const activos = res.data
        .filter((r) => r.estadoRecursoId !== 4)
        .sort((a, b) => a.id - b.id);
      setRecursos(activos);
    } catch (error) {
      console.error("❌ Error al cargar recursos:", error);
      alert("Error al cargar recursos. Verifique la conexión.");
    }
  };

  const cargarTiposRecurso = async () => {
    try {
      const res = await getAllTiposRecurso();
      setTiposRecurso(res.data);
    } catch (error) {
      console.error("❌ Error al cargar tipos de recurso:", error);
    }
  };

  const cargarEstadosRecurso = async () => {
    try {
      const res = await getAllEstadosRecurso();
      setEstadosRecurso(res.data);
    } catch (error) {
      console.error("❌ Error al cargar estados de recurso:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!formData.nombre || !formData.precio || !formData.capacidad) {
        alert("⚠️ Complete todos los campos obligatorios.");
        return;
      }

      const payload = {
        nombre: formData.nombre.trim(),
        precio: Number(formData.precio),
        capacidad: Number(formData.capacidad),
        tipoRecursoId: formData.tipoRecurso.id,
        estadoRecursoId: formData.estadoRecurso.id,
      };

      if (formData.id) {
        await updateRecurso(formData.id, payload);
        alert("✅ Recurso actualizado correctamente");
      } else {
        await createRecurso(payload);
        alert("✅ Recurso creado correctamente");
      }

      await cargarRecursos();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("❌ Error al guardar recurso:", error.response?.data || error.message);
      alert("No se pudo guardar el recurso. Verifique los datos.");
    }
  };

  const resetForm = () => {
    setFormData({
      id: "",
      nombre: "",
      precio: "",
      capacidad: "",
      tipoRecurso: { id: null, nombre: "" },
      estadoRecurso: { id: null, nombre: "" },
    });
  };

  const handleEdit = (r) => {
    setFormData({
      id: r.id,
      nombre: r.nombre,
      precio: r.precio,
      capacidad: r.capacidad,
      tipoRecurso: { id: r.tipoRecursoId, nombre: r.tipoRecursoNombre },
      estadoRecurso: { id: r.estadoRecursoId, nombre: r.estadoRecursoNombre },
    });
    setSelectedRecurso(r);
    setShowModal(true);
  };

  const handleDelete = (r) => {
    setSelectedRecurso(r);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      const payload = {
        nombre: selectedRecurso.nombre,
        precio: selectedRecurso.precio,
        capacidad: selectedRecurso.capacidad,
        tipoRecursoId: selectedRecurso.tipoRecursoId,
        estadoRecursoId: 4, // 4 = Eliminado
      };
      await updateRecurso(selectedRecurso.id, payload);
      alert(`🗑️ Recurso "${selectedRecurso.nombre}" eliminado.`);
      await cargarRecursos();
      setShowDelete(false);
    } catch (error) {
      console.error("❌ Error al eliminar recurso:", error);
      alert("No se pudo eliminar el recurso.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Recursos</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          + Crear Recurso
        </Button>
      </div>

      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Capacidad</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {recursos.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.nombre}</td>
              <td>{r.tipoRecursoNombre}</td>
              <td>{r.capacidad}</td>
              <td>${r.precio.toLocaleString("es-CL")}</td>
              <td>{r.estadoRecursoNombre}</td>
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

      {/* Modal Crear/Editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? "Editar Recurso" : "Crear Recurso"}</Modal.Title>
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
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de Recurso</Form.Label>
              <Form.Select
                name="tipoRecurso"
                value={formData.tipoRecurso?.id || ""}
                onChange={(e) => {
                  const sel = tiposRecurso.find((t) => t.id === Number(e.target.value));
                  setFormData((f) => ({ ...f, tipoRecurso: sel }));
                }}
              >
                <option value="">Seleccione tipo</option>
                {tiposRecurso.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estadoRecurso"
                value={formData.estadoRecurso?.id || ""}
                onChange={(e) => {
                  const sel = estadosRecurso.find((t) => t.id === Number(e.target.value));
                  setFormData((f) => ({ ...f, estadoRecurso: sel }));
                }}
              >
                <option value="">Seleccione estado</option>
                {estadosRecurso.map((e) => (
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
          ¿Seguro que deseas eliminar el recurso{" "}
          <strong>{selectedRecurso?.nombre}</strong>?
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
