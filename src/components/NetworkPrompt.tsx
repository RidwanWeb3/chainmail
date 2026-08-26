import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { arcConfig } from "@/services/blockchain/arc";

/**
 * Automatic Arc network detection. Renders a one-click switch prompt whenever a
 * connected wallet is on a chain other than Arc.
 */
export function NetworkPrompt() {
  const { address, chainId, wrongNetwork, switchToArc } = useWallet();

  if (!address || !arcConfig.configured) return null;

  if (!wrongNetwork) {
    return (
      <p
        role="status"
        className="panel flex items-center gap-2 border-turquoise/40 px-4 py-3 text-sm text-muted-foreground"
      >
        <CheckCircle2 className="h-4 w-4 text-turquoise" aria-hidden="true" />
        Connected to Arc (chain {arcConfig.chainId}).
      </p>
    );
  }

  return (
    <div
      role="alert"
      className="panel flex flex-wrap items-center justify-between gap-3 border-destructive/50 p-4"
    >
      <p className="flex items-center gap-2 text-sm text-foreground">
        <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
        Wrong network detected{chainId ? ` (chain ${chainId})` : ""}. CHAINMAIL expects Arc
        chain {arcConfig.chainId}.
      </p>
      <button
        type="button"
        onClick={() => void switchToArc()}
        className="rounded-full px-5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      >
        Switch to Arc
      </button>
    </div>
  );
}
