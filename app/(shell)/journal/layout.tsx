"use client";

import type { ReactNode } from "react";
import ChatPage from "../chat/page";

export default function JournalLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* This wraps the journal page, but we want chat in left panel */}
      {/* So we'll render chat here and pass journal content to the right */}
      <div className="hidden">
        {/* Hide the default children rendering */}
        {children}
      </div>
      {/* Render chat in the left panel instead */}
      <ChatPage />
    </>
  );
}
