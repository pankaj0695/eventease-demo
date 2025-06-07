import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { LoginWithGoogle } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import styles from "./Auth.module.css";
import logo from "/EventEase_Logo.png";

function Auth({ isSignup, onSubmit, error }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isLoggedIn } = useAuth();

  const toggleText = isSignup
    ? "Already have an account?"
    : "Don't have an account?";
  const toggleLink = isSignup ? "/login" : "/signup";
  const toggleLinkText = isSignup ? "Login" : "Sign Up";

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(e);
    setIsSubmitting(false);
  };

  const onGoogleLogIn = (e) => {
    e.preventDefault();
    if (!isSubmitting) {
      setIsSubmitting(true);
      LoginWithGoogle().catch((err) => {
        setIsSubmitting(false);
      });
    }
  };

  return (
    <>
      {isLoggedIn && <Navigate to="/" replace={true} />}
      <div className={styles.centerWrapper}>
        <a href="/" className={styles.logoTitleWrapper}>
          <img src={logo} alt="EventEase Logo" className={styles.logo} />
          <span className={styles.title}>EventEase</span>
        </a>
        <form className={styles.form} onSubmit={submitHandler}>
          <h2>{isSignup ? "Sign Up" : "Login"}</h2>

          {error && <div className={styles.errorMsg}>{error}</div>}

          {isSignup && (
            <div className={styles.inputGroup}>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" required />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>

          <button type="submit" className={styles.submitBtn}>
            {!isSubmitting
              ? isSignup
                ? "Create Account"
                : "Login"
              : isSignup
              ? "Creating ..."
              : "Logging In..."}
          </button>

          {/* Google Sign In Button for Login only */}
          {!isSignup && (
            <button
              type="button"
              className={styles.googleBtn}
              onClick={onGoogleLogIn}
              disabled={isSubmitting}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png"
                alt="Google logo"
                className={styles.googleLogo}
                width={22}
                height={22}
                style={{ marginRight: 10, verticalAlign: "middle" }}
              />
              Continue with Google
            </button>
          )}

          <div className={styles.toggleAuth}>
            {toggleText} <Link to={toggleLink}>{toggleLinkText}</Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Auth;
