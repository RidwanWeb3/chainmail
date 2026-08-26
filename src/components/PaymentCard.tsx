import {
  CheckCircle2,
  XCircle,
  Clock,
  FileX2,
  PencilRuler,
  FlaskConical,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import type { ChainmailInvoice, PaymentStatus } from "@/services/payments/payments";
import {
  formatInvoiceTotal,
  invoiceExplorerLinks,
  paymentStatusLabel,
  shareablePaymentLink,
} from "@/services/payments/payments";
import { formatTimestamp } from "@/services/verification/steps";
import { shortenAddress } from "@/services/blockchain/arc";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const toneMap: Record<PaymentStatus, string> = {
  draft: "text-muted-foreground border-muted-foreground/40 bg-muted/40",
  pending: "text-electric border-electric/40 bg-electric/10",
  paid: "text-turquoise border-turquoise/40 bg-turquoise/10",
  expired: "text-destructive border-destructive/40 bg-destructive/10",
  cancelled: "text-muted-foreground border-muted-foreground/40 bg-muted/40",
};

const iconMap: Record<PaymentStatus, typeof CheckCircle2> = {
  draft: PencilRuler,
  pending: Clock,
  paid: CheckCircle2,
  expired: XCircle,
  cancelled: FileX2,
};

export function PaymentStatusPill({ status }: { status: PaymentStatus }) {
  const Icon = iconMap[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-[0.14em] uppercase",
        toneMap[status],
      )}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {paymentStatusLabel(status)}
    </span>
  );
}

export function DemoPaymentBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet/50 bg-violet/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.16em] text-violet uppercase">
      <FlaskConical className="h-3 w-3" aria-hidden="true" />
      Demo
    </span>
  );
}

function CopyButton({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout((): void => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      type="button"
      onClick={(): Promise<void> => copy()}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase hover:bg-surface"
      aria-label={copied ? "Copied" : label ? `Copy ${label}` : "Copy"}
    >
      {copied ? (
        <Check className="h-3 w-3 text-turquoise" aria-hidden="true" />
      ) : (
        <Copy className="h-3 w-3" aria-hidden="true" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export type PaymentCardProps = {
  invoice: ChainmailInvoice;
  variant?: "list" | "full";
  actions?: React.ReactNode;
};

export function PaymentCard({ invoice, variant = "list", actions }: PaymentCardProps) {
  const total = formatInvoiceTotal(invoice);
  const links = invoiceExplorerLinks(invoice);
  const shareLink = shareablePaymentLink(invoice.id);

  return (
    <article
      aria-labelledby={`invoice-${invoice.id}-title`}
      className={cn(
        "panel overflow-hidden",
        invoice.status === "paid" ? "border-turquoise/40" : undefined,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 p-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-xs text-muted-foreground">{invoice.id}</p>
            <PaymentStatusPill status={invoice.status} />
            {invoice.mode === "demo" && <DemoPaymentBadge />}
          </div>
          <p id={`invoice-${invoice.id}-title`} className="mt-2 text-2xl font-bold text-gradient">
            {total}
          </p>
          {invoice.description && (
            <p className="mt-1 text-sm text-muted-foreground break-words">{invoice.description}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </header>

      <div
        className={cn("grid gap-5 p-5", variant === "list" ? "sm:grid-cols-3" : "sm:grid-cols-2")}
      >
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Created</dt>
            <dd className="mt-1 font-mono text-xs">{formatTimestamp(invoice.createdAt)}</dd>
          </div>
          {invoice.expiresAt && (
            <div>
              <dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Expires</dt>
              <dd className="mt-1 font-mono text-xs">{formatTimestamp(invoice.expiresAt)}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              From / Beneficiary
            </dt>
            <dd className="mt-1 font-mono text-xs break-all">
              {invoice.creatorHandle
                ? `@${invoice.creatorHandle} · ${shortenAddress(invoice.creatorAddress)}`
                : shortenAddress(invoice.creatorAddress)}
            </dd>
          </div>
        </dl>

        <dl className="space-y-2 text-sm">
          <div>
            <dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">Pay To</dt>
            <dd className="mt-1 font-mono text-xs break-all">
              {invoice.recipientAddress
                ? invoice.recipientHandle
                  ? `@${invoice.recipientHandle} · ${shortenAddress(invoice.recipientAddress)}`
                  : shortenAddress(invoice.recipientAddress)
                : shortenAddress(invoice.creatorAddress)}
              {links.to && (
                <a
                  href={links.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 inline-flex items-center gap-1 text-cyan hover:underline"
                >
                  Explorer
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              Shareable Link
            </dt>
            <dd className="mt-1 flex flex-wrap items-center gap-2">
              <Link
                to="/pay/$invoiceId"
                params={{ invoiceId: invoice.id }}
                className="inline-flex items-center gap-1.5 rounded-full border border-cyan/40 bg-cyan/10 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-cyan hover:bg-cyan/15"
              >
                Open payment link
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
              </Link>
              <CopyButton value={shareLink} label="share link" />
            </dd>
          </div>
          <div>
            <dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              Settlement
            </dt>
            <dd className="mt-1 font-mono text-xs">
              {links.usdc ? (
                <a
                  href={links.usdc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan hover:underline"
                >
                  USDC on Arc
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ) : (
                "USDC contract pending Arc listing · demo mode only"
              )}
            </dd>
          </div>
        </dl>

        {variant === "full" && (
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/40 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background">
                  <QrCode className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">Scan to pay</p>
                  <p className="mt-0.5 text-xs text-muted-foreground break-all">
                    EIP-681 payload · open in a compatible wallet
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-muted-foreground">
                Placeholder
              </span>
            </div>
          </div>
        )}
      </div>

      {invoice.confirmation && (
        <footer className="border-t border-border/60 bg-surface/30 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-turquoise uppercase">
                Payment confirmed
              </p>
              <p className="mt-1 font-mono text-xs break-all text-foreground">
                {invoice.confirmation.txHash}
              </p>
            </div>
            {links.tx && (
              <a
                href={links.tx}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-turquoise/40 px-3 py-1.5 text-xs font-semibold text-turquoise hover:bg-turquoise/10"
              >
                View transaction
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3 text-xs">
            <div>
              <dt className="text-muted-foreground">Block</dt>
              <dd className="mt-1 font-mono text-foreground">
                #{invoice.confirmation.blockNumber.toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">From</dt>
              <dd className="mt-1 font-mono break-all text-foreground">
                {shortenAddress(invoice.confirmation.from)}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">At</dt>
              <dd className="mt-1 font-mono text-foreground">
                {formatTimestamp(invoice.confirmation.confirmedAt)}
              </dd>
            </div>
          </dl>
          {invoice.confirmation.mode === "demo" && (
            <p className="mt-4 rounded-xl border border-violet/50 bg-violet/10 px-4 py-3 text-xs font-semibold tracking-wide text-violet">
              {invoice.confirmation.note}
            </p>
          )}
        </footer>
      )}
    </article>
  );
}
