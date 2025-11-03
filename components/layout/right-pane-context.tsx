"use client";

import { createContext, useContext, useState } from "react";

export type ToolMode = "overview" | "screener" | "heatmap" | "news" | "alerts";

export type ToolState = {
  mode: ToolMode;
  heading: string;
  description?: string;
  payload?: unknown;
};

type RightPaneContextValue = {
  state: ToolState;
  setState: React.Dispatch<React.SetStateAction<ToolState>>;
};

const defaultToolState: ToolState = {
  mode: "overview",
  heading: "Market overview",
  description: "Key metrics and snapshot cards will appear here.",
  payload: undefined,
};

const RightPaneContext = createContext<RightPaneContextValue | undefined>(
  undefined,
);

export function RightPaneProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ToolState>(defaultToolState);

  return (
    <RightPaneContext.Provider value={{ state, setState }}>
      {children}
    </RightPaneContext.Provider>
  );
}

export function useRightPane() {
  const context = useContext(RightPaneContext);
  if (!context) {
    throw new Error("useRightPane must be used within a RightPaneProvider");
  }
  return context;
}

export function createDefaultToolState(): ToolState {
  return { ...defaultToolState };
}
