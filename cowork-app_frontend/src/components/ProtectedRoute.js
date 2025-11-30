// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, role } = useAuth();

  // Si no hay usuario logueado → ir a /login
  if (!currentUser || !role) {
    return <Navigate to="/login" replace />;
  }

  // Si tiene usuario, pero el rol no está permitido → ir al home
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}