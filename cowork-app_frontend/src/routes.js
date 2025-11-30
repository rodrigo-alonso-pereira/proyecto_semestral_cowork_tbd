import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/home";
import Usuarios from "./pages/Usuarios";
import ReservasCrear from "./pages/ReservasCrear";
import ReservasAdmin from "./pages/ReservasAdmin";
import Recursos from "./pages/Recursos";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";   


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
        </Route>
      </Routes>
    </Router>
  );
}


export default AppRoutes;