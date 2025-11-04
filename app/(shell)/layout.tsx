"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  RightPaneProvider,
} from "@/components/layout/right-pane-context";
import { AppSidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";

// Import market page components
import MarketPage from "./market/page";
import ScreenerPage from "./screener/page";
import ChartsPage from "./charts/page";
import GroupsPage from "./groups/page";
import FuturesPage from "./futures/page";
import ForexPage from "./forex/page";
import CryptoPage from "./crypto/page";

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <RightPaneProvider>
      <div className="flex min-h-screen bg-neutral-100 dark:bg-neutral-950">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <TopNav />
          <main className="flex-1 overflow-hidden min-h-0">
            <div className="flex h-full w-full flex-col">
              <div className="hidden h-full w-full md:flex">
                <ResizablePanelGroup direction="horizontal" className="h-full w-full">
                  <ResizablePanel defaultSize={20} minSize={20}>
                    <section className="flex h-full min-h-0 flex-col bg-white dark:bg-neutral-900">
                      {children}
                    </section>
                  </ResizablePanel>
                  <ResizableHandle withHandle className="bg-neutral-200 dark:bg-neutral-800" />
                  <ResizablePanel defaultSize={80} minSize={40}>
                    <RightPane />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </div>

              <div className="flex h-full w-full flex-col md:hidden">
                <section className="flex h-full min-h-0 flex-col border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                  {children}
                </section>
                <RightPane />
              </div>
            </div>
          </main>
        </div>
      </div>
    </RightPaneProvider>
  );
}

function RightPane() {
  const [activeView, setActiveView] = useState("market");
  
  const navItems = [
    { id: "market", label: "Overview" },
    { id: "screener", label: "Screener" },
    { id: "charts", label: "Charts" },
    { id: "groups", label: "Groups" },
    { id: "futures", label: "Futures" },
    { id: "forex", label: "Forex" },
    { id: "crypto", label: "Crypto" },
  ];

  const renderContent = () => {
    switch (activeView) {
      case "market":
        return <MarketPage />;
      case "screener":
        return <ScreenerPage />;
      case "charts":
        return <ChartsPage />;
      case "groups":
        return <GroupsPage />;
      case "futures":
        return <FuturesPage />;
      case "forex":
        return <ForexPage />;
      case "crypto":
        return <CryptoPage />;
      default:
        return <MarketPage />;
    }
  };

  return (
    <aside className="flex h-full min-h-[50vh] flex-col bg-white dark:bg-neutral-900">
      {/* Navigation Bar */}
      <div className="border-b border-neutral-200 bg-white px-4 py-2 dark:border-neutral-800 dark:bg-neutral-900">
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  isActive
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-neutral-50 dark:bg-neutral-950">
        {renderContent()}
      </div>
    </aside>
  );
}
