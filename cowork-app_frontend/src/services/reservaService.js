import api from "./api";

export const getAllReservas = () => api.get("/reserva");
export const getReservaById = (id) => api.get(`/reserva/${id}`);
export const createReserva = (data) => api.post("/reserva", data);
export const updateReserva = (id, data) => api.put(`/reserva/${id}`, data);
export const deleteReserva = (id) => api.delete(`/reserva/${id}`);
export const getReservasByUsuario = (usuarioId) =>
  api.get(`/reserva/usuario/${usuarioId}`);