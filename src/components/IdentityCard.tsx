import { useWallet } from "@/hooks/useWallet";
import { useIdentity } from "@/hooks/useIdentity";
import { shortenAddress } from "@/services/blockchain/arc";

export function DemoBadge() {
  return (
    <span className="rounded-full border border-violet/50 px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em] text-violet uppercase">
      Demo
    </span>
  );
}

export function IdentityCard() {
  const { address, wrongNetwork } = useWallet();
  const { identity } = useIdentity();
  const demo = !address;

  const rows: [string, string][] = [
    ["Wallet", address ? shortenAddress(address) : "0x0000...demo"],
    ["Network", "Arc"],
    ["Status", demo ? "Demo mode" : wrongNetwork ? "Wrong network" : "Connected"],
  ];

  return (
    <section className="panel p-6" aria-labelledby="identity-card-title">
      <div className="flex items-center justify-between gap-3">
        <h2
          id="identity-card-title"
          className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase"
        >
          Chainmail Identity
        </h2>
        {demo && <DemoBadge />}
      </div>
      <p className="mt-3 text-2xl font-bold text-gradient">
        @{demo ? "alice" : (identity?.handle ?? "unclaimed")}
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{k}</dt>
            <dd className="mt-1 font-mono text-sm break-all text-foreground">
              {k === "Status" && v === "Connected" ? `✓ ${v}` : v}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
