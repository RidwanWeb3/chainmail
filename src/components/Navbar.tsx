import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Github, ExternalLink } from "lucide-react";
import { BUY_URL, GITHUB_URL } from "@/services/blockchain/arc";

const sections = [
  { label: "About", href: "/#about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Technology", href: "/#technology" },
  { label: "Roadmap", href: "/#roadmap" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors ${
        scrolled
          ? "border-border bg-background/85 backdrop-blur-xl"
          : "border-transparent bg-background/40 backdrop-blur-sm"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6"
      >
        <Link to="/" className="flex items-center gap-2.5" aria-label="CHAINMAIL home">
          <img
            src="/assets/chainmail-logo.png"
            alt="CHAINMAIL"
            width={36}
            height={36}
            className="h-9 w-9"
          />
          <span className="text-lg font-bold tracking-[0.18em] text-foreground">CHAINMAIL</span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {sections.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan/40 px-3.5 py-2 text-sm font-semibold text-cyan transition-colors hover:bg-cyan/10"
          >
            Buy
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <Link
            to="/app"
            className="rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            Launch App
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {sections.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-surface hover:text-foreground"
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={BUY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg px-3 py-3 text-base font-semibold text-cyan"
              >
                Buy
              </a>
            </li>
            <li className="pt-2">
              <Link
                to="/app"
                onClick={() => setOpen(false)}
                className="block rounded-full px-4 py-3 text-center text-base font-semibold text-primary-foreground"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                Launch App
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
