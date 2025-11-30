// src/services/facturaService.js
import api from "./api";

// Obtener todas las facturas de un usuario específico
export const getFacturasByUsuario = (usuarioId) =>
  api.get(`/factura/usuario/${usuarioId}`);

// (opcional, por si después quieres filtrar por mes/año)
// export const getFacturasByUsuarioYPeriodo = (usuarioId, mes, anio) =>
//   api.get(`/factura/usuario/${usuarioId}/mes/${mes}/anio/${anio}`);