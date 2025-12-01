import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/home";
import Usuarios from "./pages/Usuarios";
import ReservasCrear from "./pages/ReservasCrear";
import ReservasAdmin from "./pages/ReservasAdmin";
import Recursos from "./pages/Recursos";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";  
import MisReservas from "./pages/MisReservas"; 
import MiPlan from "./pages/MiPlan";
import MisFacturas from "./pages/MisFacturas";
import Planes from "./pages/Planes";
import HistorialFacturacion from "./pages/HistorialFacturacion";


function PrivateLayout() {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ marginLeft: "250px" }}>
        <Outlet />
      </div>
    </div>
  );
}


function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* 🔹 LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* 🔹 Rutas PRIVADAS*/}
        <Route element={<PrivateLayout />}>
          {/* Home */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          {/* Solo CLIENTE puede crear reservas */}
          <Route
            path="/reservas/crear"
            element={
              <ProtectedRoute allowedRoles={["CLIENTE"]}>
                <ReservasCrear />
              </ProtectedRoute>
            }
          />
          {/* Solo CLIENTE: Mis reservas */}
          <Route
            path="/reservas/mis-reservas"
            element={
              <ProtectedRoute allowedRoles={["CLIENTE"]}>
                <MisReservas />
              </ProtectedRoute>
            }
          />
          {/* Mi plan: solo Cliente */}
          <Route
            path="/mi-plan"
            element={
              <ProtectedRoute allowedRoles={["CLIENTE"]}>
                <MiPlan />
              </ProtectedRoute>
            }
          />
          {/* Mis facturas: solo Cliente */}
          <Route
            path="/mis-facturas"
            element={
              <ProtectedRoute allowedRoles={["CLIENTE"]}>
                <MisFacturas />
              </ProtectedRoute>
            }
          />

          {/* Solo ADMIN puede ver administración de reservas */}
          <Route
            path="/reservas/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <ReservasAdmin />
              </ProtectedRoute>
            }
          />

          {/* Solo ADMIN puede ver usuarios */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Usuarios />
              </ProtectedRoute>
            }
          />

          {/* Solo ADMIN puede ver recursos */}
          <Route
            path="/recursos"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Recursos />
              </ProtectedRoute>
            }
          />
          {/* Gestión de planes: solo Admin */}
          <Route
            path="/planes"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Planes />
              </ProtectedRoute>
            }           
          />
          {/* Gestión de facturas: solo Admin */}
          <Route
            path="/historial-facturacion"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <HistorialFacturacion />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}


export default AppRoutes;