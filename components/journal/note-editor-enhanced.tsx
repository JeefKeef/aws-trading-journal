"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Sparkles,
  X,
  TrendingUp,
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NoteContent, LinkedTrade } from "@/lib/types/journal";

type NoteEditorProps = {
  noteId: string | null;
  onSave: (note: NoteContent) => void;
};

// Mock note data
const mockNotes: Record<string, NoteContent> = {
  "note-1": {
    id: "note-1",
    title: "AAPL Breakout Setup",
    content: `<h1>AAPL Breakout Analysis</h1><h2>Setup Overview</h2><p>Apple stock broke above the 190 resistance level with strong volume today. This is a classic momentum breakout that aligns with our trend-following strategy.</p><h3>Key Levels</h3><ul><li><strong>Entry</strong>: $192.50</li><li><strong>Stop Loss</strong>: $188.00</li><li><strong>Target</strong>: $205.00</li></ul><h2>Technical Analysis</h2><ul><li><strong>Volume</strong>: 30% above average</li><li><strong>RSI</strong>: 65 (bullish momentum)</li><li><strong>Moving Averages</strong>: Price above all major MAs</li></ul><h2>Trade Rationale</h2><p>The tech sector has been showing strength, and AAPL is leading the charge. Previous breakouts at this level have led to significant moves.</p><h3>Risk Management</h3><ul><li>Position size: 2% of portfolio</li><li>Risk/Reward: 1:3</li><li>Maximum loss: $450</li></ul>`,
    tags: ["Breakout", "Large Cap", "Tech"],
    linkedTrades: [
      {
        id: "trade-1",
        ticker: "AAPL",
        entryPrice: 192.5,
        exitPrice: 201.25,
        quantity: 50,
        setup: "Momentum Breakout",
        date: "2025-11-03T09:30:00Z",
        profitLoss: 4.55,
        status: "closed",
        tags: ["Breakout", "Tech"],
      },
      {
        id: "trade-3",
        ticker: "AAPL",
        entryPrice: 198.0,
        exitPrice: 203.50,
        quantity: 30,
        setup: "Continuation",
        date: "2025-11-04T10:15:00Z",
        profitLoss: 2.78,
        status: "closed",
        tags: ["Continuation", "Tech"],
      },
      {
        id: "trade-4",
        ticker: "MSFT",
        entryPrice: 375.0,
        quantity: 20,
        setup: "Support Bounce",
        date: "2025-11-03T14:00:00Z",
        status: "open",
        tags: ["Support", "Tech"],
      },
    ],
    images: [],
    createdAt: "2025-11-03T10:00:00Z",
    updatedAt: "2025-11-03T15:30:00Z",
  },
  "note-2": {
    id: "note-2",
    title: "TSLA Reversal Trade",
    content: `<h1>TSLA Reversal Setup</h1><p>Testing support at $220. Potential short squeeze setup if volume increases.</p><h2>Entry Criteria</h2><ul><li>Bounce confirmation from support</li><li>Volume spike above 20M</li><li>RSI oversold recovery</li></ul><p><strong>Status</strong>: Watching for entry signal</p>`,
    tags: ["Reversal", "Momentum"],
    linkedTrade: {
      id: "trade-2",
      ticker: "TSLA",
      entryPrice: 222.0,
      quantity: 25,
      setup: "Support Bounce",
      date: "2025-11-02",
      status: "open",
      tags: ["Reversal"],
    },
    images: [],
    createdAt: "2025-11-02T14:20:00Z",
    updatedAt: "2025-11-02T16:45:00Z",
  },
  "note-4": {
    id: "note-4",
    title: "Breakout Playbook",
    content: `<h1>Breakout Trading Playbook</h1><h2>Definition</h2><p>A breakout occurs when price moves above a key resistance level with strong volume, indicating potential continuation.</p><h2>Entry Rules</h2><ol><li>Wait for close above resistance</li><li>Volume must be 50%+ above average</li><li>No major resistance within 5% above entry</li><li>Broader market in uptrend</li></ol><h2>Position Sizing</h2><ul><li>Standard risk: 1-2% per trade</li><li>High conviction: 2-3% per trade</li></ul><h2>Exit Strategy</h2><ul><li>Initial stop: Below breakout level</li><li>Trailing stop: Move to break even after +2R</li><li>Profit target: 2-4x risk</li></ul>`,
    tags: ["Strategy", "Education"],
    images: [],
    createdAt: "2025-10-15T09:00:00Z",
    updatedAt: "2025-10-28T11:20:00Z",
  },
  "note-5": {
    id: "note-5",
    title: "Reversal Patterns",
    content: `<h1>Reversal Pattern Guide</h1><h2>Types of Reversals</h2><ul><li>Double Bottom</li><li>Head and Shoulders (inverse)</li><li>Falling Wedge</li><li>Bullish Engulfing</li></ul><h2>Confirmation Signals</h2><ul><li>Volume increase</li><li>RSI divergence</li><li>Support hold</li></ul><h2>Risk Management</h2><p>More conservative position sizing due to lower win rate.</p>`,
    tags: ["Strategy", "Patterns"],
    images: [],
    createdAt: "2025-10-20T13:30:00Z",
    updatedAt: "2025-10-25T10:15:00Z",
  },
};

export default function NoteEditorEnhanced({ noteId, onSave }: NoteEditorProps) {
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
  const [isTradeDetailsOpen, setIsTradeDetailsOpen] = useState(false);
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
        const summary = "<hr><p><strong>AI Summary:</strong></p><p>This note documents a high-probability breakout setup with clear entry/exit criteria and proper risk management. Key strengths include well-defined stop loss levels and realistic profit targets with favorable risk/reward ratios.</p>";
        setNote({
          ...note,
          content: `${note.content}${summary}`,
          updatedAt: timestamp,
        });
      } else if (aiAction === "trades") {
        const analysis = "<hr><p><strong>AI Trade Analysis:</strong></p><p>Based on linked trades, your performance shows:</p><ul><li>Win Rate: 66.7%</li><li>Average R:R: 2.5:1</li><li>Best Setup Type: Momentum Breakouts</li><li>Recommendation: Continue focusing on high-volume breakouts above resistance with proper risk management.</li></ul>";
        setNote({
          ...note,
          content: `${note.content}${analysis}`,
          updatedAt: timestamp,
        });
      } else if (aiAction === "reformat") {
        // Keep content as is for reformatting
        setNote({
          ...note,
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
          <div className="h-16 w-16 text-neutral-300 dark:text-neutral-700 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400">
            Select a note to start editing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-neutral-950">
      {/* Compact Top Toolbar */}
      <div className="sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2 flex items-center justify-between shrink-0 bg-white dark:bg-neutral-950">
        <div className="flex items-center gap-3">
          {/* Linked Trades - Summary Only */}
          {note.linkedTrades && note.linkedTrades.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              {/* Dates range */}
              <span className="text-neutral-500 dark:text-neutral-400 font-medium text-[11px]">
                {(() => {
                  const firstDate = new Date(note.linkedTrades[0].date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  });
                  const lastDate = new Date(note.linkedTrades[note.linkedTrades.length - 1].date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  });
                  
                  return firstDate === lastDate ? firstDate : `${firstDate} - ${lastDate}`;
                })()}
              </span>

              {/* Tickers */}
              <div className="flex items-center gap-1.5">
                {Array.from(new Set(note.linkedTrades.map(t => t.ticker))).map((ticker, idx, arr) => (
                  <span key={ticker}>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                      ${ticker}
                    </span>
                    {idx < arr.length - 1 && <span className="text-neutral-500 mx-1">•</span>}
                  </span>
                ))}
              </div>

              {/* Total P&L (closed trades only) */}
              {(() => {
                const closedTrades = note.linkedTrades.filter(t => t.status === "closed" && t.profitLoss !== undefined && t.quantity && t.exitPrice);
                if (closedTrades.length > 0) {
                  const totalPnLDollar = closedTrades.reduce((sum, t) => 
                    sum + ((t.exitPrice! - t.entryPrice) * t.quantity!), 0
                  );
                  const totalPnLPercent = closedTrades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) / closedTrades.length;
                  
                  return (
                    <span 
                      className="inline-flex items-center gap-1.5 rounded-md border-2 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-sm transition-all"
                      style={
                        totalPnLPercent > 0
                          ? {
                              borderColor: "#10B981",
                              backgroundColor: "rgba(16, 185, 129, 0.15)",
                              color: "#10B981",
                              boxShadow: "0 0 10px rgba(16, 185, 129, 0.4), inset 0 0 10px rgba(16, 185, 129, 0.1)"
                            }
                          : totalPnLPercent < 0
                          ? {
                              borderColor: "#EF4444",
                              backgroundColor: "rgba(239, 68, 68, 0.15)",
                              color: "#EF4444",
                              boxShadow: "0 0 10px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(239, 68, 68, 0.1)"
                            }
                          : {
                              borderColor: "#888888",
                              backgroundColor: "rgba(136, 136, 136, 0.15)",
                              color: "#888888",
                              boxShadow: "0 0 10px rgba(136, 136, 136, 0.4), inset 0 0 10px rgba(136, 136, 136, 0.1)"
                            }
                      }
                    >
                      {totalPnLDollar > 0 ? "+" : ""}${totalPnLDollar.toFixed(2)} ({totalPnLPercent > 0 ? "+" : ""}{totalPnLPercent.toFixed(2)}%)
                    </span>
                  );
                }
                return null;
              })()}

              {/* Trade count badge */}
              <Badge variant="secondary" className="text-[10px] h-5">
                {note.linkedTrades.length} {note.linkedTrades.length === 1 ? 'trade' : 'trades'}
              </Badge>
            </div>
          )}

          {/* Save Status */}
          {saveStatus && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {saveStatus}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Trade Details Button */}
          {note.linkedTrades && note.linkedTrades.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setIsTradeDetailsOpen(true)}
            >
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              View Trade Details
            </Button>
          )}

          {/* AI Actions */}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              setAiAction("summarize");
              setIsAIDialogOpen(true);
            }}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            AI
          </Button>

          {/* Link Trade */}
          {(!note.linkedTrades || note.linkedTrades.length === 0) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setIsLinkTradeOpen(true)}
            >
              Link Trade
            </Button>
          )}
        </div>
      </div>

      {/* Editor Area - Full height with overflow */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-6 py-6">
          {/* Title */}
          <div className="mb-6">
            <Input
              value={note.title}
              onChange={(e) =>
                setNote({
                  ...note,
                  title: e.target.value,
                  updatedAt: new Date().toISOString(),
                })
              }
              className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 shadow-none"
              placeholder="Untitled Note"
            />
          </div>

          {/* Tags - Compact */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {note.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-600 dark:hover:text-red-400"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </Badge>
            ))}
            <Input
              placeholder="Add tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="h-6 w-24 text-xs border-dashed"
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTag.trim()) {
                  addTag(newTag);
                  setNewTag("");
                }
              }}
            />
          </div>

          {/* Rich Text Editor */}
          <div className="w-full">
            <RichTextEditor
              content={note.content}
              onChange={handleContentChange}
              placeholder="Start writing your trading journal..."
              onImageUpload={handleImageUpload}
            />
          </div>
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
                "p-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors",
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
                "p-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors",
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
                "p-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors",
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

      {/* Trade Details Sheet */}
      <Sheet open={isTradeDetailsOpen} onOpenChange={setIsTradeDetailsOpen}>
        <SheetContent className="w-full sm:max-w-2xl flex flex-col p-0">
          <SheetHeader className="px-6 pt-6 pb-4 shrink-0">
            <SheetTitle>Linked Trades</SheetTitle>
            <SheetDescription>
              Complete trade information organized by ticker
            </SheetDescription>
          </SheetHeader>

          {note.linkedTrades && note.linkedTrades.length > 0 && (
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Trades grouped by ticker */}
              {(() => {
                const tradesByTicker = note.linkedTrades.reduce((acc: Record<string, LinkedTrade[]>, trade) => {
                  if (!acc[trade.ticker]) {
                    acc[trade.ticker] = [];
                  }
                  acc[trade.ticker].push(trade);
                  return acc;
                }, {});

                return (
                  <Accordion type="multiple" className="space-y-3">
                    {Object.entries(tradesByTicker).map(([ticker, trades]) => {
                      const totalPnL = trades
                        .filter(t => t.exitPrice && t.quantity)
                        .reduce((sum, t) => sum + ((t.exitPrice! - t.entryPrice) * t.quantity!), 0);
                      const openTrades = trades.filter(t => t.status === "open").length;
                      const closedTrades = trades.filter(t => t.status === "closed").length;

                      return (
                        <AccordionItem key={ticker} value={ticker} className="border rounded-lg">
                          <AccordionTrigger className="px-4 py-3 hover:no-underline">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                  ${ticker}
                                </span>
                                <Badge variant="secondary" className="text-[10px]">
                                  {trades.length} {trades.length === 1 ? 'trade' : 'trades'}
                                </Badge>
                                {openTrades > 0 && (
                                  <span 
                                    className="inline-flex items-center rounded-md border-2 px-2 py-0.5 text-[10px] font-semibold"
                                    style={{
                                      borderColor: "#3D7EFF",
                                      backgroundColor: "rgba(61, 126, 255, 0.15)",
                                      color: "#3D7EFF"
                                    }}
                                  >
                                    {openTrades} OPEN
                                  </span>
                                )}
                              </div>
                              {totalPnL !== 0 && (
                                <span
                                  className={cn(
                                    "text-sm font-semibold",
                                    totalPnL > 0
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : "text-red-600 dark:text-red-400"
                                  )}
                                >
                                  {totalPnL > 0 ? "+" : ""}${totalPnL.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4 pt-2">
                            <div className="space-y-4">
                              {/* Executions Table */}
                              <div>
                                <h4 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wide">
                                  Executions
                                </h4>
                                <div className="border rounded-md">
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-neutral-50 dark:bg-neutral-900">
                                        <TableHead className="h-8 text-xs">Date/Time</TableHead>
                                        <TableHead className="h-8 text-xs">Setup</TableHead>
                                        <TableHead className="h-8 text-xs text-right">Entry</TableHead>
                                        <TableHead className="h-8 text-xs text-right">Exit</TableHead>
                                        <TableHead className="h-8 text-xs text-right">Qty</TableHead>
                                        <TableHead className="h-8 text-xs text-right">P&L</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {trades.map((trade) => {
                                        const pnlDollar = trade.exitPrice && trade.quantity 
                                          ? (trade.exitPrice - trade.entryPrice) * trade.quantity 
                                          : null;
                                        
                                        return (
                                          <TableRow key={trade.id} className="text-xs">
                                            <TableCell className="py-2">
                                              <div className="text-xs">
                                                {new Date(trade.date).toLocaleDateString('en-US', { 
                                                  month: 'short', 
                                                  day: 'numeric',
                                                  year: 'numeric'
                                                })}
                                              </div>
                                              <div className="text-[10px] text-neutral-500">
                                                {new Date(trade.date).toLocaleTimeString('en-US', { 
                                                  hour: '2-digit', 
                                                  minute: '2-digit'
                                                })}
                                              </div>
                                            </TableCell>
                                            <TableCell className="py-2">
                                              <div className="text-xs">{trade.setup}</div>
                                              {trade.status === "open" && (
                                                <Badge 
                                                  variant="outline" 
                                                  className="text-[9px] h-4 px-1 mt-1"
                                                  style={{
                                                    borderColor: "#3D7EFF",
                                                    color: "#3D7EFF"
                                                  }}
                                                >
                                                  OPEN
                                                </Badge>
                                              )}
                                            </TableCell>
                                            <TableCell className="py-2 text-right font-medium">
                                              ${trade.entryPrice.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="py-2 text-right font-medium">
                                              {trade.exitPrice ? `$${trade.exitPrice.toFixed(2)}` : '—'}
                                            </TableCell>
                                            <TableCell className="py-2 text-right">
                                              {trade.quantity || '—'}
                                            </TableCell>
                                            <TableCell className="py-2 text-right">
                                              {pnlDollar !== null ? (
                                                <span
                                                  className={cn(
                                                    "font-semibold text-xs",
                                                    pnlDollar > 0
                                                      ? "text-emerald-600 dark:text-emerald-400"
                                                      : pnlDollar < 0
                                                      ? "text-red-600 dark:text-red-400"
                                                      : "text-neutral-600"
                                                  )}
                                                >
                                                  {pnlDollar > 0 ? "+" : ""}${pnlDollar.toFixed(2)}
                                                </span>
                                              ) : (
                                                <span className="text-neutral-400">—</span>
                                              )}
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>

                              {/* Trade Tags */}
                              {(() => {
                                const allTags = Array.from(new Set(trades.flatMap(t => t.tags || [])));
                                if (allTags.length > 0) {
                                  return (
                                    <div>
                                      <h4 className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wide">
                                        Tags
                                      </h4>
                                      <div className="flex flex-wrap gap-1.5">
                                        {allTags.map((tag) => (
                                          <Badge key={tag} variant="secondary" className="text-[10px]">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })()}

                              {/* Summary Stats */}
                              <div className="grid grid-cols-3 gap-3 pt-2">
                                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-md p-2">
                                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                                    Total Trades
                                  </p>
                                  <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                    {trades.length}
                                  </p>
                                </div>
                                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-md p-2">
                                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                                    Win Rate
                                  </p>
                                  <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                                    {closedTrades > 0 
                                      ? `${((trades.filter(t => t.profitLoss && t.profitLoss > 0).length / closedTrades) * 100).toFixed(0)}%`
                                      : '—'}
                                  </p>
                                </div>
                                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-md p-2">
                                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
                                    Total P&L
                                  </p>
                                  <p className={cn(
                                    "text-lg font-bold",
                                    totalPnL > 0
                                      ? "text-emerald-600 dark:text-emerald-400"
                                      : totalPnL < 0
                                      ? "text-red-600 dark:text-red-400"
                                      : "text-neutral-900 dark:text-neutral-100"
                                  )}>
                                    {totalPnL !== 0 ? (
                                      <>{totalPnL > 0 ? "+" : ""}${totalPnL.toFixed(2)}</>
                                    ) : '—'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                );
              })()}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
