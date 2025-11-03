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

export function TopNav() {
  return (
    <header className="border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="flex w-full items-center justify-between gap-3 px-3 py-2 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900">
            Signal Copilot
          </span>
          <span className="hidden text-xs text-neutral-500 sm:inline">
            Adaptive workspace
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="rounded-full border border-neutral-200 bg-white p-0.5 transition hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400/50"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage alt="Operator avatar" />
                <AvatarFallback className="text-xs font-semibold text-neutral-600">
                  SC
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuLabel>Signed in as</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-500 focus:text-rose-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
