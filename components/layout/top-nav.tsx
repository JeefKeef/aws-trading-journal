"use client";

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

export function TopNav() {
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="flex w-full items-center justify-between gap-3 px-3 py-2 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            Signal Copilot
          </span>
          <span className="hidden text-xs text-neutral-500 dark:text-neutral-400 sm:inline">
            Adaptive workspace
          </span>
        </div>

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
    </header>
  );
}
