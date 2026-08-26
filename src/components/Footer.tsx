import { Github } from "lucide-react";
import { BUY_URL, GITHUB_URL, contractAddress, xUrl } from "@/services/blockchain/arc";

const links = [
  { label: "About", href: "/#about" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Technology", href: "/#technology" },
  { label: "Roadmap", href: "/#roadmap" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/70">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/chainmail-logo.png"
              alt="CHAINMAIL"
              width={40}
              height={40}
              className="h-10 w-10"
              loading="lazy"
            />
            <span className="text-lg font-bold tracking-[0.18em]">CHAINMAIL</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Verified Communication for the On-Chain Era.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="rounded-full border border-border px-3 py-1">Built on Arc</span>
            <span className="rounded-full border border-border px-3 py-1">Powered by @Circle</span>
            <span className="rounded-full border border-border px-3 py-1 font-mono">
              CA: {contractAddress ?? "Coming Soon"}
            </span>
          </div>
        </div>

        <nav aria-label="Footer navigation">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Explore
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-muted-foreground hover:text-foreground">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Connect
          </h2>
          <div className="mt-4 flex items-center gap-3">
            {xUrl && (
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CHAINMAIL on X"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <span aria-hidden="true" className="text-base font-semibold">
                  X
                </span>
              </a>
            )}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CHAINMAIL on GitHub"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          {!xUrl && (
            <p className="mt-3 text-xs text-muted-foreground">
              X link appears once <code className="font-mono">VITE_CHAINMAIL_X_URL</code> is
              configured.
            </p>
          )}
          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            Buy
          </a>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} CHAINMAIL. Cryptographic identity and blockchain-backed
          message verification.
        </p>
      </div>
    </footer>
  );
}
