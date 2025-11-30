// src/services/authService.js
import api from "./api";

// Llama a POST /api/v1/usuario/login
export async function login(email, password) {
  const response = await api.post("/usuario/login", {
    email,
    password,
  });
  return response.data;
}
