import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useWallet } from "@/hooks/useWallet";
import { useIdentity } from "@/hooks/useIdentity";
import { IdentityCard } from "@/components/IdentityCard";

export const Route = createFileRoute("/app/identity")({
  head: () => ({
    meta: [
      { title: "Identity — CHAINMAIL App" },
      {
        name: "description",
        content: "Establish your Chainmail @handle and link it to your wallet address.",
      },
      { property: "og:title", content: "Identity — CHAINMAIL App" },
      {
        property: "og:description",
        content: "Establish your Chainmail @handle and link it to your wallet address.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/app/identity" },
    ],
    links: [{ rel: "canonical", href: "/app/identity" }],
  }),
  component: Identity,
});

function Identity() {
  const { address } = useWallet();
  const { identity, claim, release } = useIdentity();
  const [handle, setHandle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onClaim = () => {
    setError(null);
    setSaved(false);
    try {
      claim(handle.replace(/^@/, ""));
      setHandle("");
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not establish identity.");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Chainmail Identity</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your @handle maps to your wallet address. In this MVP the mapping is stored
          locally in your browser; on-chain registration arrives with the contract.
        </p>
      </header>

      <IdentityCard />

      <form
        className="panel space-y-5 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          onClaim();
        }}
      >
        <div>
          <label htmlFor="handle" className="text-sm font-medium">
            Choose a handle
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-input bg-surface/50 px-4">
            <span className="font-mono text-sm text-muted-foreground">@</span>
            <input
              id="handle"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="yourhandle"
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            3–20 characters: letters, numbers or underscores.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!address}
            className="rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            {identity ? "Update Identity" : "Establish Identity"}
          </button>
          {identity && (
            <button
              type="button"
              onClick={() => {
                release();
                setSaved(false);
              }}
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold"
            >
              Release
            </button>
          )}
        </div>

        {!address && (
          <p className="text-sm text-muted-foreground">
            Connect a compatible wallet to continue.
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {saved && !error && (
          <p role="status" className="text-sm text-turquoise">
            Identity saved.
          </p>
        )}
      </form>
    </div>
  );
}
