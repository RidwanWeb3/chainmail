import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { getContractState } from "@/services/blockchain/chainmail";
import { BUY_URL } from "@/services/blockchain/arc";

export function ContractSection() {
  const state = getContractState();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (state.status !== "configured") return;
    try {
      await navigator.clipboard.writeText(state.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section
      id="contract"
      aria-labelledby="contract-title"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="panel p-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-cyan uppercase">
            On-Chain Contract
          </p>
          <h2 id="contract-title" className="mt-3 text-2xl font-bold sm:text-3xl">
            Contract Address
          </h2>

          {state.status === "coming-soon" ? (
            <p className="mt-6 inline-flex rounded-xl border border-border bg-surface/50 px-5 py-3 font-mono text-base text-muted-foreground">
              Coming Soon
            </p>
          ) : (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <code className="rounded-xl border border-border bg-surface/50 px-5 py-3 font-mono text-sm break-all text-foreground">
                {state.address}
              </code>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-cyan/50"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-turquoise" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
              {state.explorerUrl && (
                <a
                  href={state.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-cyan/50"
                >
                  View on Explorer
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </Reveal>

        <Reveal delay={90} className="panel flex flex-col justify-between p-8">
          <div>
            <h2 className="text-2xl font-bold">Get CHAINMAIL</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              CHAINMAIL is available through RadarDEX.
            </p>
          </div>
          <a
            href={BUY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            Buy
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
