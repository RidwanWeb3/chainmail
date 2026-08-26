/**
 * USDC stablecoin configuration on Arc.
 *
 * USDC uses 6 decimals (not 18 like ETH/ARC). All values crossing the
 * service boundary are represented as atomic "micro-USDC" (1e6 = 1 USDC)
 * so we never round-trip through floating point for ledger-critical values.
 *
 * The contract address is loaded from env so the deployer can point it at
 * the official Arc-native USDC bridge once it is listed; until then the
 * service operates in DEMO / simulated mode and never claims a real transfer.
 */

import { z } from "zod";
import { addressSchema, txHashSchema } from "@/lib/schemas";

function envValue(value: unknown): string | null {
  const v = typeof value === "string" ? value.trim() : "";
  return v.length > 0 ? v : null;
}

export const USDC_DECIMALS = 6 as const;
export const USDC_SYMBOL = "USDC" as const;
export const USDC_NAME = "USD Coin" as const;

export const usdcContractAddress: string | null = envValue(
  import.meta.env["VITE_USDC_CONTRACT_ADDRESS"],
);

export function isUsdcConfigured(): boolean {
  return addressSchema.safeParse(usdcContractAddress ?? "").success;
}

/* ---------- atomic <-> display conversion ---------- */

export function usdcToAtomic(display: string): bigint | null {
  const clean = display.trim();
  if (!/^\d+(\.\d{0,6})?$/.test(clean)) return null;
  const [whole = "0", fraction = ""] = clean.split(".");
  const padded = (fraction + "000000").slice(0, USDC_DECIMALS);
  const combined = whole + padded;
  const noLeading = combined.replace(/^0+/, "") || "0";
  try {
    return BigInt(noLeading);
  } catch {
    return null;
  }
}

export function atomicToUsdcDisplay(atomic: bigint): string {
  if (atomic < 0n) return "0.00";
  const s = atomic.toString().padStart(USDC_DECIMALS + 1, "0");
  const whole = s.slice(0, -USDC_DECIMALS) || "0";
  const frac = s.slice(-USDC_DECIMALS);
  const trimmed = frac.replace(/0+$/, "");
  return trimmed.length === 0 ? `${whole}.00` : `${whole}.${trimmed.padEnd(2, "0")}`;
}

export function formatUsdc(atomic: bigint): string {
  const base = atomicToUsdcDisplay(atomic);
  const [whole = "0", frac = "00"] = base.split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${USDC_SYMBOL} ${withCommas}.${frac}`;
}

/* ---------- DEMO transfer simulation ---------- */

const DEMO_HASH_PREFIX = "0xdeadbeef" as const;

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const d = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(d))
    .map((b: number): string => b.toString(16).padStart(2, "0"))
    .join("");
}

export type DemoTransferInput = {
  from: string;
  to: string;
  amountAtomic: bigint;
  invoiceId: string;
};

export type DemoTransferResult = {
  mode: "demo";
  txHash: string;
  blockNumber: number;
  confirmedAt: string;
  amountAtomic: bigint;
  from: string;
  to: string;
  note: string;
};

export async function simulateDemoTransfer(input: DemoTransferInput): Promise<DemoTransferResult> {
  const fromOk = addressSchema.safeParse(input.from).success;
  const toOk = addressSchema.safeParse(input.to).success;
  if (!fromOk || !toOk || input.amountAtomic <= 0n) {
    throw new Error("DEMO transfer requires valid from/to addresses and a positive amount.");
  }
  const digest = await sha256Hex(
    `chainmail-demo-usdc:${input.invoiceId}:${input.from}:${input.to}:${input.amountAtomic.toString()}:${Date.now()}`,
  );
  const txHash = `${DEMO_HASH_PREFIX}${digest.slice(10, 10 + 54)}`;
  const validated = txHashSchema.safeParse(txHash);
  const finalTxHash = validated.success ? validated.data : `${DEMO_HASH_PREFIX}${"0".repeat(54)}`;
  return {
    mode: "demo",
    txHash: finalTxHash,
    blockNumber: 19_700_000 + Math.floor(Math.random() * 250_000),
    confirmedAt: new Date().toISOString(),
    amountAtomic: input.amountAtomic,
    from: input.from,
    to: input.to,
    note: "SIMULATED — demo USDC transfer. No on-chain settlement.",
  };
}

export const _typeSchemas = {
  _demoTransferResult: z.object({
    mode: z.literal("demo"),
    txHash: txHashSchema,
    blockNumber: z.number().int().positive(),
    confirmedAt: z.string().datetime({ offset: true }),
    amountAtomic: z.bigint().positive(),
    from: addressSchema,
    to: addressSchema,
    note: z.string(),
  }),
};
