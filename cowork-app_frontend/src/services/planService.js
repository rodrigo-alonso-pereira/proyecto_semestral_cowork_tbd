import api from "./api";

// Obtener todos los planes
export const getAllPlanes = () => api.get("/plan");

// Obtener un plan por ID (por si se necesita)
export const getPlanById = (id) => api.get(`/plan/${id}`);

// Crear un nuevo plan
export const createPlan = (data) => api.post("/plan", data);

// Actualizar un plan existente
export const updatePlan = (id, data) => api.put(`/plan/${id}`, data);

// Eliminar un plan
export const deletePlan = (id) => api.delete(`/plan/${id}`);
