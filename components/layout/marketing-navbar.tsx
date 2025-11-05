import Link from "next/link";

const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/affiliate", label: "Affiliate" },
];

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Signal
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300 sm:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-neutral-900 dark:hover:text-neutral-100">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
          >
            Start free trial
          </Link>
        </div>
      </div>
    </header>
  );
}
