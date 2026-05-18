import React, { useState, useEffect } from "react";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { useToast } from "../components/Toast";
import { UncertaintyPanel } from "../components/UncertainWord";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";

export default function Preview() {
  const [latex, setLatex] = useState("");
  const [words, setWords] = useState([]);
  const [showUncertainties, setShowUncertainties] = useState(true);
  const toast = useToast();

  // Keyboard shortcut: Ctrl+S to save
  useKeyboardShortcuts({
    "ctrl+s": () => saveLatex()
  });

  useEffect(() => {
    const cached = localStorage.getItem("lastLatex") || "\\text{No LaTeX yet}";
    setLatex(cached);

    // Load words data for uncertainty display
    try {
      const cachedWords = localStorage.getItem("lastWords");
      if (cachedWords) {
        setWords(JSON.parse(cachedWords));
      }
    } catch (e) {
      console.error("Failed to parse words data", e);
    }
  }, []);

  const uncertainCount = words.filter(w => w.isUncertain).length;

  const handleApplySuggestion = (word, suggestion) => {
    // Update words array
    const updatedWords = words.map(w => {
      if (w.text === word.text && w.original === word.original) {
        return { ...w, text: suggestion, isUncertain: false, suggestions: [] };
      }
      return w;
    });
    setWords(updatedWords);

    // Rebuild latex
    const newLatexBody = updatedWords.map(w => w.text).join(" ");
    const newLatex = `
\\begin{aligned}
${newLatexBody}
\\end{aligned}
`;
    setLatex(newLatex);

    // Save to localStorage
    localStorage.setItem("lastLatex", newLatex);
    localStorage.setItem("lastWords", JSON.stringify(updatedWords));

    toast.success(`Applied suggestion: "${suggestion}"`, "Correction Applied");
  };

  const downloadTex = () => {
    const blob = new Blob([latex], { type: "text/x-tex" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "converted.tex";
    a.click();
    toast.success("Your .tex file is downloading", "Download Started");
  };

  const exportPDF = async () => {
    try {
      toast.info("Generating PDF...", "Please Wait");
      const res = await fetch("http://localhost:5000/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latex }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      a.click();
      toast.success("Your PDF is downloading", "Export Complete");
    } catch (err) {
      toast.error("Failed to export PDF", "Export Error");
    }
  };

  const saveLatex = () => {
    localStorage.setItem("lastLatex", latex);
    localStorage.setItem("lastWords", JSON.stringify(words));
    toast.success("Changes saved locally", "Saved");
  };

  return (
    <div className="container">
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ marginBottom: "8px" }}>Preview & Editor</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <p style={{ margin: 0 }}>Edit your LaTeX and preview the rendered output in real-time.</p>
          {uncertainCount > 0 && (
            <span className="uncertainty-indicator">
              ⚠️ {uncertainCount} uncertain prediction{uncertainCount !== 1 ? 's' : ''}
            </span>
          )}
          {uncertainCount === 0 && words.length > 0 && (
            <span className="uncertainty-indicator no-issues">
              ✓ High confidence
            </span>
          )}
        </div>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
          💡 Shortcut: <kbd>Ctrl+S</kbd> to save changes
        </p>
      </div>

      {/* Uncertainty Panel */}
      {showUncertainties && uncertainCount > 0 && (
        <UncertaintyPanel
          words={words}
          onApplySuggestion={handleApplySuggestion}
          onDismiss={() => setShowUncertainties(false)}
        />
      )}

      <div className="preview-grid" style={{ marginTop: uncertainCount > 0 ? "16px" : "0" }}>
        {/* Rendered Output Panel */}
        <div className="preview-panel">
          <h3>Rendered Output</h3>
          <div className="preview-box">
            <div style={{
              maxWidth: "100%",
              overflow: "auto"
            }}>
              <BlockMath math={latex} />
            </div>
          </div>
          <div className="btn-group" style={{ marginTop: "16px" }}>
            <button onClick={downloadTex} className="btn-success" style={{ flex: 1 }}>
              📥 Download .tex
            </button>
            <button onClick={exportPDF} className="btn-success" style={{ flex: 1 }}>
              📄 Export PDF
            </button>
          </div>
        </div>

        {/* LaTeX Editor Panel */}
        <div className="preview-panel">
          <h3>LaTeX Source</h3>
          <textarea
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            rows={10}
            style={{
              width: "100%",
              background: "rgba(0,0,0,0.3)",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: "13px",
            }}
          />
          <button
            onClick={saveLatex}
            className="btn-secondary"
            style={{ marginTop: "16px", width: "100%" }}
          >
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

