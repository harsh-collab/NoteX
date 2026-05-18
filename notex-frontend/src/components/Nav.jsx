import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/notex_logo.png";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  // Get logged-in user's data from localStorage
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const userEmail = authUser?.email || "User";
  const userPhone = authUser?.phone || "Not provided";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    window.location.href = "/login";
  };

  return (
    <div className="nav">
      <img src={logo} alt="NoteX" className="nav-logo" />

      <Link to="/">Dashboard</Link>
      <Link to="/upload">Upload</Link>
      <Link to="/preview">Preview</Link>
      <Link to="/history">History</Link>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px" }}>
        <ThemeToggle />

        {/* User Profile with Hover Dropdown */}
        <div className="user-profile-container">
          <span className="badge user-badge">👤 {userEmail}</span>

          <div className="user-dropdown">
            <div className="dropdown-header">
              <div className="user-avatar">👤</div>
              <span className="user-name">Account Details</span>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item">
              <span className="item-icon">📧</span>
              <div className="item-content">
                <span className="item-label">Email</span>
                <span className="item-value">{userEmail}</span>
              </div>
            </div>
            <div className="dropdown-item">
              <span className="item-icon">📱</span>
              <div className="item-content">
                <span className="item-label">Phone</span>
                <span className="item-value">{userPhone}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn-secondary"
          style={{ padding: "8px 16px", fontSize: "13px" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}


