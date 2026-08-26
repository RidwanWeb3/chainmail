/**
 * Chainmail identity (V1).
 *
 * V1 simply associates a user-chosen Chainmail handle with the connected
 * wallet, stored locally in the browser. No naming protocol, no custody,
 * no private key material is ever handled here.
 */

const STORAGE_PREFIX = "chainmail:identity:";

export type ChainmailIdentity = {
  handle: string;
  address: string;
  createdAt: string;
};

export function normalizeHandle(raw: string): string {
  return raw.trim().replace(/^@+/, "").toLowerCase();
}

export function isValidHandle(raw: string): boolean {
  const handle = normalizeHandle(raw);
  return /^[a-z0-9_]{3,20}$/.test(handle);
}

export function loadIdentity(address: string): ChainmailIdentity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + address.toLowerCase());
    return raw ? (JSON.parse(raw) as ChainmailIdentity) : null;
  } catch {
    return null;
  }
}

export function saveIdentity(address: string, handle: string): ChainmailIdentity {
  const identity: ChainmailIdentity = {
    handle: normalizeHandle(handle),
    address,
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(
        STORAGE_PREFIX + address.toLowerCase(),
        JSON.stringify(identity),
      );
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
