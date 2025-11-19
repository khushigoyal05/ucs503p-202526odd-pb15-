import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function SocietyApp() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");

  const [announcements, setAnnouncements] = useState([]);
  const [announcementText, setAnnouncementText] = useState("");

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Protect route
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = "/";
      else setUser(data.session.user);
    });
  }, []);

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE}/get_events`);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Add event
  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!title || !date || !desc) {
      alert("Fill all event details!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/add_event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, desc }),
      });

      if (!res.ok) {
        alert("Error adding event");
        return;
      }

      const newEvent = await res.json();
      setEvents([...events, newEvent]);
      alert("Event added with AI tags!");
      setTitle("");
      setDate("");
      setDesc("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/delete_event/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvents(events.filter((ev) => ev.id !== id));
        alert("Event deleted!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Announcements (local)
  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText) return;

    setAnnouncements([...announcements, { id: Date.now(), text: announcementText }]);
    setAnnouncementText("");
  };

  if (!user) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  return (
    <div className="center-bg" style={{ alignItems: "flex-start" }}>

      {/* TOP-RIGHT LOGOUT BUTTON */}
      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>

      <div className="dashboard-card" style={{ width: "100%", maxWidth: 600 }}>

        <div className="profile-row">
          <div className="profile-avatar">
            <span className="profile-icon">🏫</span>
          </div>

          <div>
            <h1 className="dashboard-title">Society Admin Dashboard</h1>
            <p className="dashboard-email">{user.email}</p>
          </div>
        </div>

        <h2 className="events-title">Create New Event</h2>
        <form onSubmit={handleAddEvent}>
          <input
            type="text"
            className="dashboard-input"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="date"
            className="dashboard-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <textarea
            className="dashboard-input"
            placeholder="Event Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>

          <button className="dashboard-btn">➕ Add Event</button>
        </form>

        <h2 className="events-title">Your Events</h2>

        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-title">{event.title}</div>
            <div className="event-date">{event.date}</div>
            <div className="event-desc">{event.desc}</div>
            <div>Tags: {event.tags?.join(", ")}</div>

            <button
              className="dashboard-btn"
              style={{ background: "#ef4444" }}
              onClick={() => handleDelete(event.id)}
            >
              🗑 Delete
            </button>
          </div>
        ))}

        <h2 className="events-title">Post Announcement</h2>
        <form onSubmit={handleAddAnnouncement}>
          <textarea
            className="dashboard-input"
            placeholder="Type announcement…"
            value={announcementText}
            onChange={(e) => setAnnouncementText(e.target.value)}
          ></textarea>

          <button className="dashboard-btn">📢 Post</button>
        </form>

        {announcements.length > 0 && (
          <div>
            <h3>Announcements</h3>
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
