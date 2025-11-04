"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Download, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Types
type EventType = "trade" | "journal" | "earnings";

type TradeEvent = {
  id: string;
  type: "trade";
  date: Date;
  ticker: string;
  pl: number;
  entry: number;
  exit: number;
  notes?: string;
  journalId?: string;
};

type JournalEvent = {
  id: string;
  type: "journal";
  date: Date;
  title: string;
  emotionTags: string[];
  summary: string;
};

type EarningsEvent = {
  id: string;
  type: "earnings";
  date: Date;
  company: string;
  ticker: string;
  epsForecast: number;
  epsActual?: number;
  time: string;
};

type CalendarEvent = TradeEvent | JournalEvent | EarningsEvent;

// Mock data
const mockEvents: CalendarEvent[] = [
  {
    id: "t1",
    type: "trade",
    date: new Date(2025, 10, 5),
    ticker: "AAPL",
    pl: 680,
    entry: 180.50,
    exit: 183.25,
    notes: "Clean breakout above resistance",
    journalId: "j1",
  },
  {
    id: "t2",
    type: "trade",
    date: new Date(2025, 10, 6),
    ticker: "TSLA",
    pl: -187,
    entry: 242.80,
    exit: 240.15,
    notes: "Failed reversal pattern",
  },
  {
    id: "t3",
    type: "trade",
    date: new Date(2025, 10, 7),
    ticker: "MSFT",
    pl: 648,
    entry: 375.20,
    exit: 378.90,
  },
  {
    id: "j1",
    type: "journal",
    date: new Date(2025, 10, 5),
    title: "Strong morning momentum",
    emotionTags: ["Confident", "Focused"],
    summary: "Market opened with strong bullish momentum. Followed my strategy perfectly.",
  },
  {
    id: "j2",
    type: "journal",
    date: new Date(2025, 10, 6),
    title: "Emotional trading mistake",
    emotionTags: ["Frustrated", "Anxious"],
    summary: "Got impatient and entered too early. Need to wait for confirmation.",
  },
  {
    id: "e1",
    type: "earnings",
    date: new Date(2025, 10, 8),
    company: "NVIDIA Corp",
    ticker: "NVDA",
    epsForecast: 5.42,
    epsActual: 5.68,
    time: "After Market Close",
  },
  {
    id: "e2",
    type: "earnings",
    date: new Date(2025, 10, 12),
    company: "Apple Inc",
    ticker: "AAPL",
    epsForecast: 1.52,
    time: "After Market Close",
  },
  {
    id: "t4",
    type: "trade",
    date: new Date(2025, 10, 8),
    ticker: "GOOGL",
    pl: 510,
    entry: 142.30,
    exit: 144.15,
  },
  {
    id: "t5",
    type: "trade",
    date: new Date(2025, 10, 12),
    ticker: "META",
    pl: -309,
    entry: 485.60,
    exit: 482.40,
  },
  {
    id: "t6",
    type: "trade",
    date: new Date(2025, 10, 12),
    ticker: "SPY",
    pl: 225,
    entry: 450.20,
    exit: 451.40,
  },
  {
    id: "t7",
    type: "trade",
    date: new Date(2025, 10, 13),
    ticker: "NVDA",
    pl: 890,
    entry: 495.80,
    exit: 502.30,
  },
  {
    id: "t8",
    type: "trade",
    date: new Date(2025, 10, 13),
    ticker: "AMD",
    pl: -145,
    entry: 165.40,
    exit: 164.25,
  },
  {
    id: "t9",
    type: "trade",
    date: new Date(2025, 10, 14),
    ticker: "TSLA",
    pl: 1240,
    entry: 238.90,
    exit: 245.20,
  },
  {
    id: "j3",
    type: "journal",
    date: new Date(2025, 10, 12),
    title: "Market consolidation",
    emotionTags: ["Neutral", "Patient"],
    summary: "Low volume day. Staying patient for better setups.",
  },
];

export function CalendarContent() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 4)); // November 4, 2025
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDayTradesDialogOpen, setIsDayTradesDialogOpen] = useState(false);
  const [eventFilters, setEventFilters] = useState({
    trades: true,
    journals: true,
    earnings: true,
  });

  // Add Event Form State
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "trade" as EventType,
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  // Get filtered events
  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      if (event.type === "trade" && !eventFilters.trades) return false;
      if (event.type === "journal" && !eventFilters.journals) return false;
      if (event.type === "earnings" && !eventFilters.earnings) return false;
      return true;
    });
  }, [eventFilters]);

  // Calendar calculations
  const calendar = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and total days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Build calendar grid
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
      currentWeek.push(prevMonthDay);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(new Date(year, month, day));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Add remaining days to complete last week
    if (currentWeek.length > 0) {
      const remaining = 7 - currentWeek.length;
      for (let i = 1; i <= remaining; i++) {
        currentWeek.push(new Date(year, month + 1, i));
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }, [currentDate]);

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter((event) => {
      const eventDate = event.date;
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get trade summary for a specific date
  const getTradeSummaryForDate = (date: Date) => {
    const events = getEventsForDate(date);
    const trades = events.filter((e): e is TradeEvent => e.type === "trade");
    
    if (trades.length === 0) return null;
    
    const totalPL = trades.reduce((sum, trade) => sum + trade.pl, 0);
    const avgEntry = trades.reduce((sum, trade) => sum + trade.entry, 0) / trades.length;
    const plPercentage = (totalPL / (avgEntry * trades.length)) * 100;
    
    return {
      count: trades.length,
      totalPL,
      plPercentage,
      wins: trades.filter(t => t.pl > 0).length,
      losses: trades.filter(t => t.pl < 0).length,
    };
  };

  // Get weekly summary for a week of dates
  const getWeeklySummary = (weekDates: Date[]) => {
    const allTrades: TradeEvent[] = [];
    
    weekDates.forEach(date => {
      const events = getEventsForDate(date);
      const trades = events.filter((e): e is TradeEvent => e.type === "trade");
      allTrades.push(...trades);
    });
    
    if (allTrades.length === 0) return null;
    
    const totalPL = allTrades.reduce((sum, trade) => sum + trade.pl, 0);
    const avgEntry = allTrades.reduce((sum, trade) => sum + trade.entry, 0) / allTrades.length;
    const plPercentage = (totalPL / (avgEntry * allTrades.length)) * 100;
    const wins = allTrades.filter(t => t.pl > 0).length;
    const losses = allTrades.filter(t => t.pl < 0).length;
    const winRate = (wins / allTrades.length) * 100;
    
    return {
      count: allTrades.length,
      totalPL,
      plPercentage,
      wins,
      losses,
      winRate,
      tradingDays: weekDates.filter(date => getTradeSummaryForDate(date) !== null).length,
    };
  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Date", "Type", "Details", "Value"];
    const rows = filteredEvents.map((event) => {
      const date = event.date.toLocaleDateString();
      if (event.type === "trade") {
        return [date, "Trade", `${event.ticker} - ${event.notes || "No notes"}`, `$${event.pl}`];
      } else if (event.type === "journal") {
        return [date, "Journal", event.title, event.emotionTags.join(", ")];
      } else {
        return [date, "Earnings", `${event.company} (${event.ticker})`, `EPS: ${event.epsForecast}`];
      }
    });

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trading-calendar-${currentDate.toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Calendar exported", { description: "Calendar data downloaded as CSV" });
  };

  // Add new event
  const handleAddEvent = () => {
    toast.success("Event added", { description: `New ${newEvent.type} event created` });
    setIsAddEventDialogOpen(false);
    setNewEvent({
      title: "",
      type: "trade",
      date: new Date().toISOString().split("T")[0],
      description: "",
    });
  };

  // Month/Year display
  const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col h-full bg-neutral-50 dark:bg-neutral-950">
      {/* Navigation Bar - Single Row */}
      <div className="border-b bg-white dark:bg-neutral-900 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Month Navigation */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <h2 className="text-lg font-semibold">{monthYear}</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <Label htmlFor="date-range" className="text-sm text-neutral-600 dark:text-neutral-400">
                Jump to:
              </Label>
              <Input
                id="date-range"
                type="month"
                value={`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split("-");
                  setCurrentDate(new Date(parseInt(year), parseInt(month) - 1, 1));
                }}
                className="w-40"
              />
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu open={filterDropdownOpen} onOpenChange={setFilterDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="filter-trades"
                      checked={eventFilters.trades}
                      onCheckedChange={(checked) =>
                        setEventFilters({ ...eventFilters, trades: checked as boolean })
                      }
                    />
                    <Label htmlFor="filter-trades" className="text-sm font-normal cursor-pointer">
                      🟩 Trades
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="filter-journals"
                      checked={eventFilters.journals}
                      onCheckedChange={(checked) =>
                        setEventFilters({ ...eventFilters, journals: checked as boolean })
                      }
                    />
                    <Label htmlFor="filter-journals" className="text-sm font-normal cursor-pointer">
                      🟦 Journal Entries
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="filter-earnings"
                      checked={eventFilters.earnings}
                      onCheckedChange={(checked) =>
                        setEventFilters({ ...eventFilters, earnings: checked as boolean })
                      }
                    />
                    <Label htmlFor="filter-earnings" className="text-sm font-normal cursor-pointer">
                      🟧 Earnings / Market Events
                    </Label>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Add Event Button */}
            <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Calendar Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="event-type">Event Type</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value) => setNewEvent({ ...newEvent, type: value as EventType })}
                    >
                      <SelectTrigger id="event-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trade">🟩 Trade</SelectItem>
                        <SelectItem value="journal">🟦 Journal Entry</SelectItem>
                        <SelectItem value="earnings">🟧 Market Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-title">Title</Label>
                    <Input
                      id="event-title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="Event title..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Event details..."
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleAddEvent} className="w-full">
                    Create Event
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Export Button */}
            <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border">
          {/* Day Headers */}
          <div className="grid grid-cols-8 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Weekly"].map((day) => (
              <div
                key={day}
                className={cn(
                  "p-3 text-center text-sm font-semibold border-r last:border-r-0",
                  day === "Weekly" 
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30" 
                    : "text-neutral-600 dark:text-neutral-400"
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Weeks */}
          <div>
            {calendar.map((week, weekIndex) => {
              const weeklySummary = getWeeklySummary(week);
              
              return (
                <div key={weekIndex} className="grid grid-cols-8 border-b last:border-b-0">
                  {week.map((date, dayIndex) => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                    const isToday = date.toDateString() === new Date().toDateString();
                    const events = getEventsForDate(date);
                    const tradeSummary = getTradeSummaryForDate(date);

                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "min-h-[140px] p-2 border-r",
                          !isCurrentMonth && "bg-neutral-50 dark:bg-neutral-950/50"
                        )}
                      >
                        <div
                          className={cn(
                            "text-sm font-medium mb-1",
                            isCurrentMonth
                              ? "text-neutral-900 dark:text-white"
                              : "text-neutral-400 dark:text-neutral-600",
                            isToday && "inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white"
                          )}
                        >
                          {date.getDate()}
                        </div>

                        {/* Trade Summary */}
                        {tradeSummary && isCurrentMonth && (
                          <button
                            onClick={() => {
                              setSelectedDate(date);
                              setIsDayTradesDialogOpen(true);
                            }}
                            className={cn(
                              "w-full mb-2 p-1.5 rounded border transition cursor-pointer",
                              tradeSummary.totalPL >= 0 
                                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 hover:bg-green-100 dark:hover:bg-green-950/30"
                                : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-950/30"
                            )}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-neutral-600 dark:text-neutral-400">
                                {tradeSummary.count} trade{tradeSummary.count !== 1 ? 's' : ''}
                              </span>
                              <span className={cn(
                                "font-bold",
                                tradeSummary.totalPL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                              )}>
                                {tradeSummary.totalPL >= 0 ? '+' : ''}${tradeSummary.totalPL.toLocaleString()}
                              </span>
                            </div>
                            <div className={cn(
                              "text-[10px] font-medium mt-0.5",
                              tradeSummary.totalPL >= 0 ? "text-green-700 dark:text-green-500" : "text-red-700 dark:text-red-500"
                            )}>
                              {tradeSummary.plPercentage >= 0 ? '+' : ''}{tradeSummary.plPercentage.toFixed(2)}% • {tradeSummary.wins}W / {tradeSummary.losses}L
                            </div>
                          </button>
                        )}

                        {/* Non-trade Events Only (Journals & Earnings) */}
                        <div className="space-y-1">
                          {events.filter(e => e.type !== 'trade').slice(0, 3).map((event) => (
                            <EventBadge
                              key={event.id}
                              event={event}
                              onClick={() => {
                                setSelectedEvent(event);
                                setIsEventDialogOpen(true);
                              }}
                            />
                          ))}
                          {events.filter(e => e.type !== 'trade').length > 3 && (
                            <div className="text-xs text-neutral-500 dark:text-neutral-500 pl-1">
                              +{events.filter(e => e.type !== 'trade').length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Weekly Summary Column */}
                  <div className="min-h-[140px] p-3 bg-blue-50 dark:bg-blue-950/20 border-l-2 border-blue-200 dark:border-blue-800">
                    {weeklySummary ? (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-blue-900 dark:text-blue-100">
                          Week {weekIndex + 1}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">Trades:</span>
                            <span className="font-medium text-neutral-900 dark:text-white">
                              {weeklySummary.count}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">Days:</span>
                            <span className="font-medium text-neutral-900 dark:text-white">
                              {weeklySummary.tradingDays}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-600 dark:text-neutral-400">Win Rate:</span>
                            <span className="font-medium text-neutral-900 dark:text-white">
                              {weeklySummary.winRate.toFixed(1)}%
                            </span>
                          </div>

                          <div className="pt-1 border-t border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-neutral-600 dark:text-neutral-400">Total P/L:</span>
                              <span className={cn(
                                "text-sm font-bold",
                                weeklySummary.totalPL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                              )}>
                                {weeklySummary.totalPL >= 0 ? '+' : ''}${weeklySummary.totalPL.toLocaleString()}
                              </span>
                            </div>
                            <div className={cn(
                              "text-[11px] text-right font-medium mt-0.5",
                              weeklySummary.plPercentage >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                            )}>
                              {weeklySummary.plPercentage >= 0 ? '+' : ''}{weeklySummary.plPercentage.toFixed(2)}%
                            </div>
                          </div>

                          <div className="text-[10px] text-neutral-500 dark:text-neutral-500 mt-1">
                            {weeklySummary.wins}W / {weeklySummary.losses}L
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-neutral-400 dark:text-neutral-600 italic">
                        No trades
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Detail Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedEvent && <EventDetails event={selectedEvent} />}
        </DialogContent>
      </Dialog>

      {/* Day Trades Dialog */}
      <Dialog open={isDayTradesDialogOpen} onOpenChange={setIsDayTradesDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedDate && <DayTradesView date={selectedDate} events={getEventsForDate(selectedDate)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Event Badge Component
function EventBadge({ event, onClick }: { event: CalendarEvent; onClick: () => void }) {
  const getBadgeColor = () => {
    switch (event.type) {
      case "trade":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800";
      case "journal":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "earnings":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800";
    }
  };

  const getLabel = () => {
    if (event.type === "trade") {
      return `${event.ticker} ${event.pl >= 0 ? "+" : ""}$${event.pl}`;
    } else if (event.type === "journal") {
      return event.title;
    } else {
      return `${event.ticker} Earnings`;
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-2 py-1 rounded text-xs font-medium border truncate hover:shadow-sm transition",
        getBadgeColor()
      )}
      title={getLabel()}
    >
      {getLabel()}
    </button>
  );
}

// Event Details Component
function EventDetails({ event }: { event: CalendarEvent }) {
  if (event.type === "trade") {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🟩</span>
            Trade: {event.ticker}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-neutral-500 dark:text-neutral-400">Date</Label>
              <p className="text-sm font-medium">{event.date.toLocaleDateString()}</p>
            </div>
            <div>
              <Label className="text-xs text-neutral-500 dark:text-neutral-400">P/L</Label>
              <p className={cn("text-sm font-bold", event.pl >= 0 ? "text-green-600" : "text-red-600")}>
                {event.pl >= 0 ? "+" : ""}${event.pl}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-neutral-500 dark:text-neutral-400">Entry Price</Label>
              <p className="text-sm font-medium">${event.entry.toFixed(2)}</p>
            </div>
            <div>
              <Label className="text-xs text-neutral-500 dark:text-neutral-400">Exit Price</Label>
              <p className="text-sm font-medium">${event.exit.toFixed(2)}</p>
            </div>
          </div>

          {event.notes && (
            <div>
              <Label className="text-xs text-neutral-500 dark:text-neutral-400">Notes</Label>
              <p className="text-sm mt-1 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                {event.notes}
              </p>
            </div>
          )}

          {event.journalId && (
            <Button variant="outline" className="w-full" asChild>
              <a href="/journal">View Related Journal Entry →</a>
            </Button>
          )}
        </div>
      </>
    );
  }

  if (event.type === "journal") {
    return (
      <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🟦</span>
            {event.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label className="text-xs text-neutral-500 dark:text-neutral-400">Date</Label>
            <p className="text-sm font-medium">{event.date.toLocaleDateString()}</p>
          </div>

          <div>
            <Label className="text-xs text-neutral-500 dark:text-neutral-400">Emotion Tags</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {event.emotionTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs text-neutral-500 dark:text-neutral-400">Summary</Label>
            <p className="text-sm mt-1 p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800">
              {event.summary}
            </p>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <a href="/journal">Open Full Journal Entry →</a>
          </Button>
        </div>
      </>
    );
  }

  // Earnings event
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <span className="text-2xl">🟧</span>
          {event.company} Earnings
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-neutral-500 dark:text-neutral-400">Date</Label>
            <p className="text-sm font-medium">{event.date.toLocaleDateString()}</p>
          </div>
          <div>
            <Label className="text-xs text-neutral-500 dark:text-neutral-400">Ticker</Label>
            <p className="text-sm font-medium">{event.ticker}</p>
          </div>
        </div>

        <div>
          <Label className="text-xs text-neutral-500 dark:text-neutral-400">Time</Label>
          <p className="text-sm font-medium">{event.time}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-neutral-500 dark:text-neutral-400">EPS Forecast</Label>
            <p className="text-sm font-medium">${event.epsForecast.toFixed(2)}</p>
          </div>
          {event.epsActual && (
            <div>
              <Label className="text-xs text-neutral-500 dark:text-neutral-400">EPS Actual</Label>
              <p
                className={cn(
                  "text-sm font-bold",
                  event.epsActual >= event.epsForecast ? "text-green-600" : "text-red-600"
                )}
              >
                ${event.epsActual.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Day Trades View Component
function DayTradesView({ date, events }: { date: Date; events: CalendarEvent[] }) {
  const trades = events.filter((e): e is TradeEvent => e.type === "trade");
  const journals = events.filter((e): e is JournalEvent => e.type === "journal");
  const earnings = events.filter((e): e is EarningsEvent => e.type === "earnings");
  
  const totalPL = trades.reduce((sum, trade) => sum + trade.pl, 0);
  const avgEntry = trades.reduce((sum, trade) => sum + trade.entry, 0) / trades.length;
  const plPercentage = (totalPL / (avgEntry * trades.length)) * 100;
  const wins = trades.filter(t => t.pl > 0).length;
  const losses = trades.filter(t => t.pl < 0).length;
  const winRate = (wins / trades.length) * 100;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <span className="text-2xl">📅</span>
          <div>
            <div className="text-xl font-bold">
              {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </div>
            <div className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
              {trades.length} trade{trades.length !== 1 ? 's' : ''} executed
            </div>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 py-4">
        {/* Daily Summary */}
        <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs text-neutral-500 dark:text-neutral-400">Total P/L</Label>
              <p className={cn(
                "text-2xl font-bold",
                totalPL >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString()}
              </p>
              <p className={cn(
                "text-xs font-medium",
                plPercentage >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}>
                {plPercentage >= 0 ? '+' : ''}{plPercentage.toFixed(2)}%
              </p>
            </div>

            <div>
              <Label className="text-xs text-neutral-500 dark:text-neutral-400">Win Rate</Label>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {winRate.toFixed(1)}%
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {wins}W / {losses}L
              </p>
            </div>

            <div>
              <Label className="text-xs text-neutral-500 dark:text-neutral-400">Avg Entry</Label>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                ${avgEntry.toFixed(2)}
              </p>
            </div>

            <div>
              <Label className="text-xs text-neutral-500 dark:text-neutral-400">Best Trade</Label>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                +${Math.max(...trades.map(t => t.pl)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Trades List */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-neutral-900 dark:text-white">Trades</h3>
          <div className="space-y-2">
            {trades.map((trade) => (
              <div
                key={trade.id}
                className="p-4 rounded-lg border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-neutral-900 dark:text-white">
                        {trade.ticker}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 text-xs font-bold rounded",
                        trade.pl >= 0 
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                      )}>
                        {trade.pl >= 0 ? '+' : ''}${trade.pl}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">Entry:</span>
                        <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                          ${trade.entry.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500 dark:text-neutral-400">Exit:</span>
                        <span className="ml-2 font-medium text-neutral-900 dark:text-white">
                          ${trade.exit.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {trade.notes && (
                      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 italic">
                        &ldquo;{trade.notes}&rdquo;
                      </p>
                    )}

                    {trade.journalId && (
                      <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-xs" asChild>
                        <a href="/journal">View related journal entry →</a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Journal Entries (if any) */}
        {journals.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 text-neutral-900 dark:text-white">Journal Entries</h3>
            <div className="space-y-2">
              {journals.map((journal) => (
                <div
                  key={journal.id}
                  className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                >
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                    {journal.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {journal.emotionTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {journal.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earnings Events (if any) */}
        {earnings.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 text-neutral-900 dark:text-white">Market Events</h3>
            <div className="space-y-2">
              {earnings.map((earning) => (
                <div
                  key={earning.id}
                  className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-neutral-900 dark:text-white">
                      {earning.company} ({earning.ticker})
                    </h4>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {earning.time}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">EPS Forecast:</span>
                    <span className="ml-2 font-medium">${earning.epsForecast.toFixed(2)}</span>
                    {earning.epsActual && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-neutral-500 dark:text-neutral-400">Actual:</span>
                        <span className={cn(
                          "ml-2 font-bold",
                          earning.epsActual >= earning.epsForecast ? "text-green-600" : "text-red-600"
                        )}>
                          ${earning.epsActual.toFixed(2)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
