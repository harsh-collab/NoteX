import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../components/Toast";
import ThemeToggle from "../components/ThemeToggle";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import logo from "../assets/notex_logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  // Keyboard shortcut: Enter to login
  useKeyboardShortcuts({
    "enter": () => handleLogin()
  });

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Please enter email and password", "Missing Information");
      return;
    }

    const user = users.find(
      (u) => u.email.trim().toLowerCase() === trimmedEmail && u.password.trim() === trimmedPassword
    );

    if (!user) {
      toast.error("The email or password you entered is incorrect", "Login Failed");
      return;
    }

    localStorage.setItem("authUser", JSON.stringify(user));
    localStorage.setItem("token", "user-token-" + Date.now());

    toast.success("Welcome back!", "Login Successful");

    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <>
      {/* Theme toggle in corner */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}>
        <ThemeToggle />
      </div>

      <div className="auth-container">
        <img src={logo} alt="NoteX" className="auth-logo" />
        <h2 style={{ marginBottom: "8px" }}>Welcome Back</h2>
        <p style={{ marginBottom: "28px" }}>Sign in to continue to NoteX</p>

        <div className="form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={`password-toggle ${showPassword ? "visible" : ""}`}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <span className="eye-icon">
                <span className="eye-ball"></span>
              </span>
            </button>
          </div>

          <button onClick={handleLogin} style={{ marginTop: "8px" }}>
            Sign In
          </button>
        </div>

        <p style={{ marginTop: "24px", fontSize: "14px" }}>
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </>
  );
}


