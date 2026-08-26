/**
 * DEMO mode.
 *
 * A fully labelled walkthrough of the PGP-based identity and message
 * verification flow. Nothing here touches a wallet, a real PGP key or a
 * blockchain — every artefact is deterministic and marked as simulated so it
 * can never be mistaken for a real verification.
 */

import { step, type VerificationReport, type VerificationStep } from "./steps";

export const DEMO_NOTICE =
  "DEMO MODE — simulated PGP identity and signature. No blockchain verification is performed.";

export const demoHandle = "alice";
export const demoAddress = "0xDEM0000000000000000000000000000000000A11CE";
export const demoMessage =
  "Hello from CHAINMAIL. This message demonstrates the verification flow end to end.";

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Simulated PGP fingerprint derived from the demo handle. */
export async function demoFingerprint(handle: string): Promise<string> {
  const hex = await sha256Hex(`chainmail-demo-pgp:${handle}`);
  return (
    hex
      .slice(0, 40)
      .toUpperCase()
      .match(/.{1,4}/g) ?? []
  ).join(" ");
}

/** Simulated detached PGP signature over the demo message. */
export async function demoSignature(handle: string, message: string): Promise<string> {
  const hex = await sha256Hex(`chainmail-demo-sig:${handle}:${message}`);
  return `SIMULATED-PGP:${hex}`;
}

export type DemoStageId = "identity" | "keypair" | "sign" | "verify";

export async function runDemoVerification(
  handle: string,
  message: string,
  signature: string,
): Promise<VerificationReport> {
  const fingerprint = await demoFingerprint(handle);
  const expected = await demoSignature(handle, message);
  const matches = expected === signature;

  const steps: VerificationStep[] = [
    step(
      "network",
      "Network check",
      "Demo mode does not query a network. Arc chain 5042 is referenced for illustration only.",
      "simulated",
    ),
    step(
      "pgp",
      "PGP key check",
      `Simulated fingerprint ${fingerprint} resolved for @${handle}.`,
      "simulated",
    ),
    step(
      "signature",
      "Signature validity",
      matches
        ? "The simulated detached signature matches the message digest."
        : "The simulated signature does not match the message digest.",
      matches ? "simulated" : "failed",
    ),
    step(
      "identity",
      "Identity match",
      matches
        ? `Signature key maps to the demo identity @${handle}.`
        : "Signature key could not be mapped to the demo identity.",
      matches ? "simulated" : "failed",
    ),
  ];

  return {
    id: `demo-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    mode: "demo",
    sender: demoAddress,
    identity: `@${handle}`,
    message,
    signature,
    recovered: matches ? demoAddress : null,
    verified: matches,
    steps,
  };
}
