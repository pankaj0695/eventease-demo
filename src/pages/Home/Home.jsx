import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { toast } from "react-hot-toast";
import styles from "./Home.module.css";

function Home() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className={styles.homeContainer}>
      <img
        src="https://images.unsplash.com/photo-1613093335399-829e30811789?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Event background"
        className={styles.backgroundImage}
      />
      <div className={styles.overlay}></div>
      <div className={styles.heroSection}>
        <h1 className={styles.title}>
          Welcome to <span>EventEase</span>
        </h1>
        <p className={styles.tagline}>
          Discover, host, and manage events with ease. Your gateway to seamless
          event experiences.
        </p>
        <div className={styles.buttons}>
          <Link to="/events" className={styles.buttonPrimary}>
            Explore Events
          </Link>
          <Link
            to="/addevent"
            className={styles.buttonSecondary}
            onClick={handleAddEventClick}
          >
            Add Event
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
