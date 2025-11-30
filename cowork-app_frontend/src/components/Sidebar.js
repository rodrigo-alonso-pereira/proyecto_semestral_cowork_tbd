import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserFriends, FaCalendarAlt, FaDoorOpen, FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import "./Sidebar.css";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [openReservas, setOpenReservas] = useState(false);
  const { currentUser, role, logout  } = useAuth(); 

  const roleLabel =
    role === "ADMIN" ? "Administrador" :
    role === "CLIENTE" ? "Cliente" :
    "";

  const handleLogout = () => {
    logout();                   
    navigate("/login", { replace: true }); 
  };
  return (
    <div className="sidebar d-flex flex-column p-3 bg-dark text-white" style={{ minHeight: "100vh" }}>

      <div className="d-flex flex-column align-items-center mb-4 ps-2">
      <img
        src={`${process.env.PUBLIC_URL}/logo.png`}
        alt="Cowork App Logo"
        style={{
          width: "48px",
          height: "48px",
          objectFit: "contain",
          borderRadius: "8px",
          padding: "4px",
        }}
      />
      <h5 className="mt-1 mb-0 text-center">Cowork App</h5>

      {currentUser && (
        <div className="mt-2 text-center small text-muted">
          <span style={{ color: "#ffffff", fontWeight: 600 }}>
            {currentUser.nombre}
          </span>
        </div>
      )}
    </div>


      <ul className="nav nav-pills flex-column mb-auto">
        {/* Home para todos */}
        <li className="mb-2">
          <Link
            to="/"
            className={`nav-link text-white ${location.pathname === "/" ? "active" : ""}`}
          >
            🏠 Inicio
          </Link>
        </li>

          {/* Sección RESERVAS: visible si es Cliente o Admin */}
        {(role === "ADMIN" || role === "CLIENTE") && (
          <li className="mb-2">
            <button
              className="btn btn-toggle align-items-center rounded collapsed nav-link text-white d-flex justify-content-between w-100"
              onClick={() => setOpenReservas(!openReservas)}
            >
              <span>
                <FaCalendarAlt className="me-2" />
                Reservas
              </span>
              <FaChevronDown
                className={`ms-2 ${openReservas ? "rotate-180" : ""}`}
                style={{ transition: "transform 0.2s" }}
              />
            </button>

            {openReservas && (
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small ms-4 mt-2">
                {/* Crear reserva: solo Cliente */}
                {role === "CLIENTE" && (
                  <li className="mb-1">
                    <Link
                      to="/reservas/crear"
                      className={`nav-link text-white ${
                        location.pathname === "/reservas/crear" ? "active" : ""
                      }`}
                    >
                      Crear reserva
                    </Link>
                  </li>
                )}
                 {/* Mis reservas: solo Cliente */}
                {role === "CLIENTE" && (
                  <li className="mb-1">
                    <Link
                      to="/reservas/mis-reservas"
                      className={`nav-link text-white ${
                        location.pathname === "/reservas/mis-reservas" ? "active" : ""
                      }`}
                    >
                      Mis reservas
                    </Link>
                  </li>
                )}

                {/* Administración reservas: solo Admin */}
                {role === "ADMIN" && (
                  <li className="mb-1">
                    <Link
                      to="/reservas/admin"
                      className={`nav-link text-white ${
                        location.pathname === "/reservas/admin" ? "active" : ""
                      }`}
                    >
                      Administración reservas
                    </Link>
                  </li>
                )}
              </ul>
            )}
          </li>
        )}
        {/* Mi plan: solo Cliente */}
        {role === "CLIENTE" && (
          <li className="nav-item">
            <Link
              to="/mi-plan"
              className={`nav-link text-white ${
                location.pathname === "/mi-plan" ? "active" : ""
              }`}
            >
              📊 Mi plan
            </Link>
          </li>
        )}

        {/* Mis facturas: solo Cliente */}
        {role === "CLIENTE" && (
          <li className="nav-item">
            <Link
              to="/mis-facturas"
              className={`nav-link text-white ${
                location.pathname === "/mis-facturas" ? "active" : ""
              }`}
            >
              🧾 Mis facturas
            </Link>
          </li>
        )}

        {/* Usuarios: solo Admin */}
        {role === "ADMIN" && (
          <li className="mb-2">
            <Link
              to="/usuarios"
              className={`nav-link text-white ${location.pathname === "/usuarios" ? "active" : ""}`}
            >
              <FaUserFriends className="me-2" /> Usuarios
            </Link>
          </li>
        )}

        {/* Recursos: solo Admin */}
        {role === "ADMIN" && (
          <li>
            <Link
              to="/recursos"
              className={`nav-link text-white ${location.pathname === "/recursos" ? "active" : ""}`}
            >
              <FaDoorOpen className="me-2" /> Recursos
            </Link>
          </li>
        )}

        
      </ul>
      <hr className="border-secondary mt-4" />

      <button
        className="btn btn-outline-light w-100 mt-2"
        onClick={handleLogout}
      >
        Cerrar sesión
      </button>
    </div>
  );
}

export default Sidebar;