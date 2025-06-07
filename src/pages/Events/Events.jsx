import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import EventCard from "../../components/EventCard/EventCard";
import styles from "./Events.module.css";
import { toast } from "react-hot-toast";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsQuery = query(
        collection(db, "events"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(eventsQuery);

      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to Date string for display
        date: doc.data().date,
      }));

      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.eventsContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.eventsContainer}>
      <h2 className={styles.heading}>Discover Events</h2>
      {events.length === 0 ? (
        <div className={styles.noEvents}>
          <p>No events found. Be the first to create one!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
