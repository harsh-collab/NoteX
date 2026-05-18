import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { UncertaintyPanel } from "../components/UncertainWord";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [expandedResult, setExpandedResult] = useState(null);
  const fileInputRef = useRef(null);
  const nav = useNavigate();
  const toast = useToast();

  // Keyboard shortcuts
  useKeyboardShortcuts({
    "ctrl+u": () => {
      fileInputRef.current?.click();
      toast.info("Select files to upload", "Ctrl+U");
    },
    "ctrl+enter": () => {
      if (files.length > 0 && !loading) {
        handleConvert();
      }
    }
  });

  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles).filter(f => f.type.startsWith("image/"));
    if (fileArray.length === 0) return;

    setFiles(prev => [...prev, ...fileArray]);

    // Generate previews
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, { name: file.name, url: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setPreviews([]);
    setResults([]);
    setExpandedResult(null);
  };

  const handleConvert = async (e) => {
    if (e) e.preventDefault();
    if (files.length === 0) {
      toast.error("Please select at least one file", "No Files");
      return;
    }

    setLoading(true);
    setStatus(`Processing ${files.length} file(s)...`);
    setResults([]);

    const fd = new FormData();
    files.forEach(file => fd.append("files", file));

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/convert/batch", fd, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = res.data;
      setResults(data.results);
      toast.success(
        `Converted ${data.success} of ${data.total} files!`,
        "Batch Complete"
      );
      setStatus(`Completed: ${data.success} success, ${data.failed} failed`);
    } catch (err) {
      console.error("Batch upload error:", err);
      const msg = err.response?.data?.message || err.message;
      toast.error(msg, "Batch Upload Failed");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ marginBottom: "8px" }}>Upload Notes</h2>
        <p>Upload multiple images of your handwritten notes for batch conversion.</p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
          💡 Shortcuts: <kbd>Ctrl+U</kbd> to select files, <kbd>Ctrl+Enter</kbd> to convert
        </p>
      </div>

      <form onSubmit={handleConvert}>
        <div
          className={`upload-zone ${files.length > 0 ? "active" : ""}`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {files.length === 0 ? (
            <>
              <div className="upload-icon">📄</div>
              <h3>Drag & drop images here</h3>
              <p>or click to browse files</p>
              <p style={{ marginTop: "12px", fontSize: "12px", color: "var(--text-muted)" }}>
                Supports: JPG, PNG, WEBP • Multiple files allowed
              </p>
            </>
          ) : (
            <div>
              <p style={{ color: "var(--text-primary)", fontWeight: "500", marginBottom: "8px" }}>
                {files.length} file(s) selected
              </p>
              <p style={{ fontSize: "12px" }}>Click to add more files</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: "none" }}
        />

        {/* File Thumbnails Grid */}
        {previews.length > 0 && (
          <div style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "12px"
          }}>
            {previews.map((preview, index) => (
              <div key={index} style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(0,0,0,0.2)"
              }}>
                <img
                  src={preview.url}
                  alt={preview.name}
                  style={{
                    width: "100%",
                    height: "80px",
                    objectFit: "cover"
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "rgba(239, 68, 68, 0.9)",
                    border: "none",
                    color: "white",
                    fontSize: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0
                  }}
                >
                  ✕
                </button>
                <div style={{
                  padding: "4px 6px",
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}>
                  {preview.name}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
          <button type="submit" disabled={loading || files.length === 0}>
            {loading ? "Converting..." : `Convert ${files.length > 0 ? files.length : ""} File${files.length !== 1 ? "s" : ""}`}
          </button>
          {files.length > 0 && (
            <button
              type="button"
              className="btn-secondary"
              onClick={clearAll}
            >
              Clear All
            </button>
          )}
        </div>
      </form>

      {status && (
        <div className={`status ${loading ? "loading" : results.length > 0 ? "success" : ""}`}>
          {status}
        </div>
      )}

      {/* Results Section */}
      {results.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <h3 style={{ marginBottom: "16px" }}>Conversion Results</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {results.map((result, index) => (
              <div
                key={index}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: `1px solid ${result.status === "success" ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                  borderRadius: "12px",
                  overflow: "hidden"
                }}
              >
                <div
                  onClick={() => setExpandedResult(expandedResult === index ? null : index)}
                  style={{
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                    <span style={{ fontSize: "20px" }}>
                      {result.status === "success" ? "✅" : "❌"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "500" }}>{result.filename}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        {result.status === "success" ? "Converted successfully" : result.error}
                        {result.status === "success" && result.uncertainCount > 0 && (
                          <span className="uncertainty-indicator">
                            ⚠️ {result.uncertainCount} uncertain
                          </span>
                        )}
                        {result.status === "success" && result.uncertainCount === 0 && (
                          <span className="uncertainty-indicator no-issues">
                            ✓ High confidence
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    transform: expandedResult === index ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s"
                  }}>
                    ▼
                  </span>
                </div>

                {expandedResult === index && result.status === "success" && (
                  <div style={{
                    padding: "16px",
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(0,0,0,0.2)"
                  }}>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "16px"
                    }}>
                      {/* Image */}
                      <div>
                        <h4 style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                          Original Image
                        </h4>
                        <img
                          src={`http://localhost:5000/uploads/${result.image_filename}`}
                          alt={result.filename}
                          style={{
                            width: "100%",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.1)"
                          }}
                        />
                      </div>

                      {/* LaTeX */}
                      <div style={{ minWidth: 0 }}>
                        <h4 style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                          LaTeX Output
                        </h4>
                        <div style={{
                          background: "rgba(0,0,0,0.3)",
                          padding: "12px",
                          borderRadius: "8px",
                          overflow: "auto",
                          maxHeight: "150px",
                          maxWidth: "100%"
                        }}>
                          <div style={{
                            minWidth: "max-content",
                            fontSize: "13px"
                          }}>
                            <BlockMath math={result.latex} />
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ marginTop: "12px", width: "100%", padding: "8px" }}
                          onClick={() => {
                            localStorage.setItem("lastLatex", result.latex);
                            // Also store uncertainty data for Preview page
                            localStorage.setItem("lastWords", JSON.stringify(result.words || []));
                            nav("/preview");
                          }}
                        >
                          Open in Editor
                        </button>
                      </div>
                    </div>

                    {/* Uncertainty Panel */}
                    {result.words && result.uncertainCount > 0 && (
                      <UncertaintyPanel
                        words={result.words}
                        onApplySuggestion={(word, suggestion) => {
                          // Update the result with the applied suggestion
                          setResults(prevResults => {
                            const newResults = [...prevResults];
                            const resultIndex = newResults.findIndex(r => r === result);
                            if (resultIndex !== -1) {
                              // Update word in words array
                              const updatedWords = newResults[resultIndex].words.map(w => {
                                if (w.text === word.text && w.original === word.original) {
                                  return { ...w, text: suggestion, isUncertain: false, suggestions: [] };
                                }
                                return w;
                              });

                              // Rebuild latex
                              const newLatexBody = updatedWords.map(w => w.text).join(" ");
                              const newLatex = `
\\begin{aligned}
${newLatexBody}
\\end{aligned}
`;

                              newResults[resultIndex] = {
                                ...newResults[resultIndex],
                                words: updatedWords,
                                latex: newLatex,
                                uncertainCount: updatedWords.filter(w => w.isUncertain).length
                              };
                            }
                            return newResults;
                          });
                          toast.success(`Applied suggestion: "${suggestion}"`, "Correction Applied");
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
