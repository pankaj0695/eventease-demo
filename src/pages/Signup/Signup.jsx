import Auth from "../../components/Auth/Auth";
import { signUpWithEmailPassword } from "../../firebase/auth";
import { useState } from "react";

function Signup() {
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await signUpWithEmailPassword(email, password, name);
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    }
  };

  return <Auth isSignup={true} onSubmit={handleSignup} error={error} />;
}

export default Signup;
