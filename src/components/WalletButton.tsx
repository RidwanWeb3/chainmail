import { Wallet, LogOut, AlertTriangle } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { shortenAddress } from "@/services/blockchain/arc";
import { cn } from "@/lib/utils";

export function WalletButton({ className }: { className?: string }) {
  const { address, connect, disconnect, connecting, wrongNetwork, switchToArc } = useWallet();

  if (address) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {wrongNetwork && (
          <button
            type="button"
            onClick={switchToArc}
            className="inline-flex items-center gap-1.5 rounded-full border border-destructive/50 px-3 py-1.5 text-xs font-medium text-destructive"
          >
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            Please switch to Arc
          </button>
        )}
        <span className="rounded-full border border-border bg-surface/60 px-3 py-1.5 font-mono text-xs text-foreground">
          {shortenAddress(address)}
        </span>
        <button
          type="button"
          onClick={disconnect}
          aria-label="Disconnect wallet"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={connect}
      disabled={connecting}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60",
        className,
      )}
      style={{ backgroundImage: "var(--gradient-brand)" }}
    >
      <Wallet className="h-4 w-4" aria-hidden="true" />
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
