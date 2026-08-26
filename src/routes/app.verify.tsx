import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, ShieldX } from "lucide-react";
import { verifyWalletSignature } from "@/services/verification/signature";

export const Route = createFileRoute("/app/verify")({
  head: () => ({
    meta: [
      { title: "Verify — CHAINMAIL App" },
      {
        name: "description",
        content: "Verify a signed message and recover the signing wallet address.",
      },
      { property: "og:title", content: "Verify — CHAINMAIL App" },
      {
        property: "og:description",
        content: "Verify a signed message and recover the signing wallet address.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/app/verify" },
    ],
    links: [{ rel: "canonical", href: "/app/verify" }],
  }),
  component: Verify,
});

type Result =
  | { ok: true; signer: string }
  | { ok: false; reason: string };

function Verify() {
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [sender, setSender] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const onVerify = async () => {
    setResult(null);
    if (!message.trim() || !signature.trim() || !sender.trim()) {
      setResult({
        ok: false,
        reason: "Provide the sender address, the message and the signature.",
      });
      return;
    }
    setBusy(true);
    try {
      const res = await verifyWalletSignature({
        sender: sender.trim(),
        message,
        signature: signature.trim(),
      });
      setResult(
        res.status === "verified"
          ? { ok: true, signer: res.recovered }
          : { ok: false, reason: res.reason },
      );
    } catch (err) {
      setResult({
        ok: false,
        reason: err instanceof Error ? err.message : "Verification failed.",
      });
    } finally {
      setBusy(false);
    }
  };

  const verified = result?.ok === true;


  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Verify Message</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Recover the signing address from a message and signature. Verification runs
          entirely in your browser.
        </p>
      </header>

      <form
        className="panel space-y-5 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void onVerify();
        }}
      >
        <div>
          <label htmlFor="v-message" className="text-sm font-medium">
            Message
          </label>
          <textarea
            id="v-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-2 w-full rounded-xl border border-input bg-surface/50 px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="v-signature" className="text-sm font-medium">
            Signature
          </label>
          <textarea
            id="v-signature"
            rows={3}
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="0x..."
            className="mt-2 w-full rounded-xl border border-input bg-surface/50 px-4 py-3 font-mono text-xs"
          />
        </div>
        <div>
          <label htmlFor="v-sender" className="text-sm font-medium">
            Claimed sender address
          </label>
          <input
            id="v-sender"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="0x..."
            className="mt-2 w-full rounded-xl border border-input bg-surface/50 px-4 py-3 font-mono text-xs"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        >
          {busy ? "Verifying..." : "Verify"}
        </button>
      </form>

      {result && (
        <section
          role="status"
          className={`panel p-6 ${verified ? "border-turquoise/50" : "border-destructive/50"}`}
        >
          <div className="flex items-center gap-3">
            {verified ? (
              <ShieldCheck className="h-6 w-6 text-turquoise" aria-hidden="true" />
            ) : (
              <ShieldX className="h-6 w-6 text-destructive" aria-hidden="true" />
            )}
            <h2 className="text-lg font-semibold">
              {verified ? "Verified" : "Not verified"}
            </h2>
          </div>
          {result.ok ? (
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Recovered signer</dt>
                <dd className="font-mono break-all">{result.signer}</dd>
              </div>
              {result.matches !== null && (
                <div>
                  <dt className="text-muted-foreground">Matches expected sender</dt>
                  <dd>{result.matches ? "Yes" : "No"}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">{result.reason}</p>
          )}
        </section>
      )}
    </div>
  );
}
