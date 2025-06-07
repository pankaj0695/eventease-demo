import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../../components/Auth/Auth";
import { LoginWithEmailPassword } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { useState } from "react";

function Login() {
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  // Get the path user tried to visit before being redirected to login
  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await LoginWithEmailPassword(email, password);
      // Redirect to the page they tried to visit or home
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return <Auth isSignup={false} onSubmit={handleLogin} error={error} />;
}

export default Login;
