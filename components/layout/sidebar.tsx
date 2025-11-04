"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, MessageSquare, Settings, Clock } from "lucide-react";
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
          const active = pathname.startsWith(item.href);
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
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

    {/* Chat History Sidebar - Appears on hover */}
    {isHistoryOpen && (
      <div
        onMouseEnter={() => setIsHistoryOpen(true)}
        onMouseLeave={() => setIsHistoryOpen(false)}
        className="fixed left-14 top-0 z-50 h-screen w-64 border-r border-neutral-200 bg-white shadow-xl animate-in slide-in-from-left duration-200 dark:border-neutral-800 dark:bg-neutral-950"
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-neutral-200 px-4 py-5 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Chat History</h2>
            </div>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Recent conversations</p>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            <div className="space-y-1">
              {chatHistory.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/chat/${chat.id}`}
                  className="block rounded-lg px-3 py-2.5 text-sm transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  <p className="font-medium text-neutral-900 line-clamp-2 dark:text-neutral-100">
                    {chat.title}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{chat.timestamp}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <Link
              href="/chat"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              New Chat
            </Link>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
