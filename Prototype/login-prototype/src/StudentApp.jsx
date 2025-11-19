import { useState, useEffect } from "react";
import "./App.css";

export default function StudentApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Student interests
  const [interests, setInterests] = useState([]);

  // Events fetched from backend
  const [events, setEvents] = useState([]);

  // Tag list
  const TAGS = [
    "AI/ML", "art", "coding", "cultural", "cybersecurity", "dance", "design", "drama",
    "electronics", "entrepreneurship", "finance", "gaming", "literature", "marketing",
    "music", "photography", "robotics", "social service", "sports", "tech", "theatre"
  ];

  // Fetch events from backend
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://societyconnect.onrender.com/get_events");
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on login/load
  useEffect(() => {
    if (loggedIn) {
      fetchEvents();
    }
  }, [loggedIn]);

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    if (email) {
      setLoggedIn(true);
    } else {
      alert("Please enter your college email!");
    }
  };

  // Toggle interest
  const toggleInterest = (tag) => {
    if (interests.includes(tag)) {
      setInterests(interests.filter((i) => i !== tag));
    } else {
      setInterests([...interests, tag]);
    }
  };

  // Filter events based on interests
  const filteredEvents = events.filter((event) =>
    event.tags.some((tag) => interests.includes(tag))
  );

  if (!loggedIn) {
    return (
      <div className="center-bg">
        <form onSubmit={handleLogin} className="login-card">
          <h2 className="login-title">Student Login</h2>
          <input
            type="email"
            placeholder="College Email"
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
    <div className="center-bg">
      <div className="dashboard-card">
        <div className="profile-row">
          <div className="profile-avatar">
            <span role="img" aria-label="profile" className="profile-icon">👤</span>
          </div>
          <div>
            <h1 className="dashboard-title">Welcome!</h1>
            <p className="dashboard-email">{email}</p>
          </div>
        </div>

        {/* Interests */}
        <h2 className="events-title">Select Your Interests</h2>
        <div className="tags-grid">
          {TAGS.map((tag) => (
            <button
              key={tag}
              className={`tag-btn ${interests.includes(tag) ? "selected" : ""}`}
              onClick={() => toggleInterest(tag)}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Refresh Events */}
        <button
          className="dashboard-btn"
          onClick={fetchEvents}
          style={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          🔄 Refresh Events
        </button>

        {/* Recommended Events */}
        <h2 className="events-title">Recommended Events</h2>

        {isLoading ? (
          <p>Loading events...</p>
        ) : interests.length === 0 ? (
          <p>Please select at least one interest to see recommended events.</p>
        ) : filteredEvents.length === 0 ? (
          <p>No events match your selected interests right now.</p>
        ) : (
          <div className="events-list">
            {filteredEvents.map((event) => {
              const matched = event.tags.filter((t) => interests.includes(t));
              return (
                <div key={event.id} className="event-card">
                  <div className="event-info">
                    <span className="event-icon">📅</span>
                    <div>
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-date">{event.date}</p>
                      <p className="event-desc">{event.desc}</p>
                      <p><b>All Tags:</b> {event.tags?.join(", ") || "N/A"}</p>
                      <p style={{ color: "#2563eb", fontWeight: 600 }}>
                        Matched Interests: {matched.join(", ")}
                      </p>
                    </div>
                  </div>
                  <button className="reminder-btn">🔔 Set Reminder</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
