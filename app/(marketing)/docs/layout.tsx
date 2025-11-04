"use client";

import Link from "next/link";
import { 
  Sparkles, 
  Search,
  BookOpen,
  Rocket,
  MessageSquare,
  Target,
  TrendingUp,
  Bell,
  Code2,
  Settings,
  Home,
  Users,
  Twitter,
  Youtube
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("introduction");

  const sidebarSections = [
    {
      title: "Getting Started",
      items: [
        { id: "introduction", label: "Introduction", icon: Home },
        { id: "quick-start", label: "Quick Start", icon: Rocket },
        { id: "basic-concepts", label: "Basic Concepts", icon: BookOpen },
      ],
    },
    {
      title: "Features",
      items: [
        { id: "ai-chat", label: "AI Chat Interface", icon: MessageSquare },
        { id: "stock-screener", label: "Stock Screener", icon: Search },
        { id: "backtesting", label: "Backtesting", icon: TrendingUp },
        { id: "alerts", label: "Alerts & Notifications", icon: Bell },
      ],
    },
    {
      title: "Advanced",
      items: [
        { id: "api", label: "API Reference", icon: Code2 },
        { id: "integrations", label: "Integrations", icon: Settings },
        { id: "custom-models", label: "Custom AI Models", icon: Target },
      ],
    },
  ];

  // Observe sections for active tracking
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]');
      const scrollPosition = window.scrollY + 150;

      let currentSection = 'introduction';
      sections.forEach((section) => {
        const element = section as HTMLElement;
        const top = element.offsetTop;
        const bottom = top + element.offsetHeight;

        if (scrollPosition >= top && scrollPosition < bottom) {
          currentSection = element.dataset.section || 'introduction';
        }
      });

      setActiveSection(currentSection);
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Also handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveSection(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold">TraderCloud</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/features" className="text-sm text-muted-foreground transition hover:text-foreground">
              Features
            </Link>
            <Link href="/pricing" className="text-sm text-muted-foreground transition hover:text-foreground">
              Pricing
            </Link>
            <Link href="/docs" className="text-sm font-medium text-foreground transition hover:text-foreground">
              Docs
            </Link>
            <Link href="/affiliate" className="text-sm text-muted-foreground transition hover:text-foreground">
              Affiliate
            </Link>
            <Link
              href="/chat"
              className="rounded-lg border-2 border-foreground px-4 py-2 text-sm font-semibold transition hover:bg-foreground hover:text-background"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-20 flex min-h-screen">
        {/* Left Sidebar - Navigation */}
        <aside className="sticky top-20 self-start h-[calc(100vh-5rem)] w-64 shrink-0 overflow-y-auto border-r bg-muted/30 px-4 py-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search docs..."
                className="w-full rounded-lg border bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-foreground"
              />
            </div>
          </div>

          {/* Navigation Sections */}
          <nav className="space-y-6">
            {sidebarSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={() => setActiveSection(item.id)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                          activeSection === item.id
                            ? "bg-foreground text-background font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-12 py-8 max-w-4xl mx-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">TraderCloud</span>
            </Link>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition">
                Terms
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition">
                Privacy
              </Link>
              <p className="text-muted-foreground">
                © 2025 TraderCloud
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="https://twitter.com/TraderCloudAI" className="text-muted-foreground transition hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://youtube.com/@TraderCloudAI" className="text-muted-foreground transition hover:text-foreground">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="https://discord.gg/tradercloud" className="text-muted-foreground transition hover:text-foreground">
                <Users className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
