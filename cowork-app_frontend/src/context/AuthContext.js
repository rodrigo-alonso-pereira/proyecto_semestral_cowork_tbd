// src/context/AuthContext.js
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Error leyendo currentUser desde localStorage:", e);
      return null;
    }
  });

  // Sincronizar con localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("currentUser");
      }
    } catch (e) {
      console.error("Error guardando currentUser en localStorage:", e);
    }
  }, [currentUser]);

  // Mapear tipoUsuarioId → role
  const role = useMemo(() => {
    if (!currentUser) return null;

    const tipoId =
      currentUser.tipoUsuarioId ??
      currentUser.tipoUsuario?.id ??
      null;

    // 1 = Administrador
    if (tipoId === 1) {
      return "ADMIN";
    }

    // 3 = Cliente
    if (tipoId === 3) {
      return "CLIENTE";
    }

    // Otros tipos: por defecto los tratamos como cliente
    return "CLIENTE";
  }, [currentUser]);

  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    setCurrentUser, // lo usará el Login
    role,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
