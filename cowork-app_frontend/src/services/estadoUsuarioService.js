import api from "./api";

export const getAllEstadosUsuario = () => api.get("/estado-usuario");
export const getEstadoUsuarioById = (id) => api.get(`/estado-usuario/${id}`);
