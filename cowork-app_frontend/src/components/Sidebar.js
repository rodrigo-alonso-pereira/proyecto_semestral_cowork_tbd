import { Link, useLocation } from "react-router-dom";
import { FaUserFriends, FaCalendarAlt, FaDoorOpen } from "react-icons/fa";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();

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

        <li>
          <Link
            to="/reservas"
            className={`nav-link text-white ${location.pathname === "/reservas" ? "active" : ""}`}
          >
            <FaCalendarAlt className="me-2" /> Reservas
          </Link>
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