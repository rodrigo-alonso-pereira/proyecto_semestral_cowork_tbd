import api from "./api";

export const getAllEstadosRecurso = () => api.get("/estado-recurso");
export const getEstadoRecursoById = (id) => api.get(`/estado-recurso/${id}`);