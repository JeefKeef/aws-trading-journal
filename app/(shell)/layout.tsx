"use client";

import { Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Toaster } from "@/components/ui/sonner";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  RightPaneProvider,
} from "@/components/layout/right-pane-context";
import {
  LeftPanelProvider,
  useLeftPanel,
} from "@/components/layout/left-panel-context";
import { ChatHistoryProvider } from "@/lib/contexts/chat-history-context";
import { AppSidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";

// Import page components
import MarketPage from "./market/page";
import ScreenerContent from "./screener/screener-content";
import ChartsPage from "./charts/page";
import GroupsPage from "./groups/page";
import FuturesPage from "./futures/page";
import ForexPage from "./forex/page";
import CryptoPage from "./crypto/page";
import JournalContent from "./journal/journal-content";

// Import left panel components
import ChatPage from "./chat/page";
import SettingsPage from "./settings/page";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChatHistoryProvider>
      <LeftPanelProvider>
        <RightPaneProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <ShellContent>{children}</ShellContent>
          </Suspense>
          <Toaster />
        </RightPaneProvider>
      </LeftPanelProvider>
    </ChatHistoryProvider>
  );
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { mode: leftPanelMode, isVisible } = useLeftPanel();

  // Check if app query param is set for right panel
  const appView = searchParams.get('app');
  
  // Check if we're on a full-page route (dashboard, journal, screener, trades, analytics, calendar)
  const isFullPageRoute = pathname === '/dashboard' || pathname === '/journal' || pathname === '/screener' || pathname === '/trades' || pathname === '/analytics' || pathname === '/calendar';

  // Always show dual-panel layout with left panel (chat/settings) and right panel (page content)
  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-950">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <TopNav />
        <main className="flex-1 overflow-hidden min-h-0">
          <div className="flex h-full w-full flex-col">
            <div className="hidden h-full w-full md:flex">
              <ResizablePanelGroup direction="horizontal" className="h-full w-full">
                {/* Left Panel - Toggle between Chat and Settings */}
                {isVisible && (
                  <>
                    <ResizablePanel defaultSize={15} minSize={15} maxSize={30}>
                      <div className="h-full overflow-auto">
                        <LeftPanelContent mode={leftPanelMode} />
                      </div>
                    </ResizablePanel>
                    <ResizableHandle className="bg-neutral-200 dark:bg-neutral-800" />
                  </>
                )}
                {/* Right Panel - Shows page content for full-page routes, or dynamic content for others */}
                <ResizablePanel defaultSize={isVisible ? 85 : 100} minSize={50}>
                  <div className="h-full overflow-auto">
                    {isFullPageRoute ? children : <RightPane appView={appView} />}
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>

            {/* Mobile layout */}
            <div className="flex h-full w-full flex-col md:hidden">
              {isVisible && (
                <section className="flex h-full min-h-0 flex-col border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                  <LeftPanelContent mode={leftPanelMode} />
                </section>
              )}
              {isFullPageRoute ? children : <RightPane appView={appView} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Left panel content renderer - toggles between Chat and Settings
function LeftPanelContent({ mode }: { mode: "chat" | "settings" | null }) {
  if (!mode) return null;
  
  switch (mode) {
    case "chat":
      return <ChatPage />;
    case "settings":
      return <SettingsPage />;
    default:
      return <ChatPage />;
  }
}

// Right panel content renderer - shows apps or market tabs
function RightPane({ appView }: { appView: string | null }) {
  const searchParams = useSearchParams();
  
  // If specific app is selected, show it
  if (appView === 'journal') {
    return <JournalContent />;
  }
  
  // Default to screener if no app is specified
  if (!appView || appView === 'screener') {
    return <ScreenerContent />;
  }
  
  // Market view with tabs (only if explicitly requested)
  const view = searchParams.get('view') || 'market';
  
  const navItems = [
    { id: "market", label: "Overview" },
    { id: "charts", label: "Charts" },
    { id: "groups", label: "Groups" },
    { id: "futures", label: "Futures" },
    { id: "forex", label: "Forex" },
    { id: "crypto", label: "Crypto" },
  ];

  const renderContent = () => {
    switch (view) {
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
      case "market":
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
            const isActive = view === item.id;
            // Preserve existing search params and add/update view
            const params = new URLSearchParams(searchParams.toString());
            if (item.id !== 'market') {
              params.set('view', item.id);
            } else {
              params.delete('view');
            }
            const href = params.toString() ? `?${params.toString()}` : '?';
            
            return (
              <Link
                key={item.id}
                href={href}
                scroll={false}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  isActive
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                }`}
              >
                {item.label}
              </Link>
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
