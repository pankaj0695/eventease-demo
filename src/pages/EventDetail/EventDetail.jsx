import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import styles from "./EventDetail.module.css";

function EventDetail() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const eventDoc = await getDoc(doc(db, "events", eventId));
        if (eventDoc.exists()) {
          setEvent({ id: eventDoc.id, ...eventDoc.data() });
        } else {
          setError("Event not found");
        }
      } catch (err) {
        setError("Failed to fetch event details");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading event details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className={styles.container}>
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
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{event.title}</h1>
            <span className={styles.category}>{event.category}</span>
          </div>
          <div className={styles.organizerInfo}>
            <h3>Organized by</h3>
            <p className={styles.organizerName}>
              <i className="fas fa-user"></i> {event.organizerName}
            </p>
            {event.contactEmail &&
              event.contactEmail !== event.organizerEmail && (
                <p className={styles.organizerEmail}>
                  <i className="fas fa-envelope"></i> {event.contactEmail}
                </p>
              )}
          </div>
        </div>

        <div className={styles.description}>
          <h2>About the Event</h2>
          <p>{event.description}</p>
        </div>

        {event.entryFee && (
          <div className={styles.entryFee}>
            <h3>Entry Fee</h3>
            <p>{event.entryFee ? `₹${event.entryFee}` : "Free Entry"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetail;
