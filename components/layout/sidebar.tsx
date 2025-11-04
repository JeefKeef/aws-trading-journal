"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Bot, MessageSquare, Settings, BookOpen, Plus, MoreHorizontal, TrendingUp } from "lucide-react";
import { useState } from "react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/chat",
    label: "Chat",
    icon: MessageSquare,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

// Mock chat history data
const chatHistory = [
  {
    id: "1",
    title: "Market analysis for tech stocks",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Options strategy discussion",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    title: "Risk assessment framework",
    timestamp: "Yesterday",
  },
  {
    id: "4",
    title: "AWS automation setup",
    timestamp: "Yesterday",
  },
  {
    id: "5",
    title: "Portfolio rebalancing ideas",
    timestamp: "2 days ago",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <>
      <aside className="hidden border-r border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80 lg:flex lg:w-14 lg:flex-col lg:items-center lg:py-5 relative z-40">
        <div
          onMouseEnter={() => setIsHistoryOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-900 text-white shadow-sm cursor-pointer transition-transform hover:scale-110 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <Bot className="h-4 w-4" />
        </div>

        <nav className="mt-6 flex flex-1 flex-col items-center gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href.split('?')[0]);
          
          // If on journal or screener page, add special query param to maintain view
          const isJournalRoute = pathname === "/journal";
          const isScreenerRoute = pathname === "/screener";
          let href = item.href;
          
          if (isJournalRoute) {
            // Coming from journal, maintain journal view with special param
            href = `${item.href}?view=journal`;
          } else if (isScreenerRoute) {
            // Coming from screener, maintain screener view with special param
            href = `${item.href}?view=screener`;
          } else {
            // Preserve existing query parameters for normal navigation
            const params = searchParams.toString();
            href = params ? `${item.href}?${params}` : item.href;
          }
          
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
                  aria-label={item.label}
                  className={cn(
                    "group inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-neutral-500 transition hover:border-neutral-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:text-neutral-100",
                    active &&
                      "border-neutral-900 bg-neutral-900 text-white hover:border-neutral-900 hover:text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:border-neutral-100 dark:hover:text-neutral-900",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="mt-auto text-[10px] uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-600">
        v1.0
      </div>
    </aside>

    {/* Workspace Sidebar - Appears on hover */}
    {isHistoryOpen && (
      <div
        onMouseEnter={() => setIsHistoryOpen(true)}
        onMouseLeave={() => setIsHistoryOpen(false)}
        className="fixed left-14 top-0 z-50 h-screen w-72 border-r border-neutral-200 bg-white shadow-xl animate-in slide-in-from-left duration-200 dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <Link
                href="/chat"
                className="flex items-center gap-2 text-sm font-semibold text-neutral-900 hover:text-neutral-700 transition dark:text-neutral-100 dark:hover:text-neutral-300"
              >
                <MessageSquare className="h-4 w-4" />
                <span>New Chat</span>
              </Link>
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Apps */}
            <div className="border-b border-neutral-200 px-3 py-3 dark:border-neutral-800">
              <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Apps
              </div>
              <div className="space-y-1">
                <Link
                  href="/screener"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Screener</span>
                </Link>
                <Link
                  href="/journal"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-900"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Journal</span>
                </Link>
              </div>
            </div>

            {/* Recent Chats */}
            <div className="px-3 py-3">
              <div className="mb-2 flex items-center justify-between px-2">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Recent Chats
                </div>
                <button className="text-[10px] font-medium text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                  See all
                </button>
              </div>
              <div className="space-y-0.5">
                {chatHistory.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="group block rounded-lg px-3 py-2 text-sm transition hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="flex-1 font-medium text-neutral-900 line-clamp-1 dark:text-neutral-100">
                        {chat.title}
                      </p>
                      <button className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{chat.timestamp}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Signal v1.0</span>
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
