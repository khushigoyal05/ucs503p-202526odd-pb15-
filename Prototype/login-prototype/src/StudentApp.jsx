// frontend/StudentApp.jsx
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./App.css";

export default function StudentApp() {
  const [user, setUser] = useState(null);
  const [interests, setInterests] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const TAGS = [
    "AI/ML", "art", "coding", "cultural", "cybersecurity", "dance", "design", "drama",
    "electronics", "entrepreneurship", "finance", "gaming", "literature", "marketing",
    "music", "photography", "robotics", "social service", "sports", "tech", "theatre"
  ];

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  // Fetch logged user
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = "/";
      else setUser(data.session.user);
    });
  }, []);

  // Fetch events from backend
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "/get_events");
      const data = await response.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const toggleInterest = (tag) => {
    if (interests.includes(tag))
      setInterests(interests.filter((i) => i !== tag));
    else
      setInterests([...interests, tag]);
  };

  const filteredEvents = events.filter((event) =>
    event.tags.some((tag) => interests.includes(tag))
  );

  if (!user) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>;

  return (
    <div className="center-bg">

      <div className="dashboard-card">
        <button className="logout-btn" onClick={handleLogout}>
  🚪 Logout
</button>


        <div className="profile-row">
          <div className="profile-avatar">
            <span className="profile-icon">👤</span>
          </div>

          <div>
            <h1 className="dashboard-title">Welcome!</h1>
            <p className="dashboard-email">{user.email}</p>
          </div>
        </div>

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

        <h2 className="events-title">Recommended Events</h2>

        {isLoading ? (
          <p>Loading events...</p>
        ) : interests.length === 0 ? (
          <p>Please select interests.</p>
        ) : filteredEvents.length === 0 ? (
          <p>No events match your interests.</p>
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
                      <p><b>Tags:</b> {event.tags?.join(", ")}</p>
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
