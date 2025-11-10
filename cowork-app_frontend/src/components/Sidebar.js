import { Link, useLocation } from "react-router-dom";
import { FaUserFriends, FaCalendarAlt, FaDoorOpen, FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const [openReservas, setOpenReservas] = useState(false);

  return (
    <div className="sidebar d-flex flex-column p-3 bg-dark text-white">
      <h3 className="text-center mb-4">Cowork App</h3>

      <ul className="nav nav-pills flex-column mb-auto">

        <li className="nav-item">
          <Link
            to="/usuarios"
            className={`nav-link text-white ${location.pathname === "/usuarios" ? "active" : ""}`}
          >
            <FaUserFriends className="me-2" /> Usuarios
          </Link>
        </li>

        {/* Reservas con submenú */}
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