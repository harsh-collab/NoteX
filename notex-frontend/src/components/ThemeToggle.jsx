import React, { useState, useEffect } from "react";

/**
 * ThemeToggle Component
 * - Sun icon fixed on LEFT side of track (shows when in dark mode)
 * - Moon icon fixed on RIGHT side of track (shows when in light mode)
 * - Thumb slides and contains a morphing icon (moon ↔ sun)
 */
export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setIsDark(savedTheme === "dark");
            document.documentElement.setAttribute("data-theme", savedTheme);
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = isDark ? "light" : "dark";
        setIsDark(!isDark);
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <button
            className={`theme-toggle ${isDark ? "dark" : "light"}`}
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            title={`Switch to ${isDark ? "light" : "dark"} mode`}
        >
            <div className="toggle-track">
                {/* Fixed track icons: Sun on LEFT, Moon on RIGHT */}
                <span className="track-icon track-sun">☀️</span>
                <span className="track-icon track-moon">🌙</span>

                {/* Sliding thumb with morphing icon inside */}
                <div className="toggle-thumb">
                    <span className="morph-icon"></span>
                </div>
            </div>
        </button>
    );
}
