import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Copy, Check, ArrowRight, ShieldCheck } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useIdentity } from "@/hooks/useIdentity";
import { DemoBadge } from "@/components/IdentityCard";
import { NetworkPrompt } from "@/components/NetworkPrompt";
import { addressSchema, handleSchema, messageSchema, maybeHandleSchema } from "@/lib/schemas";
import { ZodError } from "zod";
import { encodeReport } from "@/services/report/verificationReport";
import { step, type VerificationReport } from "@/services/verification/steps";

export const Route = createFileRoute("/app/compose")({
  head: () => ({
    meta: [
      { title: "Compose — CHAINMAIL App" },
      {
        name: "description",
        content: "Compose a message and sign it cryptographically with your wallet.",
      },
      { property: "og:title", content: "Compose — CHAINMAIL App" },
      {
        property: "og:description",
        content: "Compose a message and sign it cryptographically with your wallet.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/app/compose" },
    ],
    links: [{ rel: "canonical", href: "/app/compose" }],
  }),
  component: Compose,
});

type Status = "ready" | "waiting" | "signing" | "created" | "error";

const statusLabel: Record<Status, string> = {
  ready: "Ready",
  waiting: "Waiting for wallet...",
  signing: "Signing...",
  created: "Signature created",
  error: "Error",
};

function firstZodMessage(err: ZodError | Error): string {
  if (err instanceof ZodError) return err.issues[0]?.message ?? "Invalid input.";
  return err.message;
}

function Compose() {
  const { address, chainId, signMessage } = useWallet();
  const { identity } = useIdentity();
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("ready");
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onSign = async () => {
    setError(null);
    setSignature(null);

    const recipientResult = maybeHandleSchema.safeParse(recipient);
    if (!recipientResult.success) {
      setStatus("error");
      setError("Invalid recipient handle. 3–20 characters: letters, numbers or underscores only.");
      return;
    }
    const messageResult = messageSchema.safeParse(message);
    if (!messageResult.success) {
      setStatus("error");
      setError(firstZodMessage(messageResult.error));
      return;
    }
    const addressResult = addressSchema.safeParse(address ?? "");
    if (!addressResult.success) {
      setStatus("error");
      setError("Connect a compatible wallet to continue.");
      return;
    }

    try {
      setStatus("waiting");
      const sig = await signMessage(messageResult.data);
      setStatus("signing");
      setSignature(sig);
      setStatus("created");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "The message could not be signed.");
    }
  };

  const copySignature = async () => {
    if (!signature) return;
    try {
      await navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const shareableLink = (() => {
    if (!signature || !address) return null;
    const handle = maybeHandleSchema.safeParse(recipient).data;
    const senderParsed = addressSchema.safeParse(address).data;
    if (!senderParsed) return null;
    // Build a lightweight "pre-verified" report that Verify page can decode.
    const steps = [
      step(
        "network",
        "Network check",
        chainId
          ? `Signature produced on chain ${String(chainId)}.`
          : "Produced without explicit network context.",
        "skipped",
      ),
      step(
        "pgp",
        "PGP key check",
        "PGP check disabled on signed payload — verify explicitly.",
        "skipped",
      ),
      step(
        "signature",
        "Signature validity",
        "Validity pending cryptographic verification.",
        "skipped",
      ),
      step(
        "identity",
        "Identity match",
        identity?.handle
          ? `Sender claimed identity @${identity.handle}.`
          : "No @handle identity attached.",
        "skipped",
      ),
    ];
    const report: VerificationReport = {
      id: `compose-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      mode: "live",
      sender: senderParsed,
      identity: identity?.handle ? `@${identity.handle}` : null,
      message: messageSchema.parse(message),
      signature,
      recovered: null,
      verified: false,
      steps,
    };
    const encoded = encodeReport(report);
    try {
      return `/app/verify?r=${encodeURIComponent(encoded)}`;
    } catch {
      return null;
    }
  })();

  // Satisfy handleSchema import (keeps bundle tree-shake minimal, guards recipient handle).
  void handleSchema;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Compose Message</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Signing produces an off-chain cryptographic signature. It is not a blockchain transaction.
        </p>
      </header>

      <NetworkPrompt />

      <form
        className="panel space-y-5 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void onSign();
        }}
      >
        <div>
          <label htmlFor="recipient" className="text-sm font-medium">
            Recipient
          </label>
          <input
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="@recipient"
            className="mt-2 w-full rounded-xl border border-input bg-surface/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
            minLength={3}
            maxLength={21}
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Optional: recipient @handle (3–20 letters, numbers or underscores).
          </p>
        </div>
        <div>
          <label htmlFor="message" className="text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message..."
            className="mt-2 w-full rounded-xl border border-input bg-surface/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground"
            maxLength={50_000}
            spellCheck={true}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {message.length.toLocaleString()} / 50,000 characters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === "waiting" || status === "signing" || !address}
            className="rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            Sign Message
          </button>
          <p role="status" className="text-sm text-muted-foreground">
            Status: <span className="text-foreground">{statusLabel[status]}</span>
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </form>

      {signature && (
        <section className="panel p-6" aria-labelledby="signature-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="signature-title" className="text-lg font-semibold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-turquoise" aria-hidden="true" />
              Signature created
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copySignature}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-2 text-xs font-semibold"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-turquoise" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {copied ? "Copied" : "Copy signature"}
              </button>
              {shareableLink && (
                <Link
                  to={shareableLink}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 px-4 py-2 text-xs font-semibold tracking-wide uppercase text-cyan hover:bg-cyan/15"
                >
                  Open in Verify
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Sender</dt>
              <dd className="font-mono break-all">
                {identity ? `@${identity.handle} · ` : ""}
                {address}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Recipient</dt>
              <dd className="font-mono break-all">{recipient || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Signature</dt>
              <dd className="font-mono text-xs break-all">{signature}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Share the message, sender address and signature so the recipient can verify it. Use{" "}
            <span className="font-semibold text-cyan">Open in Verify</span> to jump straight to the
            Verify page with the payload pre-filled via the shareable link.
          </p>
        </section>
      )}

      {!address && (
        <section className="panel p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold tracking-[0.18em] uppercase text-muted-foreground">
              Example
            </h2>
            <DemoBadge />
          </div>
          <p className="mt-3 text-sm">
            <span className="text-gradient font-semibold">@alice</span> · ✓ Verified
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Hello from Chainmail.</p>
        </section>
      )}
    </div>
  );
}
