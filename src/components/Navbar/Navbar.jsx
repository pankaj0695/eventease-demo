import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Logout } from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-hot-toast";
import styles from "./Navbar.module.css";
import logo from "/EventEase_Logo.png";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();

  // Always call hooks at the top level, never inside a conditional
  // Hide navbar on login/signup by rendering null later
  const shouldHideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = (e) => {
    if (e) e.preventDefault();
    setDropdownOpen(false);
    Logout().then(() => {
      navigate("/login");
    });
  };

  const handleAddEventClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.error("Please login to add an event", {
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
      navigate("/login", { state: { from: "/addevent" } });
    }
  };

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <a href="/" className={styles.left}>
        <img src={logo} alt="EventEase Logo" className={styles.logo} />
        <span className={styles.title}>EventEase</span>
      </a>
      <div className={styles.right}>
        <Link to="/events" className={styles.link}>
          Events
        </Link>
        <Link
          to="/addevent"
          className={styles.link}
          onClick={handleAddEventClick}
        >
          Add Event
        </Link>
        {isLoggedIn ? (
          <div className={styles.profileWrapper} ref={dropdownRef}>
            <button
              className={styles.profileBtn}
              onClick={() => setDropdownOpen((open) => !open)}
              aria-label="Profile"
            >
              <div className={styles.userInfo}>
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className={styles.profileImage}
                  />
                ) : (
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={styles.profileIcon}
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
                  </svg>
                )}
                <span className={styles.userName}>
                  {user?.displayName || user?.email?.split("@")[0]}
                </span>
              </div>
            </button>
            {dropdownOpen && (
              <div className={styles.dropdown}>
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={`${styles.link} ${styles.loginBtn}`}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
