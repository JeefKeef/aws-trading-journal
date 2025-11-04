"use client";

import { useState } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import FileTree from "@/components/journal/file-tree";
import NoteEditorEnhanced from "@/components/journal/note-editor-enhanced";
import type { NoteContent } from "@/lib/types/journal";

export default function JournalPage() {
  const [activeNoteId, setActiveNoteId] = useState<string | null>("note-1");

  const handleSaveNote = (note: NoteContent) => {
    // In a real app, this would save to Supabase
    console.log("Saving note:", note);
  };

  return (
    <div className="h-full w-full overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* File Tree Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
          <FileTree activeNoteId={activeNoteId} onSelectNote={setActiveNoteId} />
        </ResizablePanel>

        <ResizableHandle />

        {/* Note Editor */}
        <ResizablePanel defaultSize={80} minSize={65}>
          <div className="h-full w-full">
            <NoteEditorEnhanced noteId={activeNoteId} onSave={handleSaveNote} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
