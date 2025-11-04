"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Search,
  X,
  Plus,
  Filter,
  Download,
  Trash2,
  Edit2,
  Check,
  MoreHorizontal,
  ArrowUpDown,
  GripVertical,
  Calendar,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Trade = {
  id: string;
  date: string;
  ticker: string;
  type: "LONG" | "SHORT";
  entry: number;
  exit: number;
  shares: number;
  pl: number;
  plPercent: number;
  strategy: string;
  notes: string;
  status: "WIN" | "LOSS" | "BREAKEVEN";
};

type FilterCategory = {
  name: string;
  options: string[];
};

const filters: FilterCategory[] = [
  { name: "Status", options: ["Any", "WIN", "LOSS", "BREAKEVEN"] },
  { name: "Type", options: ["Any", "LONG", "SHORT"] },
  {
    name: "P/L Range",
    options: [
      "Any",
      "Over $1000",
      "Over $500",
      "Over $100",
      "$0 to $100",
      "-$100 to $0",
      "Under -$100",
      "Under -$500",
      "Under -$1000",
    ],
  },
  {
    name: "Date Range",
    options: [
      "Any",
      "Today",
      "Yesterday",
      "This Week",
      "Last Week",
      "This Month",
      "Last Month",
      "This Year",
    ],
  },
  {
    name: "Strategy",
    options: [
      "Any",
      "Breakout",
      "Reversal",
      "Momentum",
      "Support/Resistance",
      "Gap Fill",
      "Earnings Play",
      "Other",
    ],
  },
];

// Mock initial trades data
const initialTrades: Trade[] = [
  {
    id: "1",
    date: "2025-11-04",
    ticker: "AAPL",
    type: "LONG",
    entry: 175.5,
    exit: 182.3,
    shares: 100,
    pl: 680,
    plPercent: 3.87,
    strategy: "Breakout",
    notes: "Clean breakout above resistance with strong volume",
    status: "WIN",
  },
  {
    id: "2",
    date: "2025-11-03",
    ticker: "TSLA",
    type: "SHORT",
    entry: 255.2,
    exit: 248.9,
    shares: 50,
    pl: 315,
    plPercent: 2.47,
    strategy: "Reversal",
    notes: "Overbought on RSI, showing weakness",
    status: "WIN",
  },
  {
    id: "3",
    date: "2025-11-02",
    ticker: "NVDA",
    type: "LONG",
    entry: 850.0,
    exit: 842.5,
    shares: 25,
    pl: -187.5,
    plPercent: -0.88,
    strategy: "Support/Resistance",
    notes: "Failed support bounce, cut loss quickly",
    status: "LOSS",
  },
  {
    id: "4",
    date: "2025-11-01",
    ticker: "MSFT",
    type: "LONG",
    entry: 420.15,
    exit: 428.8,
    shares: 75,
    pl: 648.75,
    plPercent: 2.06,
    strategy: "Momentum",
    notes: "Strong earnings momentum continuation",
    status: "WIN",
  },
  {
    id: "5",
    date: "2025-10-31",
    ticker: "GOOGL",
    type: "LONG",
    entry: 138.5,
    exit: 141.9,
    shares: 150,
    pl: 510,
    plPercent: 2.45,
    strategy: "Gap Fill",
    notes: "Gap up on news, rode momentum",
    status: "WIN",
  },
  {
    id: "6",
    date: "2025-10-30",
    ticker: "META",
    type: "SHORT",
    entry: 475.0,
    exit: 485.3,
    shares: 30,
    pl: -309,
    plPercent: -2.17,
    strategy: "Reversal",
    notes: "Reversal didn't materialize, stopped out",
    status: "LOSS",
  },
  {
    id: "7",
    date: "2025-10-29",
    ticker: "AMZN",
    type: "LONG",
    entry: 172.8,
    exit: 178.3,
    shares: 100,
    pl: 550,
    plPercent: 3.18,
    strategy: "Earnings Play",
    notes: "Post-earnings gap and run",
    status: "WIN",
  },
  {
    id: "8",
    date: "2025-10-28",
    ticker: "SPY",
    type: "LONG",
    entry: 452.5,
    exit: 451.2,
    shares: 200,
    pl: -260,
    plPercent: -0.29,
    strategy: "Momentum",
    notes: "Market pullback, small loss",
    status: "LOSS",
  },
  {
    id: "9",
    date: "2025-10-27",
    ticker: "QQQ",
    type: "LONG",
    entry: 385.2,
    exit: 391.8,
    shares: 150,
    pl: 990,
    plPercent: 1.71,
    strategy: "Breakout",
    notes: "Tech sector strength, clean trade",
    status: "WIN",
  },
  {
    id: "10",
    date: "2025-10-26",
    ticker: "AMD",
    type: "LONG",
    entry: 128.5,
    exit: 128.5,
    shares: 80,
    pl: 0,
    plPercent: 0,
    strategy: "Support/Resistance",
    notes: "Exited at entry, no clear direction",
    status: "BREAKEVEN",
  },
];

type SortConfig = {
  key: keyof Trade | null;
  direction: "asc" | "desc";
};

type ColumnConfig = {
  id: string;
  label: string;
  key: keyof Trade;
  visible: boolean;
  width?: string;
  align?: "left" | "center" | "right";
};

const defaultColumns: ColumnConfig[] = [
  { id: "date", label: "Date", key: "date", visible: true, align: "left" },
  { id: "ticker", label: "Ticker", key: "ticker", visible: true, align: "left" },
  { id: "type", label: "Type", key: "type", visible: true, align: "center" },
  { id: "entry", label: "Entry", key: "entry", visible: true, align: "right" },
  { id: "exit", label: "Exit", key: "exit", visible: true, align: "right" },
  { id: "shares", label: "Shares", key: "shares", visible: true, align: "right" },
  { id: "pl", label: "P/L ($)", key: "pl", visible: true, align: "right" },
  { id: "plPercent", label: "P/L %", key: "plPercent", visible: true, align: "right" },
  { id: "strategy", label: "Strategy", key: "strategy", visible: true, align: "left" },
  { id: "notes", label: "Notes", key: "notes", visible: true, align: "left" },
];

function DraggableColumnHeader({ column, onSort, sortConfig }: { 
  column: ColumnConfig; 
  onSort: (key: keyof Trade) => void;
  sortConfig: SortConfig;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSorted = sortConfig.key === column.key;

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 group relative",
        column.align === "right" && "text-right",
        column.align === "center" && "text-center"
      )}
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded p-1 transition-colors"
        >
          <GripVertical className="h-3 w-3 text-neutral-400" />
        </button>
        <button
          onClick={() => onSort(column.key)}
          className={cn(
            "flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition",
            column.align === "right" && "flex-row-reverse",
            column.align === "center" && "justify-center"
          )}
        >
          {column.label}
          {isSorted && (
            <span className={cn(
              "transition-transform",
              sortConfig.direction === "desc" && "rotate-180"
            )}>
              <ArrowUpDown className="h-3 w-3" />
            </span>
          )}
        </button>
      </div>
    </TableHead>
  );
}

export default function TradesPage() {
  const searchParams = useSearchParams();

  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [selectedTrades, setSelectedTrades] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "date", direction: "desc" });
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Trade } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showNewTradeDialog, setShowNewTradeDialog] = useState(false);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Fix hydration mismatch by mounting after client render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSort = (key: keyof Trade) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedColumn(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedColumn(null);

    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);

        return newItems;
      });
    }
  };

  const filteredAndSortedTrades = useMemo(() => {
    let result = [...trades];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (trade) =>
          trade.ticker.toLowerCase().includes(query) ||
          trade.strategy.toLowerCase().includes(query) ||
          trade.notes.toLowerCase().includes(query)
      );
    }

    // Apply filters
    Object.entries(selectedFilters).forEach(([filterName, filterValue]) => {
      if (!filterValue || filterValue === "Any") return;

      switch (filterName) {
        case "Status":
          result = result.filter((trade) => trade.status === filterValue);
          break;
        case "Type":
          result = result.filter((trade) => trade.type === filterValue);
          break;
        case "Strategy":
          result = result.filter((trade) => trade.strategy === filterValue);
          break;
        case "P/L Range":
          if (filterValue === "Over $1000") result = result.filter((t) => t.pl > 1000);
          else if (filterValue === "Over $500") result = result.filter((t) => t.pl > 500);
          else if (filterValue === "Over $100") result = result.filter((t) => t.pl > 100);
          else if (filterValue === "$0 to $100")
            result = result.filter((t) => t.pl >= 0 && t.pl <= 100);
          else if (filterValue === "-$100 to $0")
            result = result.filter((t) => t.pl < 0 && t.pl >= -100);
          else if (filterValue === "Under -$100") result = result.filter((t) => t.pl < -100);
          else if (filterValue === "Under -$500") result = result.filter((t) => t.pl < -500);
          else if (filterValue === "Under -$1000") result = result.filter((t) => t.pl < -1000);
          break;
      }
    });

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal);
        const bStr = String(bVal);
        return sortConfig.direction === "asc"
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [trades, searchQuery, selectedFilters, sortConfig]);

  const toggleFilter = (category: string, option: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category] === option ? "Any" : option,
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSearchQuery("");
  };

  const toggleSelectAll = () => {
    if (selectedTrades.size === filteredAndSortedTrades.length) {
      setSelectedTrades(new Set());
    } else {
      setSelectedTrades(new Set(filteredAndSortedTrades.map((t) => t.id)));
    }
  };

  const toggleSelectTrade = (id: string) => {
    setSelectedTrades((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    setTrades((prev) => prev.filter((t) => !selectedTrades.has(t.id)));
    toast.success(`Deleted ${selectedTrades.size} trade(s)`, {
      description: "Selected trades have been removed from your journal.",
    });
    setSelectedTrades(new Set());
    setShowDeleteDialog(false);
  };

  const handleCellDoubleClick = (trade: Trade, field: keyof Trade) => {
    setEditingCell({ id: trade.id, field });
    setEditValue(String(trade[field]));
  };

  const handleCellEditSave = () => {
    if (!editingCell) return;

    setTrades((prev) =>
      prev.map((trade) => {
        if (trade.id === editingCell.id) {
          const field = editingCell.field;
          let parsedValue: string | number = editValue;

          // Parse numeric fields
          if (["entry", "exit", "shares", "pl", "plPercent"].includes(field)) {
            parsedValue = parseFloat(editValue) || 0;
          }

          return { ...trade, [field]: parsedValue };
        }
        return trade;
      })
    );

    toast.success("Trade updated", {
      description: `${editingCell.field} has been updated successfully.`,
    });

    setEditingCell(null);
    setEditValue("");
  };

  const handleCellEditCancel = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const activeFilterCount = Object.values(selectedFilters).filter(
    (v) => v && v !== "Any"
  ).length;

  const visibleColumns = columns.filter((col) => col.visible);

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalTrades = filteredAndSortedTrades.length;
    const wins = filteredAndSortedTrades.filter((t) => t.status === "WIN").length;
    const losses = filteredAndSortedTrades.filter((t) => t.status === "LOSS").length;
    const totalPL = filteredAndSortedTrades.reduce((sum, t) => sum + t.pl, 0);
    const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
    const avgWin = wins > 0
      ? filteredAndSortedTrades.filter((t) => t.status === "WIN").reduce((sum, t) => sum + t.pl, 0) / wins
      : 0;
    const avgLoss = losses > 0
      ? filteredAndSortedTrades.filter((t) => t.status === "LOSS").reduce((sum, t) => sum + t.pl, 0) / losses
      : 0;

    return { totalTrades, wins, losses, totalPL, winRate, avgWin, avgLoss };
  }, [filteredAndSortedTrades]);

  return (
    <div className="flex flex-col h-full bg-neutral-50 overflow-hidden dark:bg-neutral-950">
      {/* Header with Stats */}
      <div className="bg-white border-b border-neutral-200 shrink-0 dark:bg-neutral-900 dark:border-neutral-800">
        {/* Stats Bar */}
        <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <div className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium mb-0.5">
              Total Trades
            </div>
            <div className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              {stats.totalTrades}
            </div>
          </div>
          <div className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium mb-0.5">
              Wins
            </div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {stats.wins}
            </div>
          </div>
          <div className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium mb-0.5">
              Losses
            </div>
            <div className="text-base font-bold text-rose-600 dark:text-rose-400">
              {stats.losses}
            </div>
          </div>
          <div className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium mb-0.5">
              Win Rate
            </div>
            <div className={cn(
              "text-base font-bold",
              stats.winRate >= 50 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            )}>
              {stats.winRate.toFixed(1)}%
            </div>
          </div>
          <div className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium mb-0.5">
              Total P/L
            </div>
            <div
              className={cn(
                "text-base font-bold",
                stats.totalPL >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
              )}
            >
              ${stats.totalPL.toFixed(2)}
            </div>
          </div>
          <div className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium mb-0.5">
              Avg Win
            </div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              ${stats.avgWin.toFixed(2)}
            </div>
          </div>
          <div className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium mb-0.5">
              Avg Loss
            </div>
            <div className="text-base font-bold text-rose-600 dark:text-rose-400">
              ${stats.avgLoss.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Search and Actions Bar */}
        <div className="px-4 py-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by ticker, strategy, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:border-transparent"
            />
          </div>

          {selectedTrades.size > 0 && (
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete ({selectedTrades.size})
            </button>
          )}

          <button
            onClick={() => setShowColumnSettings(!showColumnSettings)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-100 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
          >
            <Filter className="h-3.5 w-3.5" />
            Columns
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
            >
              <X className="h-3.5 w-3.5" />
              Clear All ({activeFilterCount})
            </button>
          )}

          <button
            onClick={() => setShowNewTradeDialog(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            New Trade
          </button>

          <button className="px-3 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-100 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition">
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Filters Accordion */}
        <Accordion type="single" collapsible className="border-t border-neutral-200 dark:border-neutral-800">
          <AccordionItem value="filters" className="border-none">
            <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline hover:bg-neutral-50 dark:hover:bg-neutral-900/50">
              Advanced Filters
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 py-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {filters.map((filter) => (
                  <FilterDropdown
                    key={filter.name}
                    filter={filter}
                    selectedValue={selectedFilters[filter.name]}
                    onSelect={(option) => toggleFilter(filter.name, option)}
                  />
                ))}
              </div>

              {activeFilterCount > 0 && (
                <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      Active filters:
                    </span>
                    {Object.entries(selectedFilters).map(([category, value]) => {
                      if (!value || value === "Any") return null;
                      return (
                        <button
                          key={category}
                          onClick={() => toggleFilter(category, value)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition"
                        >
                          {category}: {value}
                          <X className="h-3 w-3" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Column Settings Dropdown */}
      {showColumnSettings && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowColumnSettings(false)} />
          <div className="absolute right-4 top-48 z-50 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-xl overflow-hidden">
            <div className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-100">
                Visible Columns
              </span>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {columns.map((col) => (
                <div
                  key={col.id}
                  className="flex items-center gap-2 px-2 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded transition"
                >
                  <Checkbox
                    checked={col.visible}
                    onCheckedChange={(checked) => {
                      setColumns((prev) =>
                        prev.map((c) =>
                          c.id === col.id ? { ...c, visible: !!checked } : c
                        )
                      );
                    }}
                  />
                  <span className="text-xs text-neutral-700 dark:text-neutral-300">
                    {col.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Trades Table */}
      <div className="flex-1 min-h-0 relative">
        <div className="absolute inset-0 overflow-auto">
          {!isMounted ? (
            <Table>
              <TableHeader className="sticky top-0 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-10">
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredAndSortedTrades.length > 0 &&
                        selectedTrades.size === filteredAndSortedTrades.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  {visibleColumns.map((col) => (
                    <TableHead
                      key={col.id}
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center"
                      )}
                    >
                      {col.label}
                    </TableHead>
                  ))}
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-black">
                {filteredAndSortedTrades.map((trade) => (
                  <TradeRow
                    key={trade.id}
                    trade={trade}
                    isSelected={selectedTrades.has(trade.id)}
                    onToggleSelect={() => toggleSelectTrade(trade.id)}
                    onCellDoubleClick={handleCellDoubleClick}
                    editingCell={editingCell}
                    editValue={editValue}
                    onEditValueChange={setEditValue}
                    onEditSave={handleCellEditSave}
                    onEditCancel={handleCellEditCancel}
                    visibleColumns={visibleColumns}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <Table>
                <TableHeader className="sticky top-0 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 z-10">
                  <TableRow>
                    <TableHead className="w-12 bg-neutral-100 dark:bg-neutral-900">
                      <Checkbox
                        checked={
                          filteredAndSortedTrades.length > 0 &&
                          selectedTrades.size === filteredAndSortedTrades.length
                        }
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <SortableContext
                      items={visibleColumns.map((c) => c.id)}
                      strategy={horizontalListSortingStrategy}
                    >
                      {visibleColumns.map((col) => (
                        <DraggableColumnHeader
                          key={col.id}
                          column={col}
                          onSort={handleSort}
                          sortConfig={sortConfig}
                        />
                      ))}
                    </SortableContext>
                    <TableHead className="w-12 bg-neutral-100 dark:bg-neutral-900"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white dark:bg-black">
                  {filteredAndSortedTrades.map((trade) => (
                    <TradeRow
                      key={trade.id}
                      trade={trade}
                      isSelected={selectedTrades.has(trade.id)}
                      onToggleSelect={() => toggleSelectTrade(trade.id)}
                      onCellDoubleClick={handleCellDoubleClick}
                      editingCell={editingCell}
                      editValue={editValue}
                      onEditValueChange={setEditValue}
                      onEditSave={handleCellEditSave}
                      onEditCancel={handleCellEditCancel}
                      visibleColumns={visibleColumns}
                    />
                  ))}
                </TableBody>
              </Table>
              <DragOverlay>
                {draggedColumn ? (
                  <div className="bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-900 dark:border-neutral-100 rounded px-3 py-2 shadow-lg">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {columns.find((c) => c.id === draggedColumn)?.label}
                    </span>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>

      {/* Results Footer */}
      <div className="border-t border-neutral-200 bg-white px-4 py-3 shrink-0 dark:bg-neutral-900 dark:border-neutral-800">
        <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
          <span>
            Showing {filteredAndSortedTrades.length} trade(s)
            {selectedTrades.size > 0 && ` · ${selectedTrades.size} selected`}
          </span>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Trades?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTrades.size} trade(s)? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSelected}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Trade Dialog */}
      <Dialog open={showNewTradeDialog} onOpenChange={setShowNewTradeDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Trade</DialogTitle>
            <DialogDescription>
              Enter the details of your trade. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ticker">Ticker</Label>
                <Input id="ticker" placeholder="AAPL" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  className="flex h-10 w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
                >
                  <option value="LONG">LONG</option>
                  <option value="SHORT">SHORT</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="shares">Shares</Label>
                <Input id="shares" type="number" placeholder="100" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="entry">Entry Price</Label>
                <Input id="entry" type="number" step="0.01" placeholder="150.00" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exit">Exit Price</Label>
                <Input id="exit" type="number" step="0.01" placeholder="155.00" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="strategy">Strategy</Label>
              <select
                id="strategy"
                className="flex h-10 w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
              >
                <option value="Breakout">Breakout</option>
                <option value="Reversal">Reversal</option>
                <option value="Momentum">Momentum</option>
                <option value="Support/Resistance">Support/Resistance</option>
                <option value="Gap Fill">Gap Fill</option>
                <option value="Earnings Play">Earnings Play</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                className="flex min-h-20 w-full rounded-md border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
                placeholder="Trade notes and observations..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTradeDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Trade added", {
                  description: "New trade has been added to your journal.",
                });
                setShowNewTradeDialog(false);
              }}
            >
              Add Trade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TradeRow({
  trade,
  isSelected,
  onToggleSelect,
  onCellDoubleClick,
  editingCell,
  editValue,
  onEditValueChange,
  onEditSave,
  onEditCancel,
  visibleColumns,
}: {
  trade: Trade;
  isSelected: boolean;
  onToggleSelect: () => void;
  onCellDoubleClick: (trade: Trade, field: keyof Trade) => void;
  editingCell: { id: string; field: keyof Trade } | null;
  editValue: string;
  onEditValueChange: (value: string) => void;
  onEditSave: () => void;
  onEditCancel: () => void;
  visibleColumns: ColumnConfig[];
}) {
  const isEditing = (field: keyof Trade) =>
    editingCell?.id === trade.id && editingCell?.field === field;

  const getCellValue = (field: keyof Trade) => {
    const value = trade[field];
    switch (field) {
      case "entry":
      case "exit":
        return `$${(value as number).toFixed(2)}`;
      case "pl":
        return `$${(value as number).toFixed(2)}`;
      case "plPercent":
        return `${(value as number) >= 0 ? "+" : ""}${(value as number).toFixed(2)}%`;
      default:
        return String(value);
    }
  };

  return (
    <TableRow className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition group">
      <TableCell className="w-12">
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </TableCell>
      {visibleColumns.map((col) => {
        const field = col.key;
        const editing = isEditing(field);

        return (
          <TableCell
            key={col.id}
            className={cn(
              "px-4 py-3 text-xs relative",
              col.align === "right" && "text-right",
              col.align === "center" && "text-center"
            )}
            onDoubleClick={() => !editing && onCellDoubleClick(trade, field)}
          >
            {editing ? (
              <div className="flex items-center gap-1">
                <Input
                  value={editValue}
                  onChange={(e) => onEditValueChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onEditSave();
                    if (e.key === "Escape") onEditCancel();
                  }}
                  className="h-7 text-xs"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={onEditSave}
                >
                  <Check className="h-3 w-3 text-emerald-600" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={onEditCancel}
                >
                  <X className="h-3 w-3 text-rose-600" />
                </Button>
              </div>
            ) : (
              <span
                className={cn(
                  "cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 px-1 py-0.5 rounded transition",
                  field === "type" && trade.type === "LONG" && "text-emerald-600 font-semibold",
                  field === "type" && trade.type === "SHORT" && "text-rose-600 font-semibold",
                  field === "pl" &&
                    (trade.pl > 0
                      ? "text-emerald-600 font-bold"
                      : trade.pl < 0
                      ? "text-rose-600 font-bold"
                      : "text-neutral-600"),
                  field === "plPercent" &&
                    (trade.plPercent > 0
                      ? "text-emerald-600 font-bold"
                      : trade.plPercent < 0
                      ? "text-rose-600 font-bold"
                      : "text-neutral-600"),
                  field === "ticker" && "font-bold text-neutral-900 dark:text-neutral-100"
                )}
              >
                {getCellValue(field)}
              </span>
            )}
          </TableCell>
        );
      })}
      <TableCell className="w-12">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit2 className="h-3 w-3 mr-2" />
              Quick Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="h-3 w-3 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600 focus:text-rose-600">
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

function FilterDropdown({
  filter,
  selectedValue,
  onSelect,
}: {
  filter: FilterCategory;
  selectedValue?: string;
  onSelect: (option: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const displayValue = selectedValue && selectedValue !== "Any" ? selectedValue : filter.name;

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setButtonRect(rect);
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={handleButtonClick}
          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border transition ${
            selectedValue && selectedValue !== "Any"
              ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-neutral-900 dark:border-neutral-100"
              : "bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-100 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
          }`}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 ml-1 shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isOpen && buttonRect && (
        <>
          <div className="fixed inset-0 z-100" onClick={() => setIsOpen(false)} />
          <div
            className="fixed min-w-[200px] max-h-60 overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-100"
            style={{
              top: `${buttonRect.bottom + 4}px`,
              left: `${buttonRect.left}px`,
              width: `${buttonRect.width}px`,
            }}
          >
            {filter.options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-neutral-50 dark:hover:bg-neutral-800 transition ${
                  selectedValue === option
                    ? "bg-neutral-100 dark:bg-neutral-800 font-semibold"
                    : ""
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
