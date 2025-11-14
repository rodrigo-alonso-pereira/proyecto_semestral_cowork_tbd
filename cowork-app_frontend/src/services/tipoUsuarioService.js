import api from "./api";

export const getAllTiposUsuario = () => api.get("/tipo-usuario");
export const getTipoUsuarioById = (id) => api.get(`/tipo-usuario/${id}`);