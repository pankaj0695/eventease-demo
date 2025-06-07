import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-hot-toast";

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Show toast notification for direct URL access
    toast.error("Please login to access this page", {
      duration: 3000,
      position: "top-center",
      style: {
        background: "var(--frost)",
        color: "var(--navy)",
        border: "1.5px solid var(--teal)",
        borderRadius: "8px",
        fontSize: "1rem",
        padding: "12px 20px",
      },
    });

    // Redirect to login page while preserving the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default ProtectedRoute;
