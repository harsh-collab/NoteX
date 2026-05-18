import React, { useState } from "react";

/**
 * UncertainWord Component
 * Displays a word with uncertainty highlighting and suggestion dropdown
 */
export default function UncertainWord({
    word,
    onApplySuggestion,
    showConfidence = true
}) {
    const [showDropdown, setShowDropdown] = useState(false);

    if (!word.isUncertain) {
        return <span className="confident-word">{word.text}</span>;
    }

    const confidenceLevel = word.confidence < 50 ? "low" : "medium";

    return (
        <span
            className={`uncertain-word uncertain-${confidenceLevel}`}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
        >
            <span className="uncertain-text">{word.text}</span>

            {showConfidence && (
                <span className="confidence-badge" title={`Confidence: ${word.confidence}%`}>
                    {word.confidence}%
                </span>
            )}

            {showDropdown && word.suggestions && word.suggestions.length > 0 && (
                <div className="suggestions-dropdown">
                    <div className="suggestions-header">
                        <span className="suggestions-icon">💡</span>
                        Did you mean?
                    </div>
                    {word.suggestions.map((suggestion, idx) => (
                        <button
                            key={idx}
                            className="suggestion-item"
                            onClick={(e) => {
                                e.stopPropagation();
                                onApplySuggestion && onApplySuggestion(word, suggestion);
                                setShowDropdown(false);
                            }}
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </span>
    );
}

/**
 * UncertaintyPanel Component
 * Panel showing all uncertain words with their suggestions
 */
export function UncertaintyPanel({ words, onApplySuggestion, onDismiss }) {
    const uncertainWords = words?.filter(w => w.isUncertain) || [];

    if (uncertainWords.length === 0) {
        return null;
    }

    return (
        <div className="uncertainty-panel">
            <div className="uncertainty-panel-header">
                <div className="uncertainty-title">
                    <span className="warning-icon">⚠️</span>
                    <span>{uncertainWords.length} Uncertain Prediction{uncertainWords.length !== 1 ? 's' : ''}</span>
                </div>
                {onDismiss && (
                    <button className="dismiss-btn" onClick={onDismiss}>✕</button>
                )}
            </div>

            <div className="uncertainty-list">
                {uncertainWords.map((word, idx) => (
                    <div key={idx} className="uncertainty-item">
                        <div className="uncertainty-word-info">
                            <span className="current-word">"{word.text}"</span>
                            <span className="confidence-indicator" style={{
                                background: word.confidence < 50
                                    ? 'rgba(239, 68, 68, 0.2)'
                                    : 'rgba(245, 158, 11, 0.2)',
                                color: word.confidence < 50 ? '#ef4444' : '#f59e0b'
                            }}>
                                {word.confidence}% confident
                            </span>
                        </div>

                        {word.suggestions && word.suggestions.length > 0 && (
                            <div className="suggestion-buttons">
                                {word.suggestions.map((suggestion, sIdx) => (
                                    <button
                                        key={sIdx}
                                        className="suggestion-btn"
                                        onClick={() => onApplySuggestion && onApplySuggestion(word, suggestion)}
                                    >
                                        → {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
