/**
 * Chainmail on-chain layer (not yet deployed).
 *
 * The original Chainmail contracts register email addresses, PGP fingerprints,
 * sender addresses and message hashes. The Arc-focused deployment is not live,
 * so this module only exposes configuration state — it never fabricates an
 * address, transaction or on-chain read.
 */

import { arcConfig, contractAddress, explorerAddressUrl } from "./arc";

export type ContractState =
  | { status: "coming-soon" }
  | { status: "configured"; address: string; explorerUrl: string | null };

export function getContractState(): ContractState {
  if (!contractAddress) return { status: "coming-soon" };
  return {
    status: "configured",
    address: contractAddress,
    explorerUrl: explorerAddressUrl(contractAddress),
  };
}

export function isArcConfigured(): boolean {
  return arcConfig.configured;
}

/** Hash-style digest of a message, used as a local reference only. */
export async function messageDigest(message: string): Promise<string | null> {
  if (typeof globalThis.crypto?.subtle === "undefined") return null;
  const bytes = new TextEncoder().encode(message);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return (
    "0x" +
    Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  );
}
