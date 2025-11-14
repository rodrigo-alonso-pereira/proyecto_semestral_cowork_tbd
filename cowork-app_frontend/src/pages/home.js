import React from "react";
import { Card } from "react-bootstrap";

export default function Home() {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 bg-light"
      style={{
        background: "linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)",
      }}
    >
      <Card
        className="shadow-lg text-center p-4 border-0"
        style={{
          maxWidth: "500px",
          borderRadius: "20px",
          backgroundColor: "white",
        }}
      >
        <Card.Body>
          <h1
            className="fw-bold mb-3"
            style={{ color: "#198754", fontSize: "2rem" }}
          >
            Bienvenido a CoworkApp
          </h1>

          <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
            Plataforma web para gestionar espacios colaborativos, reservas y
            membresías de manera simple, rápida y eficiente.
          </p>

          <hr className="my-4" />

          <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
            Desarrollado con <strong>React</strong> y <strong>Spring Boot</strong> — Proyecto de Taller de Base de Datos.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}