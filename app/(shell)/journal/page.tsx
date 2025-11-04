"use client";

import { useEffect } from "react";
import {
  createDefaultToolState,
  useRightPane,
} from "@/components/layout/right-pane-context";
import JournalContent from "./journal-content";

export default function JournalPage() {
  const { setState } = useRightPane();

  useEffect(() => {
    setState(createDefaultToolState());
  }, [setState]);

  // Render journal content directly in the right panel slot
  return <JournalContent />;
}
