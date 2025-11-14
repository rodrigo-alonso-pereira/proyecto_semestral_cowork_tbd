import api from "./api";

export const getAllRecursos = () => api.get("/recurso");
export const getRecursoById = (id) => api.get(`/recurso/${id}`);
export const createRecurso = (data) => api.post("/recurso", data);
export const updateRecurso = (id, data) => api.put(`/recurso/${id}`, data);
export const deleteRecurso = (id) => api.delete(`/recurso/${id}`);