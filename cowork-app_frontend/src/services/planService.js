import api from "./api";

export const getAllPlanes = () => api.get("/plan");
export const getPlanById = (id) => api.get(`/plan/${id}`);