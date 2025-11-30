import api from "./api";

export const getAllUsuarios = () => api.get("/usuario");
export const getUsuarioById = (id) => api.get(`/usuario/${id}`);
export const createUsuario = (data) => api.post("/usuario", data);
export const updateUsuario = (id, data) => api.put(`/usuario/${id}`, data);
export const deleteUsuario = (id) => api.delete(`/usuario/${id}`);
export const getHorasRestantes = (usuarioId) =>
  api.get(`/usuario/${usuarioId}/horas-restantes`);