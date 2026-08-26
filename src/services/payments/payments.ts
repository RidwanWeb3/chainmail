/**
 * On-Chain Payments — invoice registry & confirmation.
 *
 * V1 stores invoices per-wallet in the browser (same pattern as identity).
 * Every invoice has:
 *   - a shareable public link  `/pay/:invoiceId`
 *   - a status lifecycle      draft | pending | paid | expired | cancelled
 *   - a payment confirmation  (txHash + blockNumber) attached via DEMO
 *     simulation until the USDC contract + subgraph indexer are wired.
 *
 * DEMO NOTICE — simulated confirmation labels are always present alongside
 * any "paid" status so end-users can never mistake a demo transfer for real
 * on-chain settlement.
 */

import { z } from "zod";
import {
  addressSchema,
  invoiceIdSchema,
  maybeHandleSchema,
  paymentAmountSchema,
  paymentDescriptionSchema,
  txHashSchema,
} from "@/lib/schemas";
import {
  USDC_DECIMALS,
  formatUsdc,
  isUsdcConfigured,
  simulateDemoTransfer,
  usdcToAtomic,
  usdcContractAddress,
  type DemoTransferResult,
} from "./usdc";
import { arcConfig, explorerAddressUrl } from "@/services/blockchain/arc";

export type PaymentStatus = "draft" | "pending" | "paid" | "expired" | "cancelled";

export type PaymentMode = "demo" | "live";

export type PaymentConfirmation =
  | {
      mode: "demo";
      txHash: string;
      blockNumber: number;
      confirmedAt: string;
      from: string;
      to: string;
      amountAtomic: bigint;
      note: string;
    }
  | {
      mode: "live";
      txHash: string;
      blockNumber: number;
      confirmedAt: string;
      from: string;
      to: string;
      amountAtomic: bigint;
      logIndex: number;
    };

export type ChainmailInvoice = {
  id: string;
  createdAt: string;
  expiresAt: string | null;
  creatorAddress: string;
  creatorHandle: string | null;
  recipientAddress: string | null;
  recipientHandle: string | null;
  amountAtomic: bigint;
  amountDisplay: string;
  description: string | null;
  status: PaymentStatus;
  mode: PaymentMode;
  confirmation: PaymentConfirmation | null;
};

const STATUS_LABEL: Record<PaymentStatus, string> = {
  draft: "Draft",
  pending: "Pending",
  paid: "Paid",
  expired: "Expired",
  cancelled: "Cancelled",
};

export function paymentStatusLabel(status: PaymentStatus): string {
  return STATUS_LABEL[status];
}

/* ---------- storage ---------- */

const STORAGE_PREFIX = "chainmail:payments:";

const invoiceShape = z.object({
  id: invoiceIdSchema,
  createdAt: z.string().datetime({ offset: true }),
  expiresAt: z.string().datetime({ offset: true }).nullable(),
  creatorAddress: addressSchema,
  creatorHandle: z.string().nullable(),
  recipientAddress: addressSchema.nullable(),
  recipientHandle: z.string().nullable(),
  amountAtomic: z
    .string()
    .refine((s: string): boolean => /^\d+$/.test(s), "amountAtomic must be base-10")
    .transform((s: string): bigint => BigInt(s))
    .pipe(z.bigint().nonnegative()),
  amountDisplay: paymentAmountSchema,
  description: paymentDescriptionSchema
    .nullable()
    .transform((v): string | null => (typeof v === "string" && v.length > 0 ? v : null)),
  status: z.enum(["draft", "pending", "paid", "expired", "cancelled"]),
  mode: z.enum(["demo", "live"]),
  confirmation: z
    .object({
      mode: z.enum(["demo", "live"]),
      txHash: txHashSchema,
      blockNumber: z.number().int().positive(),
      confirmedAt: z.string().datetime({ offset: true }),
      from: addressSchema,
      to: addressSchema,
      amountAtomic: z
        .string()
        .refine((s: string): boolean => /^\d+$/.test(s))
        .transform((s: string): bigint => BigInt(s)),
      logIndex: z.number().int().nonnegative().optional(),
      note: z.string().optional(),
    })
    .transform((raw): PaymentConfirmation => {
      const base = {
        txHash: raw.txHash,
        blockNumber: raw.blockNumber,
        confirmedAt: raw.confirmedAt,
        from: raw.from,
        to: raw.to,
        amountAtomic: raw.amountAtomic,
      };
      if (raw.mode === "demo") {
        return {
          mode: "demo",
          ...base,
          note:
            typeof raw.note === "string"
              ? raw.note
              : "SIMULATED — demo USDC transfer. No on-chain settlement.",
        };
      }
      return {
        mode: "live",
        ...base,
        logIndex: typeof raw.logIndex === "number" ? raw.logIndex : 0,
      };
    })
    .nullable(),
});

const persistedListShape = z.array(invoiceShape.transform((invoice): ChainmailInvoice => invoice));

function keyFor(address: string): string {
  return STORAGE_PREFIX + address.toLowerCase();
}

export function loadInvoices(address: string): ChainmailInvoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(keyFor(address));
    if (!raw) return [];
    const parsed = persistedListShape.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

export function saveInvoices(address: string, invoices: readonly ChainmailInvoice[]): void {
  if (typeof window === "undefined") return;
  try {
    const serializable = invoices.map(serializeInvoice);
    window.localStorage.setItem(keyFor(address), JSON.stringify(serializable));
  } catch {
    /* storage unavailable — invoices kept in memory only */
  }
}

function serializeInvoice(invoice: ChainmailInvoice) {
  return {
    id: invoice.id,
    createdAt: invoice.createdAt,
    expiresAt: invoice.expiresAt,
    creatorAddress: invoice.creatorAddress,
    creatorHandle: invoice.creatorHandle,
    recipientAddress: invoice.recipientAddress,
    recipientHandle: invoice.recipientHandle,
    amountAtomic: invoice.amountAtomic.toString(),
    amountDisplay: invoice.amountDisplay,
    description: invoice.description,
    status: invoice.status,
    mode: invoice.mode,
    confirmation: invoice.confirmation
      ? {
          ...invoice.confirmation,
          amountAtomic: invoice.confirmation.amountAtomic.toString(),
        }
      : null,
  };
}

/* ---------- invoice lookup by public id (for /pay/:id page) ---------- */

export function findInvoicePublic(invoiceId: string): ChainmailInvoice | null {
  if (typeof window === "undefined") return null;
  const idOk = invoiceIdSchema.safeParse(invoiceId);
  if (!idOk.success) return null;
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(STORAGE_PREFIX)) keys.push(k);
  }
  for (const k of keys) {
    try {
      const raw = window.localStorage.getItem(k);
      if (!raw) continue;
      const parsed = persistedListShape.safeParse(JSON.parse(raw));
      if (!parsed.success) continue;
      const hit = parsed.data.find((inv: ChainmailInvoice): boolean => inv.id === invoiceId);
      if (hit) return hit;
    } catch {
      /* skip corrupted bucket */
    }
  }
  return null;
}

/* ---------- id generation ---------- */

const ALNUM = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateInvoiceId(): string {
  const bytes = new Uint8Array(8);
  const webCrypto = globalThis.crypto as Crypto | undefined;
  if (webCrypto && typeof webCrypto.getRandomValues === "function") {
    try {
      webCrypto.getRandomValues(bytes);
    } catch {
      for (let i = 0; i < bytes.length; i += 1) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  let suffix = "";
  for (let i = 0; i < 8; i += 1) {
    const byteVal = Number(bytes[i]);
    const idx = Number.isFinite(byteVal) ? byteVal % ALNUM.length : 0;
    suffix += ALNUM.charAt(idx);
  }
  return `INV-${suffix}`;
}

/* ---------- invoice creation ---------- */

export type CreateInvoiceInput = {
  creatorAddress: string;
  creatorHandle: string | null;
  recipientAddress: string | null;
  recipientHandle: string | null;
  amountDisplay: string;
  description: string | null;
  ttlSeconds: number | null;
  mode: PaymentMode;
};

export function createInvoice(input: CreateInvoiceInput): ChainmailInvoice {
  const amountAtomic = usdcToAtomic(input.amountDisplay);
  if (amountAtomic === null || amountAtomic <= 0n) {
    throw new Error("Invalid USDC amount.");
  }
  const creator = addressSchema.safeParse(input.creatorAddress);
  if (!creator.success) {
    throw new Error("Creator wallet address is invalid.");
  }
  if (input.recipientAddress !== null && input.recipientAddress !== "") {
    const r = addressSchema.safeParse(input.recipientAddress);
    if (!r.success) {
      throw new Error("Recipient wallet address is invalid.");
    }
  }
  const now = new Date();
  const expiry =
    typeof input.ttlSeconds === "number" && input.ttlSeconds > 0
      ? new Date(now.getTime() + input.ttlSeconds * 1000).toISOString()
      : null;

  const cleanAmountDisplay = paymentAmountSchema.parse(input.amountDisplay);
  const cleanDescription = paymentDescriptionSchema.parse(input.description ?? "") || null;
  const creatorHandle = maybeHandleSchema.safeParse(input.creatorHandle ?? null).data as
    string | null;
  const recipientHandle = maybeHandleSchema.safeParse(input.recipientHandle ?? null).data as
    string | null;
  const recipientAddress = addressSchema.safeParse(input.recipientAddress ?? "").success
    ? (input.recipientAddress as string)
    : null;

  const invoice: ChainmailInvoice = {
    id: generateInvoiceId(),
    createdAt: now.toISOString(),
    expiresAt: expiry,
    creatorAddress: creator.data,
    creatorHandle,
    recipientAddress,
    recipientHandle,
    amountAtomic,
    amountDisplay: cleanAmountDisplay,
    description: cleanDescription ?? null,
    status: "pending",
    mode: input.mode === "live" && isUsdcConfigured() ? "live" : "demo",
    confirmation: null,
  };
  return invoice;
}

export function upsertInvoice(address: string, invoice: ChainmailInvoice): ChainmailInvoice[] {
  const all = loadInvoices(address);
  const idx = all.findIndex((i): boolean => i.id === invoice.id);
  if (idx === -1) {
    const next = [invoice, ...all];
    saveInvoices(address, next);
    return next;
  }
  const next = all.slice();
  next[idx] = invoice;
  saveInvoices(address, next);
  return next;
}

export function removeInvoice(address: string, invoiceId: string): ChainmailInvoice[] {
  const all = loadInvoices(address);
  const next = all.filter((i): boolean => i.id !== invoiceId);
  saveInvoices(address, next);
  return next;
}

export function cancelInvoice(address: string, invoiceId: string): ChainmailInvoice | null {
  const all = loadInvoices(address);
  const target = all.find((i): boolean => i.id === invoiceId);
  if (!target || target.status === "paid" || target.status === "cancelled") return null;
  const updated: ChainmailInvoice = { ...target, status: "cancelled" };
  upsertInvoice(address, updated);
  return updated;
}

export function expireIfNeeded(invoice: ChainmailInvoice): ChainmailInvoice {
  if (invoice.status !== "pending" && invoice.status !== "draft") return invoice;
  if (!invoice.expiresAt) return invoice;
  const expires = new Date(invoice.expiresAt).getTime();
  if (Number.isNaN(expires)) return invoice;
  if (Date.now() < expires) return invoice;
  return { ...invoice, status: "expired" };
}

/* ---------- shareable link ---------- */

export function shareablePaymentLink(invoiceId: string): string {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/pay/${encodeURIComponent(invoiceId)}`;
}

export function invoicePaymentQrPayload(invoiceId: string): string {
  const usdc = usdcContractAddress ?? "USDC_DEMO";
  const chain = arcConfig.chainId ?? 5042;
  // EIP-681-ish payload so wallets can scan the recipient + amount later.
  const invoice = findInvoicePublic(invoiceId);
  const to = invoice?.recipientAddress ?? invoice?.creatorAddress ?? "";
  const amount = invoice ? invoice.amountDisplay : "0";
  const base = `ethereum:${usdc}@${chain}/transfer?address=${to}&uint256=${USDC_DECIMALS}&amount=${amount}`;
  return `${base}&ref=chainmail:${invoiceId}`;
}

/* ---------- confirmation (DEMO simulated) ---------- */

export type ConfirmPaymentInput = {
  invoiceId: string;
  payerAddress: string;
  creatorAddress?: string;
};

export async function confirmDemoPayment(
  input: ConfirmPaymentInput,
): Promise<{ invoice: ChainmailInvoice; confirmation: DemoTransferResult }> {
  const invoice = findInvoicePublic(input.invoiceId);
  if (!invoice) throw new Error("Invoice not found.");
  if (invoice.status === "paid") throw new Error("Invoice is already paid.");
  if (invoice.status === "cancelled") throw new Error("Invoice has been cancelled.");
  if (invoice.status === "expired" && invoice.expiresAt) {
    if (Date.now() >= new Date(invoice.expiresAt).getTime()) {
      throw new Error("Invoice has expired.");
    }
  }

  const payer = addressSchema.safeParse(input.payerAddress);
  if (!payer.success) throw new Error("Payer wallet address is invalid.");

  const to = invoice.recipientAddress ?? invoice.creatorAddress;
  const tx = await simulateDemoTransfer({
    from: payer.data,
    to,
    amountAtomic: invoice.amountAtomic,
    invoiceId: invoice.id,
  });

  const confirmation: PaymentConfirmation = {
    mode: "demo",
    txHash: tx.txHash,
    blockNumber: tx.blockNumber,
    confirmedAt: tx.confirmedAt,
    from: tx.from,
    to: tx.to,
    amountAtomic: tx.amountAtomic,
    note: tx.note,
  };

  const paid: ChainmailInvoice = {
    ...expireIfNeeded(invoice),
    status: "paid",
    confirmation,
  };

  const ownerAddr = input.creatorAddress ?? paid.creatorAddress;
  if (addressSchema.safeParse(ownerAddr).success) {
    upsertInvoice(ownerAddr, paid);
  }
  // Also persist under payer address so they can see the record in their list.
  if (payer.data.toLowerCase() !== ownerAddr.toLowerCase()) {
    const payerAll = loadInvoices(payer.data);
    const exists = payerAll.some((i): boolean => i.id === paid.id);
    if (!exists) saveInvoices(payer.data, [paid, ...payerAll]);
    else upsertInvoice(payer.data, paid);
  }

  return { invoice: paid, confirmation: tx };
}

/* ---------- view helpers ---------- */

export function invoiceExplorerLinks(invoice: ChainmailInvoice): {
  usdc: string | null;
  tx: string | null;
  from: string | null;
  to: string | null;
} {
  const base = usdcContractAddress ? explorerAddressUrl(usdcContractAddress) : null;
  const tx = invoice.confirmation
    ? arcConfig.explorerUrl
      ? `${arcConfig.explorerUrl.replace(/\/$/, "")}/tx/${invoice.confirmation.txHash}`
      : null
    : null;
  const from = invoice.confirmation ? explorerAddressUrl(invoice.confirmation.from) : null;
  const payee = invoice.recipientAddress ?? invoice.creatorAddress;
  const to = explorerAddressUrl(payee);
  return { usdc: base, tx, from, to };
}

export function formatInvoiceTotal(invoice: ChainmailInvoice): string {
  return formatUsdc(invoice.amountAtomic);
}

export const DEMO_PAYMENT_NOTICE =
  "DEMO MODE — simulated USDC transfer. No on-chain settlement is performed." as const;
