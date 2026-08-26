import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { IdentityCard } from "@/components/IdentityCard";
import { NetworkPrompt } from "@/components/NetworkPrompt";
import { useWallet } from "@/hooks/useWallet";
import { PGP_STATUS } from "@/services/verification/pgp";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Overview — CHAINMAIL App" },
      {
        name: "description",
        content: "Your Chainmail identity, wallet status and verification overview.",
      },
      { property: "og:title", content: "Overview — CHAINMAIL App" },
      {
        property: "og:description",
        content: "Your Chainmail identity, wallet status and verification overview.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/app" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { address, hasProvider, error } = useWallet();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Trust the sender. Verify the message.
        </p>
      </header>

      <NetworkPrompt />

      {!hasProvider && (
        <p role="status" className="panel border-destructive/40 p-4 text-sm text-muted-foreground">
          Connect a compatible wallet to continue. You can still explore the interface in
          demo mode.
        </p>
      )}
      {error && (
        <p role="alert" className="panel border-destructive/40 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <IdentityCard />

      <section className="panel p-6" aria-labelledby="verification-title">
        <h2
          id="verification-title"
          className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase"
        >
          Verification
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-muted-foreground">Messages Verified</dt>
            <dd className="mt-1 font-mono text-lg">—</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Identity Status</dt>
            <dd className="mt-1 font-mono text-lg">
              {address ? "Connected" : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">PGP</dt>
            <dd className="mt-1 text-sm text-muted-foreground">{PGP_STATUS}</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { to: "/app/compose", title: "Compose", copy: "Sign a message with your wallet." },
          { to: "/app/verify", title: "Verify", copy: "Check a signed message." },
        ].map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="panel panel-hover flex items-center justify-between gap-4 p-6"
          >
            <span>
              <span className="block text-lg font-semibold">{c.title}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{c.copy}</span>
            </span>
            <ArrowRight className="h-5 w-5 text-cyan" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
