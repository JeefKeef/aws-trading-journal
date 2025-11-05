"use client";

import { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Rocket,
  Target,
  BarChart3,
  Brain,
  Clock,
  Home,
  Users,
} from "lucide-react";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeSection, setActiveSection] = useState("introduction");

  const sidebarSections = [
    {
      title: "Getting Started",
      items: [
        { id: "introduction", label: "Introduction", icon: Home },
        { id: "quick-start", label: "Quick Start", icon: Rocket },
        { id: "journaling", label: "Journaling", icon: BookOpen },
      ],
    },
    {
      title: "Deep Dive",
      items: [
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "ai-coach", label: "AI Coach", icon: Brain },
        { id: "reviews", label: "Review Cadence", icon: Clock },
      ],
    },
    {
      title: "Team & Next Steps",
      items: [
        { id: "collaboration", label: "Collaboration", icon: Users },
        { id: "next-steps", label: "Next Steps", icon: Target },
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
    <div className="bg-background text-foreground">
      <div className="flex min-h-screen pt-10">
        {/* Left Sidebar - Navigation */}
        <aside className="sticky top-24 h-[calc(100vh-6rem)] w-64 shrink-0 self-start overflow-y-auto border-r bg-muted/30 px-4 py-8 dark:border-neutral-800 dark:bg-neutral-900/40">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search docs..."
                className="w-full rounded-lg border bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-foreground dark:border-neutral-800 dark:bg-neutral-900 dark:text-foreground"
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
                            : "text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-neutral-900"
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
        <main className="mx-auto flex-1 px-12 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
