import { AlertTriangle, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { arcConfig } from "@/services/blockchain/arc";

/**
 * Automatic Arc network detection. Renders a one-click switch prompt whenever a
 * connected wallet is on a chain other than Arc.
 */
export function NetworkPrompt() {
  const { address, chainId, wrongNetwork, switchToArc, switchingNetwork } = useWallet();

  if (!address || !arcConfig.configured) return null;

  if (!wrongNetwork) {
    return (
      <p
        role="status"
        className="panel flex flex-wrap items-center justify-between gap-3 border-turquoise/40 px-4 py-3 text-sm text-muted-foreground"
      >
        <span className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-turquoise" aria-hidden="true" />
          Connected to {arcConfig.chainName} (chain {arcConfig.chainId}).
        </span>
        {arcConfig.explorerUrl && (
          <a
            href={arcConfig.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan hover:underline"
          >
            Explorer
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
      </p>
    );
  }

  return (
    <div
      role="alert"
      className="panel flex flex-wrap items-center justify-between gap-4 border-destructive/50 p-4"
    >
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm text-foreground">
          <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
          Wrong network detected{chainId ? ` (chain ${chainId})` : ""}. CHAINMAIL expects{" "}
          <span className="font-semibold">
            {arcConfig.chainName} ({arcConfig.chainId})
          </span>
          .
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          One-click prompt: approve adding {arcConfig.chainName} (RPC {arcConfig.rpcUrl ?? "configured"})
          if your wallet does not already list it.
        </p>
      </div>
      <button
        type="button"
        onClick={() => void switchToArc()}
        disabled={switchingNetwork}
        className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold tracking-wide uppercase text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      >
        {switchingNetwork ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : null}
        {switchingNetwork ? "Switching…" : "Switch to Arc"}
      </button>
    </div>
  );
}
