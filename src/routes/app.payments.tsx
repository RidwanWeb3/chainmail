import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, X, Trash2, Ban, Filter } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useIdentity } from "@/hooks/useIdentity";
import { NetworkPrompt } from "@/components/NetworkPrompt";
import { DemoPaymentBadge, PaymentCard, PaymentStatusPill } from "@/components/PaymentCard";
import {
  cancelInvoice,
  expireIfNeeded,
  formatInvoiceTotal,
  loadInvoices,
  removeInvoice,
  type ChainmailInvoice,
  type PaymentStatus,
} from "@/services/payments/payments";
import { isUsdcConfigured } from "@/services/payments/usdc";

export const Route = createFileRoute("/app/payments")({
  head: () => ({
    meta: [
      { title: "Payments — CHAINMAIL App" },
      {
        name: "description",
        content:
          "Create USDC payment requests, share payment links and track confirmation status on Arc.",
      },
      { property: "og:title", content: "Payments — CHAINMAIL App" },
      {
        property: "og:description",
        content:
          "Create USDC payment requests, share payment links and track confirmation status on Arc.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/app/payments" },
    ],
    links: [{ rel: "canonical", href: "/app/payments" }],
  }),
  component: Payments,
});

const FILTERS: { id: "all" | PaymentStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "paid", label: "Paid" },
  { id: "expired", label: "Expired" },
  { id: "cancelled", label: "Cancelled" },
  { id: "draft", label: "Draft" },
];

function Payments() {
  const { address } = useWallet();
  const { identity } = useIdentity();
  const [invoices, setInvoices] = useState<ChainmailInvoice[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");

  useEffect(() => {
    if (!address) {
      setInvoices([]);
      return;
    }
    const loaded = loadInvoices(address).map((invoice): ChainmailInvoice =>
      expireIfNeeded(invoice),
    );
    setInvoices(loaded);
  }, [address]);

  const totals = useMemo(() => {
    let pendingUsdc = 0n;
    let paidUsdc = 0n;
    for (const inv of invoices) {
      if (inv.status === "pending") pendingUsdc += inv.amountAtomic;
      if (inv.status === "paid") paidUsdc += inv.amountAtomic;
    }
    return { pendingUsdc, paidUsdc, count: invoices.length };
  }, [invoices]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return invoices.filter((inv): boolean => {
      if (filter !== "all" && inv.status !== filter) return false;
      if (!q) return true;
      return (
        inv.id.toLowerCase().includes(q) ||
        (inv.description ?? "").toLowerCase().includes(q) ||
        (inv.creatorHandle ?? "").toLowerCase().includes(q) ||
        (inv.recipientHandle ?? "").toLowerCase().includes(q) ||
        inv.creatorAddress.toLowerCase().includes(q) ||
        (inv.recipientAddress ?? "").toLowerCase().includes(q)
      );
    });
  }, [invoices, query, filter]);

  const onCancel = (invoiceId: string) => {
    if (!address) return;
    const before = invoices.find((i): boolean => i.id === invoiceId);
    if (!before) return;
    const ok = cancelInvoice(address, invoiceId);
    if (ok) {
      setInvoices((list): ChainmailInvoice[] =>
        list.map((i): ChainmailInvoice => (i.id === invoiceId ? ok : i)),
      );
    }
  };

  const onDelete = (invoiceId: string) => {
    if (!address) return;
    const next = removeInvoice(address, invoiceId);
    setInvoices(next);
  };

  return (
    <div className="space-y-6">
      <header>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Payments</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Create USDC payment requests, share payment links and track on-chain confirmation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!isUsdcConfigured() && <DemoPaymentBadge />}
            <Link
              to="/app/payments/new"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New request
            </Link>
          </div>
        </div>
      </header>

      <NetworkPrompt />

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="panel p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Total requests
          </p>
          <p className="mt-2 text-3xl font-bold">{totals.count}</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-electric uppercase">Pending</p>
          <p className="mt-2 text-3xl font-bold text-electric">
            {formatInvoiceTotal({
              amountAtomic: totals.pendingUsdc,
            } as ChainmailInvoice)}
          </p>
        </div>
        <div className="panel p-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-turquoise uppercase">
            Received
          </p>
          <p className="mt-2 text-3xl font-bold text-turquoise">
            {formatInvoiceTotal({
              amountAtomic: totals.paidUsdc,
            } as ChainmailInvoice)}
          </p>
        </div>
      </section>

      <section className="panel p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              value={query}
              onChange={(e): void => setQuery(e.target.value)}
              placeholder="Search by invoice ID, description, handle, address…"
              className="w-full rounded-xl border border-input bg-surface/50 py-2.5 pl-10 pr-10 text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={(): void => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 rounded-full border border-border p-1">
            <span className="sr-only">Filters</span>
            <Filter className="mx-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={(): void => setFilter(f.id)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide uppercase transition-colors ${
                  filter === f.id
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {!address && (
        <div className="panel p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Connect a wallet to see your payment requests. You can still create a payment request to
            explore the flow.
          </p>
        </div>
      )}

      {address && filtered.length === 0 && (
        <div className="panel p-10 text-center">
          <p className="text-sm font-semibold">No payment requests yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first USDC invoice — share the link and track confirmations.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <PaymentStatusPill status="pending" />
            <PaymentStatusPill status="paid" />
            <PaymentStatusPill status="expired" />
          </div>
        </div>
      )}

      <div className="grid gap-5">
        {filtered.map((inv) => (
          <PaymentCard
            key={inv.id}
            invoice={inv}
            variant="list"
            actions={
              <>
                {(inv.status === "pending" || inv.status === "draft") && (
                  <button
                    type="button"
                    onClick={(): void => onCancel(inv.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/10"
                    aria-label={`Cancel ${inv.id}`}
                  >
                    <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={(): void => {
                    if (confirm(`Delete invoice ${inv.id}?`)) onDelete(inv.id);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-surface"
                  aria-label={`Delete ${inv.id}`}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Delete
                </button>
              </>
            }
          />
        ))}
      </div>

      {identity && (
        <p className="text-xs text-muted-foreground">
          Signed in as @{identity.handle}. Payment requests are stored locally in this browser;
          on-chain registry is part of the contracts roadmap.
        </p>
      )}
    </div>
  );
}
