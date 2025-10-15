// frontend/SocietyApp.jsx
import { useState } from "react";
import "./App.css";

export default function SocietyApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  
  const [events, setEvents] = useState([]); 
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [announcementText, setAnnouncementText] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email) {
      setLoggedIn(true);
      // NOTE: In a complete app, you'd fetch the society's existing events here.
    } else {
      alert("Enter society email!");
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title || !date || !desc) {
      alert("Fill all event details!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/add_event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, desc }),
      });

      if (!response.ok) {
        // Attempt to parse a server error message if present
        const errorData = await response.json().catch(() => ({ message: "Unknown server error or network issue." }));
        throw new Error(`Failed to add event: ${errorData.message}`);
      }

      const newEvent = await response.json();

      console.log("New Event Added:", newEvent);
      alert("Event Added! Predicted Tags: " + (newEvent.tags?.join(", ") || "None predicted. Check backend console."));

      setEvents([...events, newEvent]);
      setTitle("");
      setDate("");
      setDesc("");
    } catch (err) {
      console.error("Error adding event:", err.message);
      alert(`Could not add event. Please check FastAPI console and Gemini API key. Error: ${err.message}`);
    }
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText) {
      alert("Announcement cannot be empty!");
      return;
    }
    setAnnouncements([
      ...announcements,
      { id: Date.now(), text: announcementText },
    ]);
    setAnnouncementText("");
  };

  // 🗑️ Delete Event Handler
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_event/${id}`, { method: "DELETE" });
      if (response.ok) {
        setEvents(events.filter(ev => ev.id !== id));
        alert("Event deleted!");
      } else {
        alert("Failed to delete event on server.");
      }
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };
  
  // ✏️ Edit Event Handler (Simplified: just shows an alert)
  const handleEdit = (event) => {
    alert(`Editing event: ${event.title}. Not fully implemented for state management in this demo.`);
    // A full implementation would load the event data into the form fields.
  };

  if (!loggedIn) {
    return (
      <div className="center-bg">
        <form onSubmit={handleLogin} className="login-card">
          <h2 className="login-title">Society Admin Login</h2>
          <input
            type="email"
            placeholder="Society Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="center-bg" style={{ alignItems: "flex-start" }}>
      <div className="dashboard-card" style={{ width: "100%", maxWidth: 600 }}>
        <div className="profile-row">
          <div className="profile-avatar">
            <span role="img" aria-label="society" className="profile-icon">🏫</span>
          </div>
          <div>
            <h1 className="dashboard-title">Society Admin Dashboard</h1>
            <p className="dashboard-email">{email}</p>
          </div>
        </div>

        {/* Add Event */}
        <h2 className="events-title">Create New Event</h2>
        <form onSubmit={handleAddEvent} style={{ width: "100%" }}>
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="dashboard-input"
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="dashboard-input"
            required
          />
          <textarea
            placeholder="Event Description (Tags will be predicted from this)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="dashboard-input"
            required
          />
          <button type="submit" className="dashboard-btn">
            ➕ Add Event
          </button>
        </form>

        {/* Display Events */}
        <h2 className="events-title">Your Posted Events</h2>
        {events.length === 0 ? (
          <p>No events yet. Add an event above to see it here.</p>
        ) : (
          <div className="event-list">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-title">{event.title}</div>
                <div className="event-date">{event.date}</div>
                <div className="event-desc">{event.desc}</div>
                <div style={{ fontWeight: 500, color: "#2563eb" }}>
                  Predicted Tags:{" "}
                  <span style={{ color: "#1e293b" }}>
                    {event.tags?.join(", ") || "No Tags Predicted"} {/* Fallback text added */}
                  </span>
                </div>
                {/* Action buttons */}
                <div className="event-actions">
                  <button
                    onClick={() => handleEdit(event)}
                    className="dashboard-btn"
                    style={{ marginRight: "8px" }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="dashboard-btn"
                    style={{ background: "#ef4444" }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Announcements */}
        <h2 className="events-title">Post Announcement</h2>
        <form onSubmit={handleAddAnnouncement} style={{ width: "100%" }}>
          <textarea
            placeholder="Type announcement..."
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
            className="dashboard-input"
            required
          />
          <button type="submit" className="dashboard-btn">
            📢 Post
          </button>
        </form>
        {announcements.length > 0 && (
          <div style={{ marginTop: "1rem", width: "100%" }}>
            <h3 style={{ color: "#2563eb", marginBottom: "0.5rem" }}>Announcements</h3>
            {announcements.map(a => (
              <div key={a.id} className="announcement-box">
                {a.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}