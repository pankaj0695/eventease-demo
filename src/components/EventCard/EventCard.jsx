import { Link } from "react-router-dom";
import styles from "./EventCard.module.css";

function EventCard({ event }) {
  // Format the date to show only month, date and year
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={event.imageUrl} alt={event.title} className={styles.image} />
        <div className={styles.imageOverlay}>
          <div className={styles.overlayDetails}>
            <p className={styles.date}>
              <i className="far fa-calendar"></i> {formatDate(event.date)}
            </p>
            <p className={styles.location}>
              <i className="fas fa-map-marker-alt"></i> {event.location}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <h3 className={styles.title}>{event.title}</h3>
          <div className={styles.category}>{event.category}</div>
        </div>
        <p className={styles.description}>
          {event.description.length > 80
            ? event.description.slice(0, 80) + "..."
            : event.description}
        </p>
        <Link to={`/events/${event.id}`} className={styles.detailsLink}>
          View Details
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
