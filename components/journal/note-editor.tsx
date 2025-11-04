"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Sparkles,
  X,
  Upload,
  Trash2,
  Clock,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "./rich-text-editor";
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
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [newTag, setNewTag] = useState("");

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

  const handleAIAction = async () => {
    if (!note) return;
    
    setIsProcessingAI(true);
    const timestamp = new Date().toISOString();
    
    try {
      // Simulate AI API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (aiAction === "summarize") {
        const summary = "**AI Summary:**\n\nThis note documents a high-probability breakout setup with clear entry/exit criteria and proper risk management. Key strengths include well-defined stop loss levels and realistic profit targets with favorable risk/reward ratios.";
        setNote({
          ...note,
          content: `${note.content}\n\n---\n\n${summary}`,
          updatedAt: timestamp,
        });
      } else if (aiAction === "trades") {
        const analysis = "**AI Trade Analysis:**\n\nBased on linked trades, your performance shows:\n- Win Rate: 66.7%\n- Average R:R: 2.5:1\n- Best Setup Type: Momentum Breakouts\n- Recommendation: Continue focusing on high-volume breakouts above resistance with proper risk management.";
        setNote({
          ...note,
          content: `${note.content}\n\n---\n\n${analysis}`,
          updatedAt: timestamp,
        });
      } else if (aiAction === "reformat") {
        // Simulate reformatting by adding structure
        const reformatted = note.content.split("\n\n").join("\n\n");
        setNote({
          ...note,
          content: reformatted,
          updatedAt: timestamp,
        });
      } else if (aiAction === "tags") {
        const suggestedTags = ["Technical Analysis", "Swing Trade", "High Probability"];
        setNote({
          ...note,
          tags: [...new Set([...note.tags, ...suggestedTags])],
          updatedAt: timestamp,
        });
      }
    } catch (error) {
      console.error("AI action failed:", error);
      alert("Failed to process AI action. Please try again.");
    } finally {
      setIsProcessingAI(false);
      setIsAIDialogOpen(false);
    }
  };

  const removeLinkedTrade = () => {
    if (!note) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { linkedTrade: _removed, ...rest } = note;
    setNote({ ...rest, updatedAt: new Date().toISOString() });
  };

  const addTag = useCallback((tag: string) => {
    if (!note || !tag.trim()) return;
    if (note.tags.includes(tag.trim())) return;
    
    setNote({
      ...note,
      tags: [...note.tags, tag.trim()],
      updatedAt: new Date().toISOString(),
    });
  }, [note]);

  const removeTag = useCallback((tagToRemove: string) => {
    if (!note) return;
    
    setNote({
      ...note,
      tags: note.tags.filter((tag) => tag !== tagToRemove),
      updatedAt: new Date().toISOString(),
    });
  }, [note]);

  const handleContentChange = useCallback((content: string) => {
    if (!note) return;
    setNote({
      ...note,
      content,
      updatedAt: new Date().toISOString(),
    });
  }, [note]);

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    // Simulate image upload - in real app this would upload to storage
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }, []);

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
      {/* Top Toolbar */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          {/* Last Updated */}
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Updated {new Date(note.updatedAt).toLocaleString()}
            </span>
          </div>

          {/* Save Status */}
          {saveStatus && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {saveStatus}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
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
            className="text-3xl font-bold border-0 px-0 mb-4 focus-visible:ring-0 shadow-none"
            placeholder="Untitled Note"
          />

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-neutral-400" />
            {note.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-600 dark:hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="h-7 w-32 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTag.trim()) {
                  addTag(newTag);
                  setNewTag("");
                }
              }}
            />
          </div>

          {/* Rich Text Editor */}
          <div className="mb-6">
            <RichTextEditor
              content={note.content}
              onChange={handleContentChange}
              placeholder="Start writing your trading journal..."
              onImageUpload={handleImageUpload}
            />
          </div>

          {/* Images */}
          {note.images && note.images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3 flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Attached Images ({note.images.length})
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {note.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative group rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700"
                  >
                    <img
                      src={image.url}
                      alt={image.fileName}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 truncate">
                      {image.fileName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            <Button 
              variant="outline" 
              onClick={() => setIsAIDialogOpen(false)}
              disabled={isProcessingAI}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAIAction}
              disabled={isProcessingAI}
            >
              {isProcessingAI ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Run AI Action"
              )}
            </Button>
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
