import React, { useState, useEffect } from "react";
import usuariosData from "../data/usuarios.json";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaEye, FaEyeSlash  } from "react-icons/fa";
import { InputGroup } from "react-bootstrap";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    rut: "",
    nombre: "",
    password: "",
    email: "",
    estadoUsuario: { id: 1, nombre: "Activo" },
    tipoUsuario: { id: 1, nombre: "Miembro" },
    plan: { id: 1, nombre: "Hot Desk" },
  });
  const [showPassword, setShowPassword] = useState(false);

  // Cargar datos simulados
  useEffect(() => {
    setUsuarios(usuariosData);
  }, []);

  // Manejo de formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Crear o actualizar usuario
  const handleSave = () => {
    if (formData.id) {
      // actualizar
      setUsuarios(
        usuarios.map((u) => (u.id === formData.id ? { ...formData } : u))
      );
    } else {
      // crear nuevo
      const newUser = { ...formData, id: Date.now() };
      setUsuarios([...usuarios, newUser]);
    }
    setShowModal(false);
    setFormData({
      id: "",
      rut: "",
      nombre: "",
      password: "",
      email: "",
      estadoUsuario: { id: 1, nombre: "Activo" },
      tipoUsuario: { id: 1, nombre: "Miembro" },
      plan: { id: 1, nombre: "Hot Desk" },
    });
  };

  // Editar usuario
  const handleEdit = (user) => {
    setFormData(user);
    setSelectedUser(user);
    setShowModal(true);
  };

  // Eliminar usuario
  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    setUsuarios(usuarios.filter((u) => u.id !== selectedUser.id));
    setShowDelete(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Usuarios</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          + Crear Usuario
        </Button>
      </div>

      {/* Tabla */}
      <table className="table table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Email</th>
            {/*<th>Estado</th>*/}
            <th>Tipo</th>
            <th>Plan</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.rut}</td>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              {/*<td>{u.estadoUsuario.nombre}</td>*/}
              <td>{u.tipoUsuario.nombre}</td>
              <td>{u.plan?.nombre || "-"}</td>
              <td>
                <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    title="Editar usuario"
                    onClick={() => handleEdit(u)}
                >
                    <FaEdit />
                </Button>
                <Button
                    variant="outline-danger"
                    size="sm"
                    title="Eliminar usuario"
                    onClick={() => handleDelete(u)}
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
            {formData.id ? "Editar Usuario" : "Crear Usuario"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>RUT</Form.Label>
              <Form.Control
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                placeholder="Ej: 12.345.678-9"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre completo"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@example.com"
              />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <InputGroup>
                    <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    />
                    <Button
                    variant="link"
                    className="text-secondary p-0"
                    style={{ textDecoration: "none" , marginLeft: "8px"}}
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </Button>
                </InputGroup>
            </Form.Group>

            {/*<Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estadoUsuario"
                value={formData.estadoUsuario.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estadoUsuario: { id: e.target.value === "Activo" ? 1 : 2, nombre: e.target.value },
                  })
                }
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </Form.Select>*
            </Form.Group>*/}

            <Form.Group className="mb-3">
              <Form.Label>Tipo de Usuario</Form.Label>
              <Form.Select
                name="tipoUsuario"
                value={formData.tipoUsuario.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipoUsuario: {
                      id: e.target.value === "Administrador" ? 1 : 2,
                      nombre: e.target.value,
                    },
                  })
                }
              >
                <option>Administrador</option>
                <option>Miembro</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Plan</Form.Label>
              <Form.Select
                name="plan"
                value={formData.plan.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    plan: { id: 1, nombre: e.target.value },
                  })
                }
              >
                <option>Hot Desk</option>
                <option>Escritorio Dedicado</option>
                <option>Oficina Privada</option>
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
          ¿Estás seguro que deseas eliminar al usuario{" "}
          <strong>{selectedUser?.nombre}</strong>?
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