import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Check } from "lucide-react";
import { BUY_URL, arcConfig, contractAddress, GITHUB_URL, xUrl } from "@/services/blockchain/arc";
import { getContractState } from "@/services/blockchain/chainmail";
import { PGP_STATUS } from "@/services/verification/pgp";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CHAINMAIL App" },
      {
        name: "description",
        content: "Network configuration, contract status and links for the CHAINMAIL app.",
      },
      { property: "og:title", content: "Settings — CHAINMAIL App" },
      {
        property: "og:description",
        content: "Network configuration, contract status and links for the CHAINMAIL app.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/app/settings" },
    ],
    links: [{ rel: "canonical", href: "/app/settings" }],
  }),
  component: Settings,
});

function Copyable({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(typeof navigator !== "undefined" && Boolean(navigator.clipboard?.writeText));
  }, []);

  const copy = async () => {
    if (!enabled) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <span className="inline-flex items-center gap-2">
      <span className="font-mono text-sm break-all text-foreground" title={label ? `${label}: ${value}` : undefined}>
        {value}
      </span>
      {enabled && (
        <button
          type="button"
          onClick={() => void copy()}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase hover:bg-surface"
          aria-label={copied ? "Copied" : `Copy ${label ?? "value"}`}
        >
          {copied ? (
            <Check className="h-3 w-3 text-turquoise" aria-hidden="true" />
          ) : (
            <Copy className="h-3 w-3" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      )}
    </span>
  );
}

function Settings() {
  const contract = getContractState();
  const configuredCa = contract.status === "configured" ? contract.address : contractAddress;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Network values come from environment configuration. Nothing here is simulated.
        </p>
      </header>

      <section className="panel p-6">
        <dl className="divide-y divide-border">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <dt className="text-sm text-muted-foreground">Network</dt>
            <dd className="font-mono text-sm break-all text-foreground">Arc</dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <dt className="text-sm text-muted-foreground">Chain ID</dt>
            <dd className="font-mono text-sm break-all text-foreground">
              {arcConfig.chainId ? String(arcConfig.chainId) : "Not configured"}
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <dt className="text-sm text-muted-foreground">RPC endpoint</dt>
            <dd className="font-mono text-sm break-all text-foreground">
              {arcConfig.rpcUrl ? <Copyable value={arcConfig.rpcUrl} label="RPC endpoint" /> : "Not configured"}
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <dt className="text-sm text-muted-foreground">Explorer</dt>
            <dd className="font-mono text-sm break-all text-foreground">
              {arcConfig.explorerUrl ? (
                <Copyable value={arcConfig.explorerUrl} label="Explorer URL" />
              ) : (
                "Not configured"
              )}
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <dt className="text-sm text-muted-foreground">Contract</dt>
            <dd>
              {configuredCa ? (
                <Copyable value={configuredCa} label="contract address" />
              ) : (
                <span className="font-mono text-sm break-all text-foreground">Coming Soon</span>
              )}
            </dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <dt className="text-sm text-muted-foreground">PGP encryption</dt>
            <dd className="font-mono text-sm break-all text-foreground">{PGP_STATUS}</dd>
          </div>
        </dl>
      </section>

      <section className="panel p-6">
        <h2 className="text-lg font-semibold">Links</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:underline"
            >
              GitHub
            </a>
          </li>
          {xUrl && (
            <li>
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan hover:underline"
              >
                X
              </a>
            </li>
          )}
          <li>
            <a
              href={BUY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:underline"
            >
              Buy on RadarDex
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
