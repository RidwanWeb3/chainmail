import { createFileRoute } from "@tanstack/react-router";
import { arcConfig, GITHUB_URL, X_URL } from "@/services/blockchain/arc";
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

function Settings() {
  const contract = getContractState();

  const rows: [string, string][] = [
    ["Network", arcConfig.chainName || "Arc"],
    ["Chain ID", arcConfig.chainId ? String(arcConfig.chainId) : "Not configured"],
    ["RPC endpoint", arcConfig.rpcUrl ? "Configured" : "Not configured"],
    ["Explorer", arcConfig.explorerUrl || "Not configured"],
    ["Contract", contract.status === "configured" ? contract.address : "Coming Soon"],
    ["PGP encryption", PGP_STATUS],
  ];

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
          {rows.map(([k, v]) => (
            <div key={k} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <dt className="text-sm text-muted-foreground">{k}</dt>
              <dd className="font-mono text-sm break-all text-foreground">{v}</dd>
            </div>
          ))}
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
          <li>
            <a
              href={X_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan hover:underline"
            >
              X
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
