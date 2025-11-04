"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Bell, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Notification = {
  id: string;
  type: "price" | "news";
  title: string;
  description: string;
  timestamp: string;
};

export function TopNav() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "price",
      title: "BTC/USD crossed $67,500",
      description: "Your target price has been reached",
      timestamp: "2 min ago",
    },
    {
      id: "2",
      type: "news",
      title: "Fed announces interest rate decision",
      description: "Breaking news may impact your positions",
      timestamp: "15 min ago",
    },
    {
      id: "3",
      type: "price",
      title: "AAPL fell below $175",
      description: "Stop-loss threshold approaching",
      timestamp: "1 hour ago",
    },
  ]);

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="flex w-full items-center justify-between gap-3 px-3 py-2 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Signal
          </span>
          <span className="hidden text-xs text-neutral-500 dark:text-neutral-400 sm:inline">
            Adaptive workspace
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="relative rounded-full p-2 transition hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-400/50 dark:hover:bg-neutral-800"
              >
                <Bell className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                {notifications.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-semibold text-white dark:border-neutral-950">
                    {notifications.length}
                  </Badge>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
              <div className="flex items-center justify-between px-2 py-1.5">
                <DropdownMenuLabel className="p-0 text-sm font-semibold">
                  Notifications
                </DropdownMenuLabel>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-2 py-1 text-xs text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                    onClick={(e) => {
                      e.preventDefault();
                      clearAllNotifications();
                    }}
                  >
                    Clear all
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                  No notifications
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div key={notification.id}>
                    {index > 0 && <DropdownMenuSeparator />}
                    <DropdownMenuItem className="group relative flex flex-col items-start gap-1 py-3 pr-8">
                      <button
                        className="absolute right-2 top-3 rounded-sm p-1 opacity-0 transition hover:bg-neutral-100 group-hover:opacity-100 dark:hover:bg-neutral-800"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <X className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
                      </button>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            notification.type === "price"
                              ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                          }
                        >
                          {notification.type === "price" ? "Price Alert" : "News Alert"}
                        </Badge>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {notification.timestamp}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {notification.description}
                      </p>
                    </DropdownMenuItem>
                  </div>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full border border-neutral-200 bg-white p-0.5 transition hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400/50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage alt="Operator avatar" />
                  <AvatarFallback className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                    SC
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
              <DropdownMenuLabel className="text-xs font-normal text-neutral-500 dark:text-neutral-400">
                Signed in as
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <ThemeToggle />
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-rose-500 focus:text-rose-600 dark:text-rose-400 dark:focus:text-rose-300">
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
