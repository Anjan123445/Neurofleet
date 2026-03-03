import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" />;

  if (role && profile?.role !== role)
    return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;