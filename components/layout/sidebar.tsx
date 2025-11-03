"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, MessageSquare, Settings } from "lucide-react";

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

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r border-neutral-200 bg-white/80 backdrop-blur lg:flex lg:w-14 lg:flex-col lg:items-center lg:py-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-neutral-900 text-white shadow-sm">
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
                    "group inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-neutral-500 transition hover:border-neutral-200 hover:text-neutral-900",
                    active &&
                      "border-neutral-900 bg-neutral-900 text-white hover:border-neutral-900 hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-neutral-900 text-white">
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="mt-auto text-[10px] uppercase tracking-[0.3em] text-neutral-400">
        v1.0
      </div>
    </aside>
  );
}
