import { Link, useLocation } from "react-router-dom";
import { FaUserFriends, FaCalendarAlt, FaDoorOpen, FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const [openReservas, setOpenReservas] = useState(false);

  return (
    <div className="sidebar d-flex flex-column p-3 bg-dark text-white" style={{ minHeight: "100vh" }}>
      <div className="d-flex align-items-center mb-4 ps-2">
        <img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Cowork App Logo"
          style={{
            width: "35px",
            height: "35px",
            marginRight: "10px",
            objectFit: "contain",
          }}
        />
        <h4 className="m-0 fw-bold">Cowork App</h4>
      </div>


      <ul className="nav nav-pills flex-column mb-auto">

        <li className="nav-item">
          <Link
            to="/usuarios"
            className={`nav-link text-white ${location.pathname === "/usuarios" ? "active" : ""}`}
          >
            <FaUserFriends className="me-2" /> Usuarios
          </Link>
        </li>

        <li>
          <button
            className="nav-link text-white w-100 text-start bg-transparent border-0 d-flex justify-content-between align-items-center"
            onClick={() => setOpenReservas(!openReservas)}
          >
            <span>
              <FaCalendarAlt className="me-2" /> Reservas
            </span>
            <FaChevronDown
              style={{
                transform: openReservas ? "rotate(180deg)" : "rotate(0deg)",
                transition: "0.2s",
              }}
            />
          </button>

          {openReservas && (
            <ul className="nav flex-column ms-4 mt-2">
              <li>
                <Link
                  to="/reservas/crear"
                  className={`nav-link text-white ${location.pathname === "/reservas/crear" ? "active" : ""}`}
                >
                  Reservar
                </Link>
              </li>
              <li>
                <Link
                  to="/reservas/admin"
                  className={`nav-link text-white ${location.pathname === "/reservas/admin" ? "active" : ""}`}
                >
                  Administrar
                </Link>
              </li>
            </ul>
          )}
        </li>

        <li>
          <Link
            to="/recursos"
            className={`nav-link text-white ${location.pathname === "/recursos" ? "active" : ""}`}
          >
            <FaDoorOpen className="me-2" /> Recursos
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;