import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Role required but user doesn't have it
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;