"use client";

import { useState, useEffect } from "react";
import {
  createDefaultToolState,
  useRightPane,
} from "@/components/layout/right-pane-context";
import FileTree from "@/components/journal/file-tree";
import NoteEditor from "@/components/journal/note-editor";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import type { NoteContent } from "@/lib/types/journal";

export default function JournalPage() {
  const { setState } = useRightPane();
  const [activeNoteId, setActiveNoteId] = useState<string | null>("note-1");

  useEffect(() => {
    setState(createDefaultToolState());
  }, [setState]);

  const handleSaveNote = (note: NoteContent) => {
    // In a real app, this would save to Supabase
    console.log("Saving note:", note);
  };

  return (
    <div className="h-full w-full">
      <ResizablePanelGroup direction="horizontal">
        {/* File Tree Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
          <FileTree activeNoteId={activeNoteId} onSelectNote={setActiveNoteId} />
        </ResizablePanel>

        <ResizableHandle />

        {/* Note Editor */}
        <ResizablePanel defaultSize={80} minSize={65}>
          <NoteEditor noteId={activeNoteId} onSave={handleSaveNote} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
