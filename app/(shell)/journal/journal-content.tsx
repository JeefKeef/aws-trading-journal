"use client";

import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Tier = "Mini" | "Core" | "Pro" | "Ultra";

type JournalEntry = {
  id: number;
  ticker: string;
  date: string;
  notes: string;
  tier: Tier;
  tags: string[];
  aiSummary: string;
};

const tierColors = {
  Mini: {
    accent: "bg-blue-500",
    glow: "shadow-blue-500/50",
    badge: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    hover: "hover:shadow-blue-500/30",
  },
  Core: {
    accent: "bg-emerald-500",
    glow: "shadow-emerald-500/50",
    badge: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
    hover: "hover:shadow-emerald-500/30",
  },
  Pro: {
    accent: "bg-purple-500",
    glow: "shadow-purple-500/50",
    badge: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
    hover: "hover:shadow-purple-500/30",
  },
  Ultra: {
    accent: "bg-orange-500",
    glow: "shadow-orange-500/50",
    badge: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
    hover: "hover:shadow-orange-500/30",
  },
};

const initialEntries: JournalEntry[] = [
  {
    id: 1,
    ticker: "AAPL",
    date: "2025-11-03",
    notes: "Bullish breakout above 190 with strong volume.",
    tier: "Core",
    tags: ["Breakout", "Large Cap"],
    aiSummary: "High conviction setup matching your past successful patterns.",
  },
  {
    id: 2,
    ticker: "TSLA",
    date: "2025-11-02",
    notes: "Reversal from support; potential short squeeze.",
    tier: "Pro",
    tags: ["Reversal", "Momentum"],
    aiSummary: "Similar setup to previous profitable reversals.",
  },
  {
    id: 3,
    ticker: "NVDA",
    date: "2025-10-30",
    notes: "AI sector rally continuation setup.",
    tier: "Ultra",
    tags: ["AI", "Trend Continuation"],
    aiSummary: "Setup aligns with your best-performing sector trades.",
  },
];

export default function JournalContent() {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    ticker: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
    tags: "",
    tier: "Core" as Tier,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: JournalEntry = {
      id: Date.now(),
      ticker: formData.ticker.toUpperCase(),
      date: formData.date,
      notes: formData.notes,
      tier: formData.tier,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      aiSummary: "AI analysis pending...",
    };

    setEntries((prev) => [newEntry, ...prev]);
    setIsDialogOpen(false);
    setFormData({
      ticker: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
      tags: "",
      tier: "Core",
    });
  };

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-neutral-200 px-5 py-4 flex items-center justify-between shrink-0 dark:border-neutral-800">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Journal
          </h1>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </div>

        {/* Journal Grid */}
        <div className="flex-1 overflow-y-auto px-5 py-6 bg-neutral-50 dark:bg-neutral-950">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className={`
                  relative overflow-hidden rounded-xl border-0 bg-neutral-900 dark:bg-neutral-950
                  transition-all duration-300 hover:scale-[1.02] ${tierColors[entry.tier].hover} hover:shadow-xl
                `}
              >
                {/* Tier Color Accent Strip */}
                <div className={`h-1 w-full ${tierColors[entry.tier].accent}`} />

                {/* Card Content */}
                <div className="p-5">
                  {/* Header: Ticker + Date */}
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-2xl font-bold text-white">
                      {entry.ticker}
                    </h2>
                    <div className="flex items-center gap-1 text-xs text-neutral-400">
                      <Calendar className="h-3 w-3" />
                      <span>{entry.date}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  <p className="text-sm text-neutral-300 mb-4 line-clamp-3">
                    {entry.notes}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {entry.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        className={`text-xs font-medium px-2 py-1 ${tierColors[entry.tier].badge}`}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* AI Summary */}
                  <div className="rounded-lg bg-neutral-800/50 dark:bg-neutral-900/50 px-3 py-2 border border-neutral-700/50 dark:border-neutral-800">
                    <p className="text-xs italic text-neutral-400">
                      AI Summary: {entry.aiSummary}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* New Entry Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Journal Entry</DialogTitle>
            <DialogDescription>
              Document your trade setup and let AI analyze it.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Ticker */}
              <div className="grid gap-2">
                <Label htmlFor="ticker">Ticker</Label>
                <Input
                  id="ticker"
                  placeholder="AAPL"
                  value={formData.ticker}
                  onChange={(e) =>
                    setFormData({ ...formData, ticker: e.target.value })
                  }
                  required
                  className="uppercase"
                />
              </div>

              {/* Date */}
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              {/* Notes */}
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe your setup, entry reasons, risk management..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  required
                  rows={4}
                />
              </div>

              {/* Tags */}
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="Breakout, Momentum, Large Cap"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Comma separated
                </p>
              </div>

              {/* Tier */}
              <div className="grid gap-2">
                <Label htmlFor="tier">Tier</Label>
                <Select
                  value={formData.tier}
                  onValueChange={(value: Tier) =>
                    setFormData({ ...formData, tier: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mini">Mini</SelectItem>
                    <SelectItem value="Core">Core</SelectItem>
                    <SelectItem value="Pro">Pro</SelectItem>
                    <SelectItem value="Ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Entry</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
