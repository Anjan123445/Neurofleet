import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import FleetDashboard from "./pages/FleetDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";

function App() {
  const { profile } = useAuth();

  const getRedirectPath = () => {
    if (!profile) return "/login";
    if (profile.role === "customer") return "/customer";
    if (profile.role === "driver") return "/driver";
    if (profile.role === "fleet_manager") return "/fleet";
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/customer"
          element={
            <ProtectedRoute role="customer">
              <DashboardLayout>
                <CustomerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/driver"
          element={
            <ProtectedRoute role="driver">
              <DashboardLayout>
                <DriverDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fleet"
          element={
            <ProtectedRoute role="fleet_manager">
              <DashboardLayout>
                <FleetDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to={getRedirectPath()} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;