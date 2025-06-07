// src/pages/AddEvent.jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import styles from "./AddEvent.module.css";
import { db } from "../../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function AddEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    organizerName: "",
    contactEmail: "",
    category: "",
    imageFile: null,
  });

  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile" && files[0]) {
      setFormData({ ...formData, imageFile: files[0] });
      // Create preview URL for the selected image
      const url = URL.createObjectURL(files[0]);
      setPreviewUrl(url);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const {
        title,
        description,
        date,
        location,
        organizerName,
        contactEmail,
        category,
        imageFile,
      } = formData;

      // Show loading toast
      const loadingToast = toast.loading("Creating your event...");

      // 1. Upload to Cloudinary
      const cloudName = "dnfkcjujc";
      const uploadPreset = "EventEase-demo";

      const imageData = new FormData();
      imageData.append("file", imageFile);
      imageData.append("upload_preset", uploadPreset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: imageData,
        }
      );

      const data = await res.json();
      const imageUrl = data.secure_url;

      // 2. Add event to Firestore
      await addDoc(collection(db, "events"), {
        title,
        description,
        date,
        location,
        organizerName,
        contactEmail,
        category,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Event created successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        organizerName: "",
        contactEmail: "",
        category: "",
        imageFile: null,
      });
      setPreviewUrl(null);

      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error uploading or saving:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.formContainer}>
        <h2>Create New Event</h2>
        <p className={styles.subtitle}>
          Fill in the details to create your event
        </p>

        <form className={styles.form} onSubmit={handleSubmit} data-testid="add-event-form">
          <div className={styles.formGrid}>
            <div className={styles.formSection}>
              <h3>Basic Information</h3>
              <div className={styles.inputGroup}>
                <label htmlFor="title">Event Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  placeholder="Enter event title"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="description">Event Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  placeholder="Describe your event"
                  required
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="date">Date and Time</label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  required
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  placeholder="Event location"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="category">Event Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  placeholder="e.g. Tech, Music, Sports"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="imageFile">Event Image</label>
                <div className={styles.imageUploadContainer}>
                  <input
                    type="file"
                    id="imageFile"
                    name="imageFile"
                    accept="image/*"
                    required
                    onChange={handleChange}
                    className={styles.fileInput}
                  />
                  {previewUrl && (
                    <div className={styles.imagePreview}>
                      <img src={previewUrl} alt="Preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Organizer Details</h3>
              <div className={styles.inputGroup}>
                <label htmlFor="organizerName">Organizer Name</label>
                <input
                  type="text"
                  id="organizerName"
                  name="organizerName"
                  value={formData.organizerName}
                  placeholder="Name of the organizer"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="contactEmail">Contact Email</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  placeholder="Contact email"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={styles.submitButton}
          >
            {uploading ? (
              <span className={styles.loadingText}>
                <span className={styles.spinner}></span>
                Creating Event...
              </span>
            ) : (
              "Create Event"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddEvent;
