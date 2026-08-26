import { Github } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { FlowDiagram } from "@/components/FlowDiagram";
import { GITHUB_URL } from "@/services/blockchain/arc";

export function OpenSource() {
  return (
    <section
      id="open-source"
      aria-labelledby="os-title"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
    >
      <Reveal className="panel grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-turquoise uppercase">
            Open Source Proof
          </p>
          <h2 id="os-title" className="mt-3 text-3xl font-bold sm:text-4xl">
            Original Chainmail Repository
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            CHAINMAIL is inspired by an open-source implementation of blockchain-backed email
            authentication. That repository is the conceptual and technical reference — it is not
            the Arc implementation.
          </p>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-cyan/50"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            View GitHub
          </a>
        </div>

        <FlowDiagram
          steps={[
            "Original Chainmail",
            "Blockchain Email Authentication",
            "Modern CHAINMAIL",
            "Arc-focused implementation",
          ]}
        />
      </Reveal>
    </section>
  );
}
