import Link from "next/link";
import { Sparkles } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="bg-white dark:bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-100">
              <Sparkles className="h-4 w-4 text-white dark:text-neutral-900" />
            </div>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">Signal</span>
          </div>
          <div className="flex gap-6 text-sm text-neutral-600 dark:text-neutral-400">
            <Link href="/pricing" className="hover:text-neutral-900 transition dark:hover:text-white">Pricing</Link>
            <Link href="/features" className="hover:text-neutral-900 transition dark:hover:text-white">Features</Link>
            <Link href="/docs" className="hover:text-neutral-900 transition dark:hover:text-white">Docs</Link>
            <Link href="/affiliate" className="hover:text-neutral-900 transition dark:hover:text-white">Affiliate</Link>
            <Link href="/terms" className="hover:text-neutral-900 transition dark:hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-neutral-900 transition dark:hover:text-white">Privacy</Link>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            © 2025 Signal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
