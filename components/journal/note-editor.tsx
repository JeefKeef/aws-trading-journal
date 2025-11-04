"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Bold,
  Italic,
  Underline,
  Highlighter,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Quote,
  Link as LinkIcon,
  Minus,
  Undo,
  Redo,
  Image as ImageIcon,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NoteContent } from "@/lib/types/journal";

type NoteEditorProps = {
  noteId: string | null;
  onSave: (note: NoteContent) => void;
};

// Mock note data
const mockNotes: Record<string, NoteContent> = {
  "note-1": {
    id: "note-1",
    title: "AAPL Breakout Setup",
    content: `# AAPL Breakout Analysis

## Setup Overview
Apple stock broke above the 190 resistance level with strong volume today. This is a classic momentum breakout that aligns with our trend-following strategy.

### Key Levels
- **Entry**: $192.50
- **Stop Loss**: $188.00
- **Target**: $205.00

## Technical Analysis
- **Volume**: 30% above average
- **RSI**: 65 (bullish momentum)
- **Moving Averages**: Price above all major MAs

## Trade Rationale
The tech sector has been showing strength, and AAPL is leading the charge. Previous breakouts at this level have led to significant moves.

### Risk Management
- Position size: 2% of portfolio
- Risk/Reward: 1:3
- Maximum loss: $450

## Follow-up Notes
- Monitor volume on pullbacks
- Watch for sector rotation signals
- Take partial profits at $200`,
    tags: ["Breakout", "Large Cap", "Tech"],
    linkedTrade: {
      id: "trade-1",
      ticker: "AAPL",
      entryPrice: 192.5,
      exitPrice: 201.25,
      setup: "Momentum Breakout",
      date: "2025-11-03",
      profitLoss: 4.55,
      tags: ["Breakout", "Tech"],
    },
    images: [],
    createdAt: "2025-11-03T10:00:00Z",
    updatedAt: "2025-11-03T15:30:00Z",
  },
  "note-2": {
    id: "note-2",
    title: "TSLA Reversal Trade",
    content: `# TSLA Reversal Setup

Testing support at $220. Potential short squeeze setup if volume increases.

## Entry Criteria
- Bounce confirmation from support
- Volume spike above 20M
- RSI oversold recovery

**Status**: Watching for entry signal`,
    tags: ["Reversal", "Momentum"],
    linkedTrade: {
      id: "trade-2",
      ticker: "TSLA",
      entryPrice: 222.0,
      setup: "Support Bounce",
      date: "2025-11-02",
      tags: ["Reversal"],
    },
    images: [],
    createdAt: "2025-11-02T14:20:00Z",
    updatedAt: "2025-11-02T16:45:00Z",
  },
  "note-4": {
    id: "note-4",
    title: "Breakout Playbook",
    content: `# Breakout Trading Playbook

## Definition
A breakout occurs when price moves above a key resistance level with strong volume, indicating potential continuation.

## Entry Rules
1. Wait for close above resistance
2. Volume must be 50%+ above average
3. No major resistance within 5% above entry
4. Broader market in uptrend

## Position Sizing
- Standard risk: 1-2% per trade
- High conviction: 2-3% per trade

## Exit Strategy
- Initial stop: Below breakout level
- Trailing stop: Move to break even after +2R
- Profit target: 2-4x risk`,
    tags: ["Strategy", "Education"],
    images: [],
    createdAt: "2025-10-15T09:00:00Z",
    updatedAt: "2025-10-28T11:20:00Z",
  },
  "note-5": {
    id: "note-5",
    title: "Reversal Patterns",
    content: `# Reversal Pattern Guide

## Types of Reversals
- Double Bottom
- Head and Shoulders (inverse)
- Falling Wedge
- Bullish Engulfing

## Confirmation Signals
- Volume increase
- RSI divergence
- Support hold

## Risk Management
More conservative position sizing due to lower win rate.`,
    tags: ["Strategy", "Patterns"],
    images: [],
    createdAt: "2025-10-20T13:30:00Z",
    updatedAt: "2025-10-25T10:15:00Z",
  },
};

export default function NoteEditor({ noteId, onSave }: NoteEditorProps) {
  // Load note based on noteId
  const initialNote = useMemo(() => {
    if (noteId && mockNotes[noteId]) {
      return mockNotes[noteId];
    } else if (noteId) {
      return {
        id: noteId,
        title: "Untitled Note",
        content: "",
        tags: [],
        images: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return null;
  }, [noteId]);

  const [note, setNote] = useState<NoteContent | null>(initialNote);
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving..." | "">("");
  const [isLinkTradeOpen, setIsLinkTradeOpen] = useState(false);
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
  const [aiAction, setAiAction] = useState<"summarize" | "trades" | "reformat" | "tags">("summarize");

  // Update note when noteId changes
  useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);

  // Auto-save simulation
  useEffect(() => {
    if (!note) return;

    const timer = setTimeout(() => {
      setSaveStatus("Saving...");
      setTimeout(() => {
        onSave(note);
        setSaveStatus("Saved");
        setTimeout(() => setSaveStatus(""), 2000);
      }, 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, [note, onSave]);

  const handleAIAction = () => {
    // Simulate AI response
    const timestamp = new Date().toISOString();
    
    if (aiAction === "summarize") {
      alert("AI Summary: This note documents a high-probability breakout setup with clear entry/exit criteria and proper risk management.");
    } else if (aiAction === "trades") {
      alert("AI Analysis: Your last 3 linked trades show a 66% win rate with average R:R of 2.5:1. Breakout setups are your strongest edge.");
    } else if (aiAction === "tags") {
      const suggestedTags = ["Technical Analysis", "Swing Trade", "High Probability"];
      if (note) {
        setNote({
          ...note,
          tags: [...new Set([...note.tags, ...suggestedTags])],
          updatedAt: timestamp,
        });
      }
    }
    
    setIsAIDialogOpen(false);
  };

  const removeLinkedTrade = () => {
    if (!note) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { linkedTrade: _removed, ...rest } = note;
    setNote({ ...rest, updatedAt: new Date().toISOString() });
  };

  const addTag = (tag: string) => {
    if (!note || !tag.trim()) return;
    if (note.tags.includes(tag.trim())) return;
    
    setNote({
      ...note,
      tags: [...note.tags, tag.trim()],
      updatedAt: new Date().toISOString(),
    });
  };

  const removeTag = (tagToRemove: string) => {
    if (!note) return;
    
    setNote({
      ...note,
      tags: note.tags.filter((tag) => tag !== tagToRemove),
      updatedAt: new Date().toISOString(),
    });
  };

  if (!note) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-50 dark:bg-neutral-950">
        <div className="text-center">
          <FileText className="h-16 w-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500 dark:text-neutral-400">
            Select a note to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-neutral-950">
      {/* Toolbar */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Formatting Buttons */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Bold">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Italic">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Underline">
              <Underline className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Highlight">
              <Highlighter className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Headers */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Heading 1">
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Heading 2">
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Heading 3">
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Lists & Blocks */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Bullet List">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Numbered List">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Code">
              <Code className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Quote">
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Insert */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Link">
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Image">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Divider">
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Undo">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Redo">
              <Redo className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Save Status */}
          <span className="text-xs text-neutral-500">{saveStatus}</span>

          {/* AI Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAiAction("summarize");
              setIsAIDialogOpen(true);
            }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Actions
          </Button>

          {/* Link Trade */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLinkTradeOpen(true)}
          >
            Add Trade Details
          </Button>
        </div>
      </div>

      {/* Linked Trade Card */}
      {note.linkedTrade && (
        <div className="px-5 pt-4 shrink-0">
          <Card className="p-4 bg-neutral-50 dark:bg-neutral-900">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  ${note.linkedTrade.ticker}
                </h3>
                <Badge variant="outline">{note.linkedTrade.setup}</Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={removeLinkedTrade}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">Entry</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  ${note.linkedTrade.entryPrice.toFixed(2)}
                </p>
              </div>
              {note.linkedTrade.exitPrice && (
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs">Exit</p>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    ${note.linkedTrade.exitPrice.toFixed(2)}
                  </p>
                </div>
              )}
              {note.linkedTrade.profitLoss !== undefined && (
                <div>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs">P/L</p>
                  <p
                    className={cn(
                      "font-medium",
                      note.linkedTrade.profitLoss >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    )}
                  >
                    {note.linkedTrade.profitLoss >= 0 ? "+" : ""}
                    {note.linkedTrade.profitLoss.toFixed(2)}%
                  </p>
                </div>
              )}
              <div>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs">Date</p>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">
                  {note.linkedTrade.date}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <Input
            value={note.title}
            onChange={(e) =>
              setNote({
                ...note,
                title: e.target.value,
                updatedAt: new Date().toISOString(),
              })
            }
            className="text-3xl font-bold border-0 px-0 mb-4 focus-visible:ring-0"
            placeholder="Untitled Note"
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {note.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700"
                onClick={() => removeTag(tag)}
              >
                {tag}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
            <Input
              placeholder="Add tag..."
              className="h-6 w-32 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTag(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>

          {/* Content */}
          <Textarea
            value={note.content}
            onChange={(e) =>
              setNote({
                ...note,
                content: e.target.value,
                updatedAt: new Date().toISOString(),
              })
            }
            className="min-h-[600px] border-0 px-0 font-mono text-sm resize-none focus-visible:ring-0"
            placeholder="Start writing your note..."
          />
        </div>
      </div>

      {/* Link Trade Dialog */}
      <Dialog open={isLinkTradeOpen} onOpenChange={setIsLinkTradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Trade Details</DialogTitle>
            <DialogDescription>
              Select a trade from your history to link to this note.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            {/* Mock trade list */}
            <Card
              className="p-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900"
              onClick={() => {
                setNote({
                  ...note,
                  linkedTrade: mockNotes["note-1"].linkedTrade,
                  updatedAt: new Date().toISOString(),
                });
                setIsLinkTradeOpen(false);
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">AAPL - Momentum Breakout</p>
                  <p className="text-sm text-neutral-500">Entry: $192.50 | P/L: +4.55%</p>
                </div>
                <Badge variant="outline">2025-11-03</Badge>
              </div>
            </Card>

            <Card
              className="p-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900"
              onClick={() => {
                setNote({
                  ...note,
                  linkedTrade: mockNotes["note-2"].linkedTrade,
                  updatedAt: new Date().toISOString(),
                });
                setIsLinkTradeOpen(false);
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">TSLA - Support Bounce</p>
                  <p className="text-sm text-neutral-500">Entry: $222.00 | Open</p>
                </div>
                <Badge variant="outline">2025-11-02</Badge>
              </div>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkTradeOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Actions Dialog */}
      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Actions</DialogTitle>
            <DialogDescription>
              Choose an AI action to apply to your note.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-4">
            <Card
              className={cn(
                "p-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900",
                aiAction === "summarize" && "ring-2 ring-blue-500"
              )}
              onClick={() => setAiAction("summarize")}
            >
              <p className="font-medium">Summarize Note</p>
              <p className="text-sm text-neutral-500">
                Get a concise summary of your note content
              </p>
            </Card>

            <Card
              className={cn(
                "p-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900",
                aiAction === "trades" && "ring-2 ring-blue-500"
              )}
              onClick={() => setAiAction("trades")}
            >
              <p className="font-medium">Summarize Linked Trades</p>
              <p className="text-sm text-neutral-500">
                Analyze performance of trades linked to this note
              </p>
            </Card>

            <Card
              className={cn(
                "p-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900",
                aiAction === "tags" && "ring-2 ring-blue-500"
              )}
              onClick={() => setAiAction("tags")}
            >
              <p className="font-medium">Generate Tags</p>
              <p className="text-sm text-neutral-500">
                Auto-generate relevant tags from note content
              </p>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAIDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAIAction}>Run AI Action</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const FileText = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
