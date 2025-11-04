"use client";

import { createContext, useContext, useState } from "react";

export type LeftPanelMode = "chat" | "settings";

type LeftPanelContextValue = {
  mode: LeftPanelMode;
  setMode: (mode: LeftPanelMode) => void;
};

const LeftPanelContext = createContext<LeftPanelContextValue | undefined>(
  undefined,
);

export function LeftPanelProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<LeftPanelMode>("chat");

  return (
    <LeftPanelContext.Provider value={{ mode, setMode }}>
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
