import React, { useEffect, useState } from "react";
import axios from "axios";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://notex-backend-1-f4ld.onrender.com", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(res.data.history || []);
      } catch (err) {
        console.error("Failed to load history:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="container">
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ marginBottom: "8px" }}>Conversion History</h2>
        <p>View all your previous note conversions with uploaded images.</p>
      </div>

      {loading ? (
        <div className="status loading">Loading history...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📂</div>
          <h3 style={{ marginBottom: "8px", color: "var(--text-secondary)" }}>No History Yet</h3>
          <p>Your converted documents will appear here.</p>
        </div>
      ) : (
        <div className="history-list">
          {items.map((h, i) => (
            <div key={h.id || i} className="history-item" style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "16px",
              background: "rgba(255,255,255,0.03)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              marginBottom: "12px",
              transition: "all 0.2s ease"
            }}>
              {/* Image Thumbnail */}
              {h.image_filename && (
                <div
                  onClick={() => openModal(h)}
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    flexShrink: 0,
                    cursor: "pointer",
                    border: "2px solid rgba(99, 102, 241, 0.3)",
                    transition: "border-color 0.2s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.8)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.3)"}
                >
                  <img
                    src={`https://notex-backend-1-f4ld.onrender.com/uploads/${h.image_filename}`}
                    alt={h.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="history-item-title" style={{
                  fontWeight: "600",
                  marginBottom: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  📄 {h.title || `Document ${i + 1}`}
                </div>
                <div className="history-item-date" style={{
                  fontSize: "13px",
                  color: "var(--text-muted)",
                  marginBottom: "8px"
                }}>
                  {h.date}
                </div>
                {h.latex && (
                  <div style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "300px"
                  }}>
                    {h.latex.substring(0, 50)}...
                  </div>
                )}
              </div>

              {/* View Button */}
              <button
                className="btn-secondary"
                style={{ padding: "8px 16px", fontSize: "13px" }}
                onClick={() => openModal(h)}
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Full Image View */}
      {showModal && selectedItem && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "24px"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg-secondary)",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.1)",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              padding: "24px"
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <h3 style={{ margin: 0 }}>📄 {selectedItem.title}</h3>
              <button
                onClick={closeModal}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Date */}
            <p style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              marginBottom: "20px"
            }}>
              Converted on: {selectedItem.date}
            </p>

            {/* Content Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px"
            }}>
              {/* Original Image */}
              <div>
                <h4 style={{ marginBottom: "12px", color: "var(--text-secondary)" }}>
                  📷 Original Image
                </h4>
                <div style={{
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "12px",
                  padding: "12px",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <img
                    src={`https://notex-backend-1-f4ld.onrender.com/uploads/${selectedItem.image_filename}`}
                    alt={selectedItem.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px"
                    }}
                  />
                </div>
              </div>

              {/* LaTeX Output */}
              <div>
                <h4 style={{ marginBottom: "12px", color: "var(--text-secondary)" }}>
                  📝 Converted LaTeX
                </h4>
                <div style={{
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: "12px",
                  padding: "16px",
                  border: "1px solid rgba(255,255,255,0.05)",
                  minHeight: "200px"
                }}>
                  {selectedItem.latex && (
                    <>
                      <div style={{ marginBottom: "16px" }}>
                        <BlockMath math={selectedItem.latex} />
                      </div>
                      <details style={{ marginTop: "16px" }}>
                        <summary style={{
                          cursor: "pointer",
                          color: "var(--text-secondary)",
                          fontSize: "13px"
                        }}>
                          View Raw LaTeX
                        </summary>
                        <pre style={{
                          marginTop: "8px",
                          padding: "12px",
                          background: "rgba(0,0,0,0.3)",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontFamily: "'JetBrains Mono', monospace",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-all",
                          color: "var(--text-muted)"
                        }}>
                          {selectedItem.latex}
                        </pre>
                      </details>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              marginTop: "20px",
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end"
            }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  localStorage.setItem("lastLatex", selectedItem.latex);
                  window.location.href = "/preview";
                }}
              >
                Open in Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
