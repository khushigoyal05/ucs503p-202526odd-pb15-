import { useNavigate } from "react-router-dom";
import "./App.css";

export default function MainLogin() {
  const navigate = useNavigate();

  return (
    <div className="center-bg">
      <div className="login-card">
        <h2 className="login-title" style={{ marginBottom: "2rem" }}>
          Welcome to the Club Portal
        </h2>
        <p style={{ textAlign: "center", marginBottom: "1rem", color: "#64748b", fontWeight: 500 }}>
          Please choose your login type:
        </p>
        <button
          className="login-btn"
          style={{
            background: "linear-gradient(90deg, #ef4444 0%, #f87171 100%)",
            borderBottom: "2.5px solid #b91c1c",
            marginBottom: "1rem",
          }}
          onClick={() => navigate("/society")}
        >
          🏫 Login as Society Admin
        </button>
        <button
          className="login-btn"
          onClick={() => navigate("/student")}
        >
          👤 Login as Student
        </button>
      </div>
    </div>
  );
}