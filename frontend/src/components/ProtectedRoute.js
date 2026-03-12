import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 * Redirects to login if user is not authenticated
 * Optionally checks for specific roles
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="container">
        <div className="card">
          <h2>❌ Access Denied</h2>
          <p>You do not have permission to access this page.</p>
          <p>Required Role: <strong>{requiredRole}</strong></p>
          <p>Your Role: <strong>{user.role}</strong></p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
