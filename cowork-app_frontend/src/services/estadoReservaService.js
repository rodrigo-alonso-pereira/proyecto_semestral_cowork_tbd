import api from "./api";

export const getAllEstadosReserva = () => api.get("/estado-reserva");
export const getEstadoReservaById = (id) => api.get(`/estado-reserva/${id}`);