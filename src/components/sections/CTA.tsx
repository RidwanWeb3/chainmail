import { Link } from "@tanstack/react-router";
import { Github, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { GITHUB_URL } from "@/services/blockchain/arc";

export function CTA() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6">
      <Reveal className="panel relative overflow-hidden p-10 text-center sm:p-16">
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div className="relative">
          <h2 id="cta-title" className="text-4xl font-bold sm:text-5xl">
            Trust Every <span className="text-gradient">Message.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground">
            Communication is evolving. CHAINMAIL adds a verifiable trust layer for the on-chain era.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-cyan/50"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              View GitHub
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
