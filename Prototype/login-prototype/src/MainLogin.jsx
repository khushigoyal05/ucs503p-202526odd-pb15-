import { useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./App.css";

export default function MainLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const [loading, setLoading] = useState(false);

  // SIGNUP HANDLER
  const handleSignup = async () => {
    // ALLOW ONLY THAPAR EMAILS
    if (!email.endsWith("@thapar.edu")) {
      alert("Only Thapar email IDs allowed (must end with @thapar.edu)");
      return;
    }

    setLoading(true);
    try {
      // Supabase signup
      const { error: signError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signError) {
        alert(signError.message);
        return;
      }

      // Insert user role into profiles table
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          email: email.toLowerCase(),
          role,
        },
      ]);

      if (profileError) {
        alert(profileError.message);
        return;
      }

      alert(
        "Signup successful! Please check your Thapar email to verify your account."
      );
    } catch (err) {
      console.error("Signup error:", err);
      alert("Signup failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  // LOGIN HANDLER
  const handleLogin = async () => {
    setLoading(true);
    try {
      // Sign in
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        alert(loginError.message);
        return;
      }

      // Grab the stored profile role from DB (use lowercase email for safety)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", email.toLowerCase())
        .single();

      if (profileError || !profile) {
        // If profile missing, sign out and show error
        await supabase.auth.signOut();
        alert("User profile not found. Please sign up first or contact support.");
        return;
      }

      const storedRole = (profile.role || "").toLowerCase();
      const selectedRole = (role || "").toLowerCase();

      // Enforce role match: if mismatch, sign out and show error
      if (storedRole !== selectedRole) {
        await supabase.auth.signOut();
        alert(
          `Role mismatch: your account is registered as "${storedRole}". Please log in with the correct role.`
        );
        return;
      }

      // All good — redirect based on role
      if (storedRole === "society") {
        navigate("/society");
      } else {
        navigate("/student");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check console for details.");
    } finally {
      setLoading(false);
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

        <button
          className="login-btn"
          onClick={handleSignup}
          disabled={loading}
        >
          ✨ Sign Up
        </button>

        <button
          className="login-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          🔐 Login
        </button>
      </div>
    </div>
  );
}
