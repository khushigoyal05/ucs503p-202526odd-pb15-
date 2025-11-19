import { useState, useEffect } from "react";
import "./App.css";

const API_BASE = "https://societyconnect.onrender.com";

export default function SocietyApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");

  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");

  const [announcements, setAnnouncements] = useState([]);
  const [announcementText, setAnnouncementText] = useState("");

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_BASE}/get_events`);
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // Run fetch after login
  useEffect(() => {
    if (loggedIn) {
      fetchEvents();
    }
  }, [loggedIn]);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (email) {
      setLoggedIn(true);
    } else {
      alert("Enter society email!");
    }
  };

  // Add new event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title || !date || !desc) {
      alert("Fill all event details!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/add_event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, desc }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "Unknown server error",
        }));
        throw new Error(`Failed to add event: ${errorData.message}`);
      }

      const newEvent = await response.json();

      alert("Event Added! Predicted Tags: " + newEvent.tags.join(", "));

      // Add into state
      setEvents([...events, newEvent]);

      // Reset form
      setTitle("");
      setDate("");
      setDesc("");
    } catch (err) {
      console.error("Error adding event:", err.message);
      alert("Could not add event. Check backend logs.\n" + err.message);
    }
  };

  // Delete event
  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`${API_BASE}/delete_event/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert("Failed to delete from server.");
        return;
      }

      // Remove from frontend state
      setEvents(events.filter((ev) => ev.id !== eventId));

      alert("Event deleted!");

    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  // Edit event (not fully implemented)
  const handleEdit = (event) => {
    alert(`Edit feature coming soon.\nEditing event: ${event.title}`);
  };

  // Add announcement (local only)
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
            placeholder="Event Description (Tags will be predicted)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="dashboard-input"
            required
          />
          <button type="submit" className="dashboard-btn">
            ➕ Add Event
          </button>
        </form>

        {/* Event List */}
        <h2 className="events-title">Your Posted Events</h2>
        {events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <div className="event-list">
            {events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-title">{event.title}</div>
                <div className="event-date">{event.date}</div>
                <div className="event-desc">{event.desc}</div>
                <div style={{ fontWeight: 500, color: "#2563eb" }}>
                  Tags: <span style={{ color: "#1e293b" }}>{event.tags.join(", ")}</span>
                </div>

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
          <button type="submit" className="dashboard-btn">📢 Post</button>
        </form>

        {announcements.length > 0 && (
          <div style={{ marginTop: "1rem", width: "100%" }}>
            <h3 style={{ color: "#2563eb", marginBottom: "0.5rem" }}>Announcements</h3>
            {announcements.map((a) => (
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
