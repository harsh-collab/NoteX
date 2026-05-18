import { useEffect, useCallback } from "react";

/**
 * Custom hook for handling keyboard shortcuts
 * @param {Object} shortcuts - Object mapping shortcut keys to handler functions
 * @param {boolean} enabled - Whether shortcuts are enabled (default: true)
 * 
 * Shortcut format:
 * - "enter" - Enter key
 * - "ctrl+s" - Ctrl + S
 * - "ctrl+enter" - Ctrl + Enter
 * - "ctrl+u" - Ctrl + U
 */
export default function useKeyboardShortcuts(shortcuts, enabled = true) {
    const handleKeyDown = useCallback((event) => {
        if (!enabled) return;

        // Build the key combination string
        const key = event.key.toLowerCase();
        let combo = "";

        if (event.ctrlKey || event.metaKey) combo += "ctrl+";
        if (event.shiftKey) combo += "shift+";
        if (event.altKey) combo += "alt+";

        // Handle special keys
        if (key === "enter") combo += "enter";
        else if (key === " ") combo += "space";
        else if (key === "escape") combo += "escape";
        else combo += key;

        // Check if we have a handler for this combo
        const handler = shortcuts[combo];
        if (handler) {
            event.preventDefault();
            handler(event);
        }
    }, [shortcuts, enabled]);

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * Hook for displaying keyboard shortcut hints
 */
export function useShortcutHint(shortcut) {
    // Format shortcut for display (e.g., "Ctrl+S" on Windows/Linux, "⌘S" on Mac)
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

    return shortcut
        .replace(/ctrl\+/gi, isMac ? "⌘" : "Ctrl+")
        .replace(/shift\+/gi, isMac ? "⇧" : "Shift+")
        .replace(/alt\+/gi, isMac ? "⌥" : "Alt+")
        .replace(/enter/gi, "↵")
        .toUpperCase();
}
