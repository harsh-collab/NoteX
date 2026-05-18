import React, { useState, useEffect, createContext, useContext, useCallback } from "react";

// Toast Context
const ToastContext = createContext();

// Toast styles
const toastStyles = {
    container: {
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    toast: {
        minWidth: "300px",
        padding: "16px 20px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        animation: "slideIn 0.3s ease",
        backdropFilter: "blur(10px)",
    },
    success: {
        background: "linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9))",
        border: "1px solid rgba(34, 197, 94, 0.5)",
        color: "white",
    },
    error: {
        background: "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))",
        border: "1px solid rgba(239, 68, 68, 0.5)",
        color: "white",
    },
    warning: {
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9))",
        border: "1px solid rgba(245, 158, 11, 0.5)",
        color: "white",
    },
    info: {
        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(79, 70, 229, 0.9))",
        border: "1px solid rgba(99, 102, 241, 0.5)",
        color: "white",
    },
    icon: {
        fontSize: "20px",
    },
    content: {
        flex: 1,
    },
    title: {
        fontWeight: "600",
        fontSize: "14px",
        marginBottom: "2px",
    },
    message: {
        fontSize: "13px",
        opacity: 0.9,
    },
    closeBtn: {
        background: "transparent",
        border: "none",
        color: "white",
        cursor: "pointer",
        fontSize: "18px",
        opacity: 0.7,
        padding: "0",
        lineHeight: 1,
    },
};

const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
};

// Toast Provider Component
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message, title = null, duration = 4000) => {
        const id = Date.now();
        const defaultTitles = {
            success: "Success",
            error: "Error",
            warning: "Warning",
            info: "Info",
        };

        setToasts((prev) => [...prev, {
            id,
            type,
            message,
            title: title || defaultTitles[type],
        }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        success: (message, title) => addToast("success", message, title),
        error: (message, title) => addToast("error", message, title),
        warning: (message, title) => addToast("warning", message, title),
        info: (message, title) => addToast("info", message, title),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <div style={toastStyles.container}>
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        style={{ ...toastStyles.toast, ...toastStyles[t.type] }}
                    >
                        <span style={toastStyles.icon}>{icons[t.type]}</span>
                        <div style={toastStyles.content}>
                            <div style={toastStyles.title}>{t.title}</div>
                            <div style={toastStyles.message}>{t.message}</div>
                        </div>
                        <button
                            style={toastStyles.closeBtn}
                            onClick={() => removeToast(t.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
        </ToastContext.Provider>
    );
}

// Hook to use toast
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
