import React, { useState, useEffect } from "react";
import recursosData from "../data/recursos.json";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

export default function Recursos() {
  const [recursos, setRecursos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedRecurso, setSelectedRecurso] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    precio: "",
    capacidad: "",
    tipoRecurso: { id: 1, nombre: "Sala de reuniones" },
    estadoRecurso: { id: 1, nombre: "Disponible" },
  });

  // Cargar datos simulados
  useEffect(() => {
    const activos = recursosData.filter(r => r.activo === true);
    setRecursos(activos);
    }, []);

  // Manejo de cambios en formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Crear o actualizar recurso
  const handleSave = () => {
    if (formData.id) {
      // Actualizar
      setRecursos(
        recursos.map((r) => (r.id === formData.id ? { ...formData } : r))
      );
    } else {
      // Crear nuevo
      const newRecurso = { ...formData, id: Date.now() };
      setRecursos([...recursos, newRecurso]);
    }

    setShowModal(false);
    setFormData({
      id: "",
      nombre: "",
      precio: "",
      capacidad: "",
      tipoRecurso: { id: 1, nombre: "Sala de reuniones" },
      estadoRecurso: { id: 1, nombre: "Disponible" },
    });
  };

  // Editar recurso
  const handleEdit = (recurso) => {
    setFormData(recurso);
    setSelectedRecurso(recurso);
    setShowModal(true);
  };

  // Eliminar recurso
  const handleDelete = (recurso) => {
    setSelectedRecurso(recurso);
    setShowDelete(true);
  };

  const confirmDelete = () => {
  // Marcar el recurso como inactivo (activo = false)
  setRecursos(prev =>
    prev
      .map(r => (r.id === selectedRecurso.id ? { ...r, activo: false } : r))
      .filter(r => r.activo === true) // solo mantener activos en pantalla
  );
  setShowDelete(false);
  setSelectedRecurso(null);
};

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Recursos</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          + Crear Recurso
        </Button>
      </div>

      {/* Tabla */}
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
              <td>{r.tipoRecurso.nombre}</td>
              <td>{r.capacidad}</td>
              <td>${r.precio.toLocaleString("es-CL")}</td>
              <td>{r.estadoRecurso.nombre}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  title="Editar recurso"
                  onClick={() => handleEdit(r)}
                >
                  <FaEdit />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  title="Eliminar recurso"
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
            {formData.id ? "Editar Recurso" : "Crear Recurso"}
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
                placeholder="Ej: Sala de reuniones A"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                placeholder="Ej: 10000"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                placeholder="Ej: 4"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de recurso</Form.Label>
              <Form.Select
                name="tipoRecurso"
                value={formData.tipoRecurso.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipoRecurso: {
                      id:
                        e.target.value === "Sala de reuniones"
                          ? 1
                          : e.target.value === "Cabina telefónica"
                          ? 2
                          : 3,
                      nombre: e.target.value,
                    },
                  })
                }
              >
                <option>Sala de reuniones</option>
                <option>Cabina telefónica</option>
                <option>Estudio</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estadoRecurso"
                value={formData.estadoRecurso.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estadoRecurso: {
                      id: e.target.value === "Disponible" ? 1 : 2,
                      nombre: e.target.value,
                    },
                  })
                }
              >
                <option>Disponible</option>
                <option>En mantenimiento</option>
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
          ¿Estás seguro que deseas eliminar el recurso{" "}
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
