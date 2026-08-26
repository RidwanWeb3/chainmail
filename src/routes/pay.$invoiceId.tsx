import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ZodError } from "zod";
import {
  ShieldCheck,
  Home,
  Copy,
  Check,
  ChevronRight,
  ArrowRightLeft,
  Wallet,
  FlaskConical,
  AlertTriangle,
  Clock,
  Ban,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import {
  confirmDemoPayment,
  expireIfNeeded,
  findInvoicePublic,
  formatInvoiceTotal,
  invoiceExplorerLinks,
  DEMO_PAYMENT_NOTICE,
  type ChainmailInvoice,
} from "@/services/payments/payments";
import { USDC_SYMBOL, formatUsdc } from "@/services/payments/usdc";
import { DemoPaymentBadge, PaymentStatusPill } from "@/components/PaymentCard";
import { shortenAddress } from "@/services/blockchain/arc";
import { formatTimestamp } from "@/services/verification/steps";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pay/$invoiceId")({
  validateSearch: (): { from?: string } => ({}),
  loader: ({ params }): { invoiceId: string } => ({
    invoiceId: params.invoiceId,
  }),
  head: ({ params }) => ({
    meta: [
      { title: `USDC Payment — ${params.invoiceId} · CHAINMAIL` },
      {
        name: "description",
        content: "Verify and confirm a USDC payment request on Arc Mainnet via CHAINMAIL.",
      },
      { property: "og:title", content: "USDC Payment Request · CHAINMAIL" },
      {
        property: "og:description",
        content: "Verify and confirm a USDC payment request on Arc Mainnet via CHAINMAIL.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `/pay/${params.invoiceId}` },
    ],
    links: [{ rel: "canonical", href: `/pay/${params.invoiceId}` }],
  }),
  component: PayInvoice,
});

function firstZodMessage(err: ZodError | Error): string {
  if (err instanceof ZodError) return err.issues[0]?.message ?? "Invalid input.";
  return err.message;
}

function PayInvoice() {
  const { invoiceId } = Route.useParams();
  const { address: walletAddress, connect } = useWallet();
  const [invoice, setInvoice] = useState<ChainmailInvoice | null>(null);
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "confirming" | "paid" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const raw = findInvoicePublic(invoiceId);
    if (raw) {
      setInvoice(expireIfNeeded(raw));
      setStatus(raw.status === "paid" ? "paid" : "idle");
    } else {
      setInvoice(null);
      setStatus("idle");
    }
    setChecked(true);
  }, [invoiceId]);

  const links = useMemo(() => (invoice ? invoiceExplorerLinks(invoice) : null), [invoice]);

  const payeeAddress = invoice ? (invoice.recipientAddress ?? invoice.creatorAddress) : null;

  const onConfirmDemoPay = async (): Promise<void> => {
    if (!invoice || !walletAddress) return;
    setStatus("confirming");
    setError(null);
    try {
      const { invoice: paid } = await confirmDemoPayment({
        invoiceId: invoice.id,
        payerAddress: walletAddress,
        creatorAddress: invoice.creatorAddress,
      });
      setInvoice(paid);
      setStatus("paid");
    } catch (err) {
      setError(firstZodMessage(err as ZodError | Error));
      setStatus("error");
    }
  };

  const onCopyLink = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout((): void => setCopiedLink(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  if (checked && !invoice) {
    return (
      <main className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -top-48 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-electric/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-violet/20 blur-3xl" />
        </div>
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-10">
          <Link
            to="/"
            className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to CHAINMAIL
          </Link>
          <div className="panel mt-10 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/50 bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-2xl font-bold">Invoice not found</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We couldn't locate this payment request locally. It may have been created on another
              device, deleted, or the link may be invalid.
            </p>
            <p className="mt-4 font-mono text-xs text-muted-foreground break-all">{invoiceId}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              <Link
                to="/app/payments/new"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                Create a payment request
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold hover:bg-surface"
              >
                Back home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-48 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-electric/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[30rem] w-[30rem] rounded-full bg-violet/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to CHAINMAIL
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {invoice?.mode === "demo" && <DemoPaymentBadge />}
            <button
              type="button"
              onClick={(): void => {
                void onCopyLink();
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase hover:bg-surface"
              aria-label={copiedLink ? "Copied" : "Copy payment link"}
            >
              {copiedLink ? (
                <Check className="h-3.5 w-3.5 text-turquoise" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copiedLink ? "Link copied" : "Share link"}
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left: Invoice details */}
          <section
            className={cn(
              "panel overflow-hidden",
              invoice?.status === "paid" ? "border-turquoise/40" : undefined,
            )}
          >
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 p-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-xs text-muted-foreground">{invoice?.id}</p>
                  {invoice && <PaymentStatusPill status={invoice.status} />}
                </div>
                <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Payment amount
                </p>
                <h1 className="mt-1 text-4xl font-bold tracking-tight text-gradient sm:text-5xl">
                  {invoice ? formatInvoiceTotal(invoice) : `${USDC_SYMBOL} 0.00`}
                </h1>
                {invoice?.description && (
                  <p className="mt-3 text-sm text-muted-foreground break-words">
                    {invoice.description}
                  </p>
                )}
              </div>
            </header>

            <div className="grid gap-5 p-6 text-sm sm:grid-cols-2">
              <dl className="space-y-3">
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Created
                  </dt>
                  <dd className="mt-1 font-mono text-xs">
                    {invoice?.createdAt && formatTimestamp(invoice.createdAt)}
                  </dd>
                </div>
                {invoice?.expiresAt && (
                  <div>
                    <dt className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      Expires
                    </dt>
                    <dd className="mt-1 font-mono text-xs">{formatTimestamp(invoice.expiresAt)}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Pay to address
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs">
                    {payeeAddress ?? "—"}
                    {links?.to && (
                      <a
                        href={links.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-1 text-cyan hover:underline"
                      >
                        View wallet
                        <ChevronRight className="h-3 w-3" aria-hidden="true" />
                      </a>
                    )}
                  </dd>
                </div>
              </dl>
              <dl className="space-y-3">
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Requested by
                  </dt>
                  <dd className="mt-1 break-all font-mono text-xs">
                    {invoice
                      ? invoice.creatorHandle
                        ? `@${invoice.creatorHandle} · ${shortenAddress(invoice.creatorAddress)}`
                        : shortenAddress(invoice.creatorAddress)
                      : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Recipient handle
                  </dt>
                  <dd className="mt-1 text-xs">
                    {invoice?.recipientHandle
                      ? `@${invoice.recipientHandle}`
                      : invoice?.recipientAddress
                        ? "Direct to address above"
                        : "Any payer — deposit to creator"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Token
                  </dt>
                  <dd className="mt-1 text-xs">
                    {USDC_SYMBOL} on Arc ·{" "}
                    {invoice?.mode === "live" ? "Live on-chain" : "Demo mode"}
                  </dd>
                </div>
              </dl>
            </div>

            {invoice?.confirmation && (
              <footer className="border-t border-border/60 bg-surface/30 p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-turquoise/40 bg-turquoise/10 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-turquoise uppercase">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Confirmed
                  </span>
                  {invoice.confirmation.mode === "demo" && <DemoPaymentBadge />}
                </div>
                <p className="mt-4 font-mono text-xs break-all">{invoice.confirmation.txHash}</p>
                {links?.tx && (
                  <a
                    href={links.tx}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan hover:underline"
                  >
                    Open transaction on Arc Scan
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                )}
                <dl className="mt-5 grid gap-3 sm:grid-cols-3 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Block</dt>
                    <dd className="mt-1 font-mono">
                      #{invoice.confirmation.blockNumber.toLocaleString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Payer</dt>
                    <dd className="mt-1 font-mono break-all">
                      {shortenAddress(invoice.confirmation.from)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Confirmed at</dt>
                    <dd className="mt-1 font-mono">
                      {formatTimestamp(invoice.confirmation.confirmedAt)}
                    </dd>
                  </div>
                </dl>
                {invoice.confirmation.mode === "demo" && (
                  <p className="mt-5 rounded-xl border border-violet/50 bg-violet/10 px-4 py-3 text-xs font-semibold tracking-wide text-violet">
                    {invoice.confirmation.note}
                  </p>
                )}
              </footer>
            )}
          </section>

          {/* Right: action card */}
          <aside className="flex flex-col gap-5">
            <div className="panel p-6">
              <h2 className="text-sm font-semibold">Payment checklist</h2>
              <ol className="mt-4 space-y-3 text-sm">
                <ChecklistItem
                  icon={<ArrowRightLeft className="h-4 w-4" aria-hidden="true" />}
                  title={`Transfer exactly ${invoice ? formatUsdc(invoice.amountAtomic) : "USDC 0.00"}`}
                  detail={`Send ${USDC_SYMBOL} to the payee address listed on the left.`}
                  done={invoice?.status === "paid"}
                />
                <ChecklistItem
                  icon={<Wallet className="h-4 w-4" aria-hidden="true" />}
                  title="Connect the payer wallet"
                  detail="To attach your paying address to the confirmation receipt."
                  done={invoice?.status === "paid" || Boolean(walletAddress)}
                />
                <ChecklistItem
                  icon={<ShieldCheck className="h-4 w-4" aria-hidden="true" />}
                  title="Confirm the transaction"
                  detail={
                    invoice?.mode === "demo"
                      ? "Demo mode: this will simulate confirmation locally."
                      : "Live mode: verify on Arc that the transfer event settled."
                  }
                  done={invoice?.status === "paid"}
                />
              </ol>
            </div>

            <div className="panel p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                {invoice?.mode === "demo" ? (
                  <FlaskConical className="h-4 w-4 text-violet" aria-hidden="true" />
                ) : (
                  <ArrowRightLeft className="h-4 w-4 text-turquoise" aria-hidden="true" />
                )}
                {invoice?.status === "paid"
                  ? "Payment complete"
                  : invoice?.status === "cancelled"
                    ? "Request cancelled"
                    : invoice?.status === "expired"
                      ? "Request expired"
                      : invoice?.mode === "demo"
                        ? "Demo confirm"
                        : "Live confirmation"}
              </h2>

              <p className="mt-3 text-sm text-muted-foreground">
                {invoice?.status === "paid"
                  ? "This payment request has been recorded as settled. Share this page for verifiable proof."
                  : invoice?.status === "cancelled"
                    ? "The creator cancelled this request before it was paid."
                    : invoice?.status === "expired"
                      ? "This payment request has expired and is no longer payable."
                      : invoice?.mode === "demo"
                        ? "One click simulates a USDC transfer and attaches a confirmation receipt — useful for demos and testing."
                        : "Look up the on-chain transfer event by tx hash and attach it to this invoice."}
              </p>

              {invoice?.mode === "demo" && invoice?.status !== "paid" && (
                <p className="mt-4 rounded-xl border border-violet/50 bg-violet/10 px-3 py-2 text-[11px] font-semibold tracking-wide text-violet">
                  {DEMO_PAYMENT_NOTICE}
                </p>
              )}

              <div className="mt-5 flex flex-col gap-2">
                {!walletAddress &&
                  invoice?.status !== "paid" &&
                  invoice?.status !== "cancelled" &&
                  invoice?.status !== "expired" && (
                    <button
                      type="button"
                      onClick={(): void => {
                        void connect();
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold hover:bg-surface"
                    >
                      <Wallet className="h-4 w-4" aria-hidden="true" />
                      Connect wallet to confirm as payer
                    </button>
                  )}

                {walletAddress && invoice?.status === "pending" && (
                  <>
                    <p className="text-xs text-muted-foreground">
                      Payer address:{" "}
                      <span className="font-mono text-foreground break-all">
                        {shortenAddress(walletAddress)}
                      </span>
                    </p>
                    {invoice.mode === "demo" ? (
                      <button
                        type="button"
                        onClick={(): void => {
                          void onConfirmDemoPay();
                        }}
                        disabled={status === "confirming"}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ backgroundImage: "var(--gradient-brand)" }}
                      >
                        {status === "confirming"
                          ? "Confirming demo payment…"
                          : `Confirm demo ${formatUsdc(invoice.amountAtomic)} payment`}
                        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : (
                      <p className="rounded-xl border border-border bg-surface/50 px-4 py-3 text-xs font-semibold text-muted-foreground">
                        Live confirmation requires the USDC contract + subgraph indexer to be wired.
                        Use DEMO mode to explore the receipt.
                      </p>
                    )}
                  </>
                )}

                {invoice?.status === "paid" && (
                  <Link
                    to="/app/payments"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold hover:bg-surface"
                  >
                    View in payments dashboard
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}

                {(invoice?.status === "cancelled" || invoice?.status === "expired") && (
                  <Link
                    to="/app/payments/new"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-primary-foreground"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  >
                    {invoice.status === "cancelled" ? (
                      <Ban className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Clock className="h-4 w-4" aria-hidden="true" />
                    )}
                    Create a new payment request
                  </Link>
                )}
              </div>

              {error && (
                <p className="mt-5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive">
                  {error}
                </p>
              )}
            </div>

            <div className="panel p-6">
              <h3 className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                What you're verifying
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-turquoise" />
                  Payment amount & destination match the invoice
                </li>
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-turquoise" />
                  Sender address is attached to the receipt
                </li>
                <li className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-turquoise" />
                  Shareable link proves the payment status to third parties
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

type ChecklistItemProps = {
  icon: React.ReactNode;
  title: string;
  detail: string;
  done?: boolean;
};

function ChecklistItem({ icon, title, detail, done }: ChecklistItemProps) {
  return (
    <li
      className={cn(
        "rounded-xl border px-4 py-3 transition-colors",
        done ? "border-turquoise/40 bg-turquoise/5" : "border-border bg-surface/40",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
            done ? "bg-turquoise/20 text-turquoise" : "bg-surface text-muted-foreground",
          )}
        >
          {done ? <Check className="h-3.5 w-3.5" /> : icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-semibold", done ? "text-turquoise" : "text-foreground")}>
            {title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
        </div>
      </div>
    </li>
  );
}
