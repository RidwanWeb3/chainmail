/**
 * Chainmail identity (V1).
 *
 * V1 associates a user-chosen Chainmail handle with the connected wallet.
 * Mapping is stored locally in the browser (and, from V2 onwards, mirrored
 * on-chain via the Arc registry contract).
 *
 * All inputs are validated with Zod — no handles reach storage without
 * passing the schema.
 */

import { handleSchema } from "@/lib/schemas";
import { z } from "zod";

const STORAGE_PREFIX = "chainmail:identity:";

export type ChainmailIdentity = {
  handle: string;
  address: string;
  createdAt: string;
};

const identityShape = z.object({
  handle: z.string(),
  address: z.string(),
  createdAt: z.string().datetime({ offset: true }),
});

export function normalizeHandle(raw: string): string {
  const result = handleSchema.safeParse(raw);
  return result.success ? result.data : "";
}

export function isValidHandle(raw: string): boolean {
  return handleSchema.safeParse(raw).success;
}

export function loadIdentity(address: string): ChainmailIdentity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + address.toLowerCase());
    if (!raw) return null;
    const parsed = identityShape.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveIdentity(address: string, handle: string): ChainmailIdentity {
  const cleanHandle = handleSchema.parse(handle);
  const identity: ChainmailIdentity = {
    handle: cleanHandle,
    address,
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + address.toLowerCase(), JSON.stringify(identity));
    } catch {
      /* storage unavailable — identity stays in memory for this session */
    }
  }
  return identity;
}

export function clearIdentity(address: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + address.toLowerCase());
  } catch {
    /* ignore */
  }
}
