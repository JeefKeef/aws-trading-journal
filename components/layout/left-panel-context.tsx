"use client";

import { createContext, useContext, useState } from "react";

export type LeftPanelMode = "chat" | "settings" | null;

type LeftPanelContextValue = {
  mode: LeftPanelMode;
  setMode: (mode: LeftPanelMode) => void;
  isVisible: boolean;
  togglePanel: (mode: LeftPanelMode) => void;
};

const LeftPanelContext = createContext<LeftPanelContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "signal-left-panel-state";

export function LeftPanelProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<LeftPanelMode>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored) as LeftPanelMode;
        }
      } catch (error) {
        console.error("Failed to load left panel state:", error);
      }
    }
    return "chat"; // Default to chat panel open
  });

  const isVisible = mode !== null;

  const setMode = (newMode: LeftPanelMode) => {
    setModeState(newMode);
    // Persist to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newMode));
      } catch (error) {
        console.error("Failed to save left panel state:", error);
      }
    }
  };

  const togglePanel = (targetMode: LeftPanelMode) => {
    // If clicking the same mode, collapse the panel
    if (mode === targetMode) {
      setMode(null);
    } else {
      setMode(targetMode);
    }
  };

  return (
    <LeftPanelContext.Provider value={{ mode, setMode, isVisible, togglePanel }}>
      {children}
    </LeftPanelContext.Provider>
  );
}

export function useLeftPanel() {
  const context = useContext(LeftPanelContext);
  if (!context) {
    throw new Error("useLeftPanel must be used within a LeftPanelProvider");
  }
  return context;
}
