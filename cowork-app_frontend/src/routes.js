import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/home";
import Usuarios from "./pages/Usuarios";
import ReservasCrear from "./pages/ReservasCrear";
import ReservasAdmin from "./pages/ReservasAdmin";
import Recursos from "./pages/Recursos";

function AppRoutes() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/reservas/crear" element={<ReservasCrear />} />
            <Route path="/reservas/admin" element={<ReservasAdmin />} />
            <Route path="/recursos" element={<Recursos />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AppRoutes;