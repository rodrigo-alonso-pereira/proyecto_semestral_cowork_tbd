import api from "./api";

// Historial admin: todas las facturas
export const getAllFacturas = () => api.get("/factura");
// Obtener todas las facturas de un usuario específico
export const getFacturasByUsuario = (usuarioId) =>
  api.get(`/factura/usuario/${usuarioId}`);

export const updateFacturaEstado = (id, estadoFacturaId) =>
  api.patch(`/factura/${id}/estado`, { estadoFacturaId });
