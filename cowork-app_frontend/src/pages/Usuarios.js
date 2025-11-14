import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FaEdit, FaTrashAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  getAllUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../services/usuarioService";
import { getAllTiposUsuario } from "../services/tipoUsuarioService";
import { getAllPlanes } from "../services/planService";
import { getAllEstadosUsuario } from "../services/estadoUsuarioService";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [tiposUsuario, setTiposUsuario] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [estadosUsuario, setEstadosUsuario] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    rut: "",
    nombre: "",
    password: "",
    email: "",
    estadoUsuario: { id: null, nombre: "" },
    tipoUsuario:   { id: null, nombre: "" },
    plan:          { id: null, nombre: "" },
  });

  // 🔹 Cargar usuarios al iniciar
  useEffect(() => {
    cargarUsuarios();
    cargarTiposUsuario();
    cargarPlanes();
    cargarEstadosUsuario();
  }, []);

  const cargarUsuarios = async () => {
  try {
    const res = await getAllUsuarios();
    console.log("datos usuarios", res);
    // 🔹 Mostrar todos excepto los eliminados (estadoUsuarioId = 4)
    const visibles = res.data.filter(
      (u) =>
        u.estadoUsuarioId !== 4 &&
        (u.estadoUsuario?.id !== 4)
    );
    setUsuarios(visibles);
  } catch (error) {
    console.error("❌ Error al obtener usuarios:", error);
    alert("Error al cargar usuarios. Verifique la conexión con el backend.");
  }
};


  const cargarTiposUsuario = async () => {
    try {
      const res = await getAllTiposUsuario();
      setTiposUsuario(res.data);
    } catch (error) {
      console.error("❌ Error al obtener tipos de usuario:", error);
    }
  };

  const cargarPlanes = async () => {
  try {
    const res = await getAllPlanes();
    setPlanes(res.data);
  } catch (error) {
    console.error("❌ Error al obtener planes:", error);
  }
};

const cargarEstadosUsuario = async () => {
  try {
    const res = await getAllEstadosUsuario();
    setEstadosUsuario(res.data);
  } catch (error) {
    console.error("❌ Error al obtener estados de usuario:", error);
  }
};

  // 🔹 Manejar cambios en formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 🔹 Crear o actualizar usuario
  const handleSave = async () => {
    try {
      if (!formData.rut || !formData.nombre || !formData.email || (!formData.id && !formData.password)) {
        alert("⚠️ Completa los campos obligatorios.");
        return;
      }

      const payload = {
        rut: formData.rut.trim(),
        nombre: formData.nombre.trim(),
        email: formData.email.trim().toLowerCase(),
        estadoUsuarioId: Number(formData.estadoUsuario?.id) || 1,
        tipoUsuarioId:   Number(formData.tipoUsuario?.id)   || 1,
        planId: (formData.plan?.id === 4 ? null : (Number(formData.plan?.id) || null)),
      };

      // password es obligatoria al crear, opcional al actualizar
      if (!formData.id && formData.password) payload.password = formData.password.trim();
      if (formData.id && formData.password)  payload.password = formData.password.trim();

      if (formData.id) {
        await updateUsuario(formData.id, payload);
        alert("✅ Usuario actualizado");
      } else {
        await createUsuario(payload);
        alert("✅ Usuario creado");
      }

      await cargarUsuarios();
      resetForm();
      setShowModal(false);
    } catch (e) {
      console.error("❌ Error al guardar:", e.response?.data || e.message);
      alert(e.response?.data?.message || "No se pudo guardar. Revisa los datos o la conexión.");
    }
  };
  const resetForm = () => setFormData({
    id: "",
    rut: "",
    nombre: "",
    password: "",
    email: "",
    estadoUsuario: { id: null, nombre: "" },
    tipoUsuario:   { id: null, nombre: "" },
    plan:          { id: null, nombre: "" },
  });

  // 🔹 Editar usuario
  const handleEdit = (u) => {
    setFormData({
      id: u.id || "",
      rut: u.rut || "",
      nombre: u.nombre || "",
      password: "",
      email: u.email || "",
      estadoUsuario: { id: u.estadoUsuarioId ?? null, nombre: u.estadoUsuarioNombre ?? "" },
      tipoUsuario:   { id: u.tipoUsuarioId   ?? null, nombre: u.tipoUsuarioNombre   ?? "" },
      plan:          { id: u.planId ?? null, nombre: u.planNombre ?? "" },
    });
    setSelectedUser(u);
    setShowModal(true);
  };

  // 🔹 Eliminar usuario (lógico)
  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
  try {
    // 🔹 Cambiar estadoUsuarioId a 3 (Suspendido)
    const payload = {
      nombre: selectedUser.nombre,
      password: "placeholder", // el backend exige password, si no, ajusta el controlador
      email: selectedUser.email,
      estadoUsuarioId: 4, // estado suspendido
      tipoUsuarioId: selectedUser.tipoUsuarioId || selectedUser.tipoUsuario?.id,
      planId: selectedUser.planId || selectedUser.plan?.id,
    };

    await updateUsuario(selectedUser.id, payload);

    alert(`⚠️ Usuario "${selectedUser.nombre}" ha sido eliminado.`);
    await cargarUsuarios();
    setShowDelete(false);
    setSelectedUser(null);
  } catch (error) {
    console.error("❌ Error al suspender usuario:", error);
    alert("No se pudo eliminar el usuario. Verifique la conexión o los datos.");
  }
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
          <th>Estado</th> {/* 👈 Nueva cabecera */}
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
            <td>{u.estadoUsuarioNombre || "Sin estado"}</td>
            <td>{u.tipoUsuarioNombre || "Sin tipo"}</td>
            <td>{u.planNombre || "Sin plan"}</td>
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? "Editar Usuario" : "Crear Usuario"}</Modal.Title>
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
                  style={{ textDecoration: "none", marginLeft: "8px" }}
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </Button>
              </InputGroup>
            </Form.Group>

             <Form.Group className="mb-3">
              <Form.Label>Estado de Usuario</Form.Label>
              <Form.Select
                 
                  name="estadoUsuario"
                  value={formData.estadoUsuario?.id ?? ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const sel = estadosUsuario.find(x => x.id === id);
                    setFormData(f => ({ ...f, estadoUsuario: { id: sel?.id ?? null, nombre: sel?.nombre ?? "" } }));
                  }}
                >
                  <option value="">Seleccione estado</option>
                  {estadosUsuario.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                </Form.Select>

            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipo de Usuario</Form.Label>
              <Form.Select
                name="tipoUsuario"
                value={formData.tipoUsuario?.id ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  const sel = tiposUsuario.find(x => x.id === id);
                  setFormData(f => ({ ...f, tipoUsuario: { id: sel?.id ?? null, nombre: sel?.nombre ?? "" } }));
                }}
              >
                <option value="">Seleccione tipo</option>
                {tiposUsuario.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </Form.Select>

            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Plan</Form.Label>
                <Form.Select
                    name="plan"
                    value={formData.plan?.id ?? ""}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const sel = planes.find(x => x.id === id);
                      setFormData(f => ({ ...f, plan: { id: sel?.id ?? null, nombre: sel?.nombre ?? "" } }));
                    }}
                  >
                    <option value="">Seleccione plan</option>
                    {planes.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
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
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
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
