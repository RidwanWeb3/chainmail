import { Link } from "@tanstack/react-router";
import { Github, ArrowRight } from "lucide-react";
import { GITHUB_URL, contractAddress } from "@/services/blockchain/arc";

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div aria-hidden="true" className="bg-grid absolute inset-0" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20">
        <div className="panel overflow-hidden">
          <img
            src="/assets/chainmail-banner.png"
            alt="CHAINMAIL — Verified Communication for the On-Chain Era"
            width={1280}
            height={427}
            fetchPriority="high"
            className="h-44 w-full object-cover object-left sm:h-auto sm:object-center"
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium tracking-[0.22em] text-cyan uppercase">
              Built on Arc
            </p>
            <h1
              id="hero-title"
              className="mt-5 text-5xl font-bold tracking-[0.12em] sm:text-7xl"
            >
              <span className="text-gradient">CHAINMAIL</span>
            </h1>
            <p className="mt-4 max-w-2xl text-xl font-medium text-foreground sm:text-2xl">
              Verified Communication for the On-Chain Era.
            </p>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              CHAINMAIL brings cryptographic identity and blockchain-backed
              verification to digital communication.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/app"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                Launch App
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-cyan/50"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                View GitHub
              </a>
            </div>

            <dl className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="node-pulse h-2 w-2 rounded-full bg-turquoise" />
                <dt className="sr-only">Network</dt>
                <dd className="text-muted-foreground">Built on Arc</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="text-muted-foreground">CA:</dt>
                <dd className="font-mono text-foreground">
                  {contractAddress ?? "Coming Soon"}
                </dd>
              </div>
              <div className="text-muted-foreground">Powered by @Circle</div>
            </dl>
          </div>

          <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              ["Encrypted Email", "Private content stays off-chain."],
              ["On-Chain Trust", "Verification data anchored on Arc."],
              ["Privacy by Design", "Blockchain for proofs, not payloads."],
            ].map(([title, copy]) => (
              <li key={title} className="panel panel-hover px-5 py-4">
                <h2 className="text-sm font-semibold tracking-[0.14em] text-foreground uppercase">
                  {title}
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
