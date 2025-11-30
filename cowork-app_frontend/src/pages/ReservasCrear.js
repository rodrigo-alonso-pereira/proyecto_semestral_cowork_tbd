import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col } from "react-bootstrap";
import { getAllRecursos } from "../services/recursoService";
import { getAllReservas, createReserva } from "../services/reservaService";
import { getAllEstadosReserva } from "../services/estadoReservaService";
import { useAuth } from "../context/AuthContext"; 

export default function ReservasCrear() {
  const [recursos, setRecursos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [estadosReserva, setEstadosReserva] = useState([]);

  const [formData, setFormData] = useState({
    usuario: { id: null, nombre: "" },
    recurso: { id: null, nombre: "", precio: 0 },
    fecha: "",
    horaInicio: "",
    horaFin: "",
    estadoReserva: { id: null, nombre: "" },
  });

  const [bloquesDisponibles, setBloquesDisponibles] = useState([]);
  const { currentUser, role } = useAuth();

  // 🔹 Cargar datos iniciales
  useEffect(() => {
    cargarRecursos();
    cargarReservas();
    cargarEstadosReserva();
  }, []);

  const cargarRecursos = async () => {
    try {
      const res = await getAllRecursos();
      setRecursos(res.data.filter((r) => r.estadoRecursoId === 1)); // Solo disponibles
    } catch (error) {
      console.error("❌ Error al cargar recursos:", error);
    }
  };

  const cargarReservas = async () => {
    try {
      const res = await getAllReservas();
      setReservas(res.data);
    } catch (error) {
      console.error("❌ Error al cargar reservas:", error);
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

  // 🔸 Generar bloques horarios (09:00 a 18:00)
    const generarBloques = () => {
    const bloques = [];
    for (let hora = 9; hora < 18; hora++) {
        bloques.push({
        inicio: `${hora.toString().padStart(2, "0")}:00`,
        fin: `${(hora + 1).toString().padStart(2, "0")}:00`,
        });
    }
    return bloques;
    };

  // 🔸 Calcular disponibilidad según recurso y fecha seleccionada
    useEffect(() => {
    if (formData.recurso.id && formData.fecha) {
        // Filtramos las reservas del mismo recurso y fecha seleccionada
        const reservasDelDia = reservas.filter(
        (r) =>
            r.recursoId === formData.recurso.id &&
            r.inicioReserva.startsWith(formData.fecha)
        );

        // Generamos bloques de 09:00 a 18:00
        const bloques = [];
        for (let hora = 9; hora < 18; hora++) {
        bloques.push({
            inicio: `${hora.toString().padStart(2, "0")}:00`,
            fin: `${(hora + 1).toString().padStart(2, "0")}:00`,
            ocupado: false,
        });
        }

        // Convertimos reservas en horas ocupadas (por cada bloque)
        const ocupados = reservasDelDia.map((r) => {
        const fechaInicio = new Date(r.inicioReserva);
        const hora = fechaInicio.getHours();
        return `${hora.toString().padStart(2, "0")}:00`;
        });

        // Marcamos como ocupado los bloques que coinciden
        const bloquesMarcados = bloques.map((b) => ({
        ...b,
        ocupado: ocupados.includes(b.inicio),
        }));

        setBloquesDisponibles(bloquesMarcados);
    } else {
        setBloquesDisponibles([]);
    }
    }, [formData.recurso, formData.fecha, reservas]);


  const handleSave = async () => {
    // 👇 Para CLIENTE, el usuario SIEMPRE es el currentUser
    const usuarioId = currentUser?.id;

    if (!usuarioId || !formData.recurso.id || !formData.horaInicio) {
      alert("⚠️ Debes seleccionar recurso, fecha y horario.");
      return;
    }

    const estadoActiva = estadosReserva.find(
      (e) => e.nombre.toLowerCase() === "activa"
    );

    if (!formData.fecha || !formData.horaInicio || !formData.horaFin) {
      alert("⚠️ Debes seleccionar fecha y un bloque horario.");
      return;
    }

    const inicioReservaStr = `${formData.fecha}T${formData.horaInicio}:00`;
    const terminoReservaStr = `${formData.fecha}T${formData.horaFin}:00`;

    const inicioReserva = new Date(inicioReservaStr);
    const terminoReserva = new Date(terminoReservaStr);

    if (terminoReserva <= inicioReserva) {
      alert("⚠️ La hora de término debe ser posterior a la hora de inicio.");
      return;
    }

    const payload = {
      usuarioId, // 👈 SIEMPRE EL currentUser
      recursoId: formData.recurso.id,
      inicioReserva: inicioReserva.toISOString(),
      terminoReserva: terminoReserva.toISOString(),
      valor: formData.recurso.precio,
      estadoReservaId: estadoActiva?.id || 1,
    };

    try {
      await createReserva(payload);
      alert("✅ Reserva creada correctamente");
      setFormData({
        usuario: { id: null, nombre: "" },
        recurso: { id: null, nombre: "", precio: 0 },
        fecha: "",
        horaInicio: "",
        horaFin: "",
        estadoReserva: { id: null, nombre: "" },
      });
      await cargarReservas();
      setBloquesDisponibles([]);
    } catch (error) {
      console.error("❌ Error al crear reserva:", error);
      alert("No se pudo crear la reserva. Verifique los datos o la conexión.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Reserva</h2>

      <Card className="p-4 mt-3 shadow-sm">
        {/* Usuario (solo lectura, currentUser) */}
        <Form.Group className="mb-3">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type="text"
            value={currentUser?.nombre || ""}
            disabled
            readOnly
          />
          <Form.Text className="text-muted">
            La reserva se creará a nombre de este usuario.
          </Form.Text>
        </Form.Group>

        {/* Recurso */}
        <Form.Group className="mb-3">
          <Form.Label>Recurso</Form.Label>
          <Form.Select
            value={formData.recurso.id || ""}
            onChange={(e) => {
              const sel = recursos.find((r) => r.id === Number(e.target.value));
              setFormData((f) => ({
                ...f,
                recurso: sel || { id: null, nombre: "", precio: 0 },
              }));
            }}
          >
            <option value="">Seleccione un recurso</option>
            {recursos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre} (${r.precio.toLocaleString("es-CL")})
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        {/* Fecha */}
        <Form.Group className="mb-3">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            value={formData.fecha}
            onChange={(e) =>
              setFormData((f) => ({ ...f, fecha: e.target.value }))
            }
          />
        </Form.Group>

        {/* Bloques horarios */}
        {bloquesDisponibles.length > 0 && (
            <>
                <Form.Label>Seleccione horario</Form.Label>
                <Row>
                {bloquesDisponibles.map((b, idx) => (
                    <Col key={idx} xs={6} md={3} className="mb-2">
                    <Button
                        variant={
                        b.ocupado
                            ? "secondary"
                            : formData.horaInicio === b.inicio
                            ? "success"
                            : "outline-success"
                        }
                        disabled={b.ocupado}
                        className="w-100 fw-bold"
                        style={{
                        cursor: b.ocupado ? "not-allowed" : "pointer",
                        opacity: b.ocupado ? 0.6 : 1,
                        }}
                        onClick={() => {
                        if (!b.ocupado) {
                            setFormData((f) => ({
                            ...f,
                            horaInicio: b.inicio,
                            horaFin: b.fin,
                            }));
                        }
                        }}
                    >
                        {b.inicio} - {b.fin}
                    </Button>
                    </Col>
                ))}
                </Row>
            </>
            )}

        {/* Resumen */}
        {formData.horaInicio && (
          <Card className="mt-4 p-3 bg-light">
            <h5>Resumen de la reserva</h5>
            <p><strong>Usuario:</strong> {currentUser?.nombre}</p>
            <p><strong>Recurso:</strong> {formData.recurso.nombre}</p>
            <p><strong>Fecha:</strong> {formData.fecha}</p>
            <p><strong>Horario:</strong> {formData.horaInicio} - {formData.horaFin}</p>
            <p><strong>Valor:</strong> ${formData.recurso.precio.toLocaleString("es-CL")}</p>

            <Button variant="success" onClick={handleSave}>
              Confirmar Reserva
            </Button>
          </Card>
        )}
      </Card>
    </div>
  );
}
