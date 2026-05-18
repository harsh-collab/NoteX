import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const userName = authUser?.email?.split("@")[0] || "User";

  const features = [
    {
      icon: "📤",
      title: "Upload Notes",
      description: "Upload handwritten notes and convert them to digital text",
      path: "/upload",
      color: "#6366f1"
    },
    {
      icon: "📝",
      title: "Preview & Edit",
      description: "View, edit, and refine your converted LaTeX documents",
      path: "/preview",
      color: "#8b5cf6"
    },
    {
      icon: "📁",
      title: "History",
      description: "Access your previous conversions anytime",
      path: "/history",
      color: "#06b6d4"
    }
  ];

  return (
    <div className="container">
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ marginBottom: "8px" }}>
          Welcome back, <span style={{ color: "#a5b4fc" }}>{userName}</span> 👋
        </h1>
        <p style={{ fontSize: "15px" }}>
          Transform your handwritten notes into beautifully formatted LaTeX documents.
        </p>
      </div>

      <div className="cards-grid">
        {features.map((feature, index) => (
          <div
            key={index}
            className="card"
            onClick={() => navigate(feature.path)}
            style={{
              borderTop: `3px solid ${feature.color}`,
            }}
          >
            <h3>
              <span className="card-icon">{feature.icon}</span>
              {feature.title}
            </h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: "32px",
        padding: "20px",
        background: "rgba(99, 102, 241, 0.1)",
        borderRadius: "12px",
        border: "1px solid rgba(99, 102, 241, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div>
          <h3 style={{ marginBottom: "4px", fontSize: "16px" }}>🚀 Quick Start</h3>
          <p style={{ margin: 0 }}>Ready to convert your notes? Upload an image to get started.</p>
        </div>
        <button onClick={() => navigate("/upload")}>
          Upload Now
        </button>
      </div>
    </div>
  );
}
