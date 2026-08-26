import { useMemo, useState, type FormEvent } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ZodError } from "zod";
import {
  ChevronLeft,
  Sparkles,
  Clock,
  Users,
  DollarSign,
  FileText,
  FlaskConical,
  Rocket,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useIdentity } from "@/hooks/useIdentity";
import { NetworkPrompt } from "@/components/NetworkPrompt";
import { DemoPaymentBadge } from "@/components/PaymentCard";
import {
  createInvoice,
  shareablePaymentLink,
  upsertInvoice,
  DEMO_PAYMENT_NOTICE,
  type ChainmailInvoice,
  type PaymentMode,
} from "@/services/payments/payments";
import { formatUsdc, isUsdcConfigured, usdcToAtomic } from "@/services/payments/usdc";
import { addressSchema, paymentAmountSchema, paymentDescriptionSchema } from "@/lib/schemas";

export const Route = createFileRoute("/app/payments/new")({
  head: () => ({
    meta: [
      { title: "New USDC Payment Request — CHAINMAIL" },
      {
        name: "description",
        content:
          "Create a USDC payment request on Arc. Generate a shareable payment link and track confirmation status.",
      },
      { property: "og:title", content: "New USDC Payment Request — CHAINMAIL" },
      {
        property: "og:description",
        content:
          "Create a USDC payment request on Arc. Generate a shareable payment link and track confirmation status.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/app/payments/new" },
    ],
    links: [{ rel: "canonical", href: "/app/payments/new" }],
  }),
  component: NewPayment,
});

const TTL_OPTIONS: { value: number | null; label: string }[] = [
  { value: null, label: "Never expires" },
  { value: 15 * 60, label: "15 minutes" },
  { value: 60 * 60, label: "1 hour" },
  { value: 24 * 60 * 60, label: "24 hours" },
  { value: 7 * 24 * 60 * 60, label: "7 days" },
];

function firstZodMessage(err: ZodError | Error): string {
  if (err instanceof ZodError) return err.issues[0]?.message ?? "Invalid input.";
  return err.message;
}

function NewPayment() {
  const router = useRouter();
  const { address } = useWallet();
  const { identity } = useIdentity();
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [ttlSeconds, setTtlSeconds] = useState<number | null>(60 * 60);
  const [mode, setMode] = useState<PaymentMode>(isUsdcConfigured() ? "live" : "demo");
  const [status, setStatus] = useState<"idle" | "creating" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<ChainmailInvoice | null>(null);

  const preview = useMemo(() => {
    const atomic = usdcToAtomic(amount);
    if (atomic === null || atomic <= 0n) return null;
    return { atomic, display: formatUsdc(atomic) };
  }, [amount]);

  const liveDisabled = !isUsdcConfigured();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("creating");
    setError(null);
    setCreated(null);
    try {
      const recipientClean = recipientAddress.trim().length === 0 ? null : recipientAddress.trim();
      if (recipientClean !== null) {
        addressSchema.parse(recipientClean);
      }
      const invoice = createInvoice({
        creatorAddress: address ?? "0x" + "0".repeat(40),
        creatorHandle: identity?.handle ?? null,
        recipientAddress: recipientClean,
        recipientHandle: null,
        amountDisplay: paymentAmountSchema.parse(amount),
        description: paymentDescriptionSchema.parse(description) ?? null,
        ttlSeconds,
        mode,
      });
      if (address) upsertInvoice(address, invoice);
      setCreated(invoice);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(firstZodMessage(err as ZodError | Error));
    }
  };

  const shareLink = created ? shareablePaymentLink(created.id) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <button
          type="button"
          onClick={(): void => {
            router.history.back();
          }}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back to payments
        </button>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">New USDC payment request</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Set the amount, optionally assign a recipient and expiry, then share the payment link.
              Payers can confirm directly from the link.
            </p>
          </div>
          {mode === "demo" ? (
            <DemoPaymentBadge />
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-turquoise/40 bg-turquoise/10 px-2.5 py-1 text-[11px] font-bold tracking-[0.14em] text-turquoise uppercase">
              <Rocket className="h-3 w-3" aria-hidden="true" />
              Live
            </span>
          )}
        </div>
      </header>

      <NetworkPrompt />

      {status === "success" && created && shareLink ? (
        <section className="panel p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-turquoise/20 via-cyan/20 to-violet/20 border border-cyan/30">
              <Sparkles className="h-6 w-6 text-cyan" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-cyan uppercase">
                Request created
              </p>
              <h2 className="mt-1 text-2xl font-bold">{formatUsdc(created.amountAtomic)}</h2>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface/40 p-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Invoice
              </p>
              <p className="mt-2 font-mono text-sm">{created.id}</p>
              <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Shareable payment link
              </p>
              <a
                href={shareLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block break-all rounded-lg border border-cyan/30 bg-cyan/5 px-3 py-2 text-sm text-cyan hover:bg-cyan/10"
              >
                {shareLink}
              </a>
            </div>
            <div className="rounded-xl border border-border bg-surface/40 p-5">
              <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Pay to
              </p>
              <p className="mt-2 font-mono text-sm break-all">
                {created.recipientAddress ?? created.creatorAddress}
              </p>
              {created.description && (
                <>
                  <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Notes
                  </p>
                  <p className="mt-2 text-sm">{created.description}</p>
                </>
              )}
              {created.expiresAt && (
                <>
                  <p className="mt-4 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Expires
                  </p>
                  <p className="mt-2 font-mono text-sm">{created.expiresAt}</p>
                </>
              )}
            </div>
          </div>

          {created.mode === "demo" && (
            <p className="mt-6 rounded-xl border border-violet/50 bg-violet/10 px-4 py-3 text-xs font-semibold tracking-wide text-violet">
              {DEMO_PAYMENT_NOTICE}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={shareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Open payment link
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={(): void => {
                setStatus("idle");
                setCreated(null);
                setAmount("");
                setDescription("");
                setRecipientAddress("");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-surface"
            >
              Create another request
            </button>
            <button
              type="button"
              onClick={async (): Promise<void> => {
                await router.navigate({ to: "/app/payments" });
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-surface"
            >
              View all payments
            </button>
          </div>
        </section>
      ) : (
        <form onSubmit={onSubmit} className="panel p-6 space-y-8">
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <DollarSign className="h-3.5 w-3.5" aria-hidden="true" />
                Amount
              </div>
              <label className="relative block">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-lg text-muted-foreground">
                  USDC
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  spellCheck={false}
                  value={amount}
                  onChange={(e): void => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-input bg-surface/40 py-4 pl-24 pr-5 font-mono text-3xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground focus:border-cyan/50 focus:ring-1 focus:ring-cyan/40"
                />
              </label>
              <p className="mt-2 text-xs text-muted-foreground">
                {preview
                  ? `${preview.display} · up to 6 decimals`
                  : "Enter an amount greater than zero."}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                Description{" "}
                <span className="text-muted-foreground normal-case tracking-normal">
                  (optional)
                </span>
              </div>
              <textarea
                rows={3}
                value={description}
                onChange={(e): void => setDescription(e.target.value)}
                placeholder="What is this payment for?"
                maxLength={280}
                className="w-full rounded-2xl border border-input bg-surface/40 p-4 text-sm outline-none placeholder:text-muted-foreground focus:border-cyan/50 focus:ring-1 focus:ring-cyan/40"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {description.length.toLocaleString()} / 280 characters.
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                Recipient wallet{" "}
                <span className="text-muted-foreground normal-case tracking-normal">
                  (optional)
                </span>
              </div>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e): void => setRecipientAddress(e.target.value)}
                placeholder="0x… leave empty to pay into creator wallet"
                className="w-full rounded-2xl border border-input bg-surface/40 p-4 font-mono text-sm outline-none placeholder:text-muted-foreground focus:border-cyan/50 focus:ring-1 focus:ring-cyan/40"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Defaults to your connected wallet:{" "}
                <span className="font-mono">{address ?? "no wallet connected (demo)"}</span>.
              </p>
            </div>
          </section>

          <section className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                Expires after
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {TTL_OPTIONS.map((opt) => {
                  const active = ttlSeconds === opt.value;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={(): void => setTtlSeconds(opt.value)}
                      className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors ${
                        active
                          ? "border-cyan/50 bg-cyan/10 text-cyan"
                          : "border-border bg-surface/40 text-muted-foreground hover:text-foreground hover:bg-surface"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                Settlement mode
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={(): void => setMode("demo")}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    mode === "demo"
                      ? "border-violet/50 bg-violet/10 text-violet"
                      : "border-border bg-surface/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase">
                    <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
                    Demo
                  </span>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Simulated USDC transfer. No on-chain settlement.
                  </p>
                </button>
                <button
                  type="button"
                  disabled={liveDisabled}
                  onClick={(): void => setMode("live")}
                  className={`rounded-xl border p-4 text-left transition-colors ${
                    mode === "live"
                      ? "border-turquoise/50 bg-turquoise/10 text-turquoise"
                      : liveDisabled
                        ? "cursor-not-allowed border-border bg-surface/20 text-muted-foreground/60"
                        : "border-border bg-surface/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2 text-[11px] font-bold tracking-[0.16em] uppercase">
                    <Rocket className="h-3.5 w-3.5" aria-hidden="true" />
                    Live
                  </span>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {liveDisabled
                      ? "Set VITE_USDC_CONTRACT_ADDRESS to enable."
                      : "USDC token transfer on Arc Mainnet."}
                  </p>
                </button>
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
              {error}
            </div>
          )}

          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
            <p className="text-xs text-muted-foreground">
              Requests are stored per-wallet in this browser. On-chain registry is coming in V2.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={(): void => {
                  router.history.back();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === "creating" || !preview}
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                {status === "creating" ? "Creating…" : "Generate payment link"}
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </footer>
        </form>
      )}
    </div>
  );
}
