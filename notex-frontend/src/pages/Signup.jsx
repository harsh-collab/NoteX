import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../components/Toast";
import ThemeToggle from "../components/ThemeToggle";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import logo from "../assets/notex_logo.png";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  // Keyboard shortcut: Enter to signup
  useKeyboardShortcuts({
    "enter": () => handleSignup()
  });

  // Password strength calculation
  const passwordAnalysis = useMemo(() => {
    if (!password) return { score: 0, level: "", color: "transparent" };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score <= 2) {
      return { score, level: "Weak", color: "#ef4444" };
    } else if (score <= 3) {
      return { score, level: "Medium", color: "#f59e0b" };
    } else {
      return { score, level: "Strong", color: "#22c55e" };
    }
  }, [password]);

  const handleSignup = () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPhone || !trimmedPassword) {
      toast.error("Please fill in all fields", "Missing Information");
      return;
    }

    if (trimmedPassword.length < 8) {
      toast.warning("Password must be at least 8 characters", "Weak Password");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const userExists = users.find((u) => u.email.trim().toLowerCase() === trimmedEmail);
    if (userExists) {
      toast.warning("This email is already registered", "Account Exists");
      return;
    }

    users.push({ email: trimmedEmail, phone: trimmedPhone, password: trimmedPassword });
    localStorage.setItem("users", JSON.stringify(users));
    toast.success("Your account has been created!", "Welcome");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <>
      {/* Theme toggle in corner */}
      <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 1000 }}>
        <ThemeToggle />
      </div>

      <div className="auth-container">
        <img src={logo} alt="NoteX" className="auth-logo" />
        <h2 style={{ marginBottom: "8px" }}>Create Account</h2>
        <p style={{ marginBottom: "28px" }}>Get started with NoteX</p>

        <div className="form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

          {/* Password Strength Indicator */}
          {password && (
            <div style={{ marginTop: "-8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", gap: "4px", flex: 1 }}>
                  {[1, 2, 3, 4, 5].map((dot) => (
                    <div
                      key={dot}
                      style={{
                        flex: 1,
                        height: "4px",
                        borderRadius: "2px",
                        background: passwordAnalysis.score >= dot ? passwordAnalysis.color : "rgba(255,255,255,0.1)",
                        transition: "all 0.2s ease",
                      }}
                    />
                  ))}
                </div>
                <span style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: passwordAnalysis.color,
                  minWidth: "60px",
                  textAlign: "right",
                }}>
                  {passwordAnalysis.level}
                </span>
              </div>
              <p style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                marginTop: "6px",
                textAlign: "left",
              }}>
                Use 8+ chars with uppercase, numbers & symbols
              </p>
            </div>
          )}

          <button onClick={handleSignup} style={{ marginTop: "8px" }}>
            Create Account
          </button>
        </div>

        <p style={{ marginTop: "24px", fontSize: "14px" }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </>
  );
}

