import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function MainLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role

  // SIGNUP HANDLER
  const handleSignup = async () => {
    // ALLOW ONLY THAPAR EMAILS
    if (!email.endsWith("@thapar.edu")) {
      alert("Only Thapar email IDs allowed (must end with @thapar.edu)");
      return;
    }

    // Supabase signup
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Insert user role into profiles table
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        email,
        role,
      },
    ]);

    if (profileError) {
      alert(profileError.message);
      return;
    }

    alert("Signup successful! Please check your Thapar email to verify your account.");
  };

  // LOGIN HANDLER
  const handleLogin = async () => {
    // login with Supabase Auth
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // Fetch user role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", email)
      .single();

    if (profileError || !profile) {
      alert("User role not found. Contact support.");
      return;
    }

    // Redirect based on role
    if (profile.role === "society") {
      navigate("/society");
    } else {
      navigate("/student");
    }
  };

  return (
    <div className="center-bg">
      <div className="login-card">

        <h2 className="login-title">Welcome to the Club Portal</h2>

        <input
          className="login-input"
          placeholder="Thapar Email (required)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="login-input"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="student">Student</option>
          <option value="society">Society Admin</option>
        </select>

        <button className="login-btn" onClick={handleSignup}>
          ✨ Sign Up
        </button>

        <button className="login-btn" onClick={handleLogin}>
          🔐 Login
        </button>
      </div>
    </div>
  );
}
