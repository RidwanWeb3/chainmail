/**
 * DEMO mode.
 *
 * A fully labelled walkthrough of the PGP-based identity and message
 * verification flow. Nothing here touches a wallet, a real PGP key or a
 * blockchain — every artefact is deterministic and marked as simulated so it
 * can never be mistaken for a real verification.
 */

import { step, type VerificationReport, type VerificationStep } from "./steps";
import { arcConfig } from "@/services/blockchain/arc";

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

export async function demoFingerprint(handle: string): Promise<string> {
  const hex = await sha256Hex(`chainmail-demo-pgp:${handle}`);
  return (
    hex
      .slice(0, 40)
      .toUpperCase()
      .match(/.{1,4}/g) ?? []
  ).join(" ");
}

export async function demoSignature(handle: string, message: string): Promise<string> {
  const hex = await sha256Hex(`chainmail-demo-sig:${handle}:${message}`);
  return `SIMULATED-PGP:${hex}`;
}

export type DemoStageId = "identity" | "keypair" | "sign" | "verify";

export type DemoStage = {
  id: DemoStageId;
  title: string;
  description: string;
  detail: string;
};

export const demoStages: DemoStage[] = [
  {
    id: "identity",
    title: "1. Establish Identity",
    description: "Choose a @handle that will be publicly linked to your cryptographic identity.",
    detail:
      "In production, your @handle is registered on-chain and mapped to a wallet address and PGP fingerprint.",
  },
  {
    id: "keypair",
    title: "2. PGP Key Pair",
    description:
      "Generate a PGP key pair. The public fingerprint becomes part of your on-chain identity.",
    detail:
      "In production, the private key stays on your device; only the 40-character hex fingerprint is published.",
  },
  {
    id: "sign",
    title: "3. Sign Message",
    description:
      "Sign a plaintext message with your private key to produce a detached PGP signature.",
    detail:
      "The signature covers the message digest and can be verified by anyone who holds your public key.",
  },
  {
    id: "verify",
    title: "4. Verify Message",
    description:
      "A verifier recovers the fingerprint from the signature and matches it against the on-chain identity.",
    detail:
      "A match confirms two things: the message was not tampered with, and it originated from the claimed identity.",
  },
];

export async function runDemoVerification(
  handle: string,
  message: string,
  signature: string,
): Promise<VerificationReport> {
  const fingerprint = await demoFingerprint(handle);
  const expected = await demoSignature(handle, message);
  const matches = expected === signature;

  const chainLabel = arcConfig.chainId ? `Arc chain ${arcConfig.chainId}` : "Arc network";

  const steps: VerificationStep[] = [
    step(
      "network",
      "Network check",
      matches
        ? `Demo mode references ${chainLabel}. No on-chain lookup is performed.`
        : `Network context: ${chainLabel} (illustrative only).`,
      "simulated",
    ),
    step(
      "pgp",
      "PGP key check",
      `Simulated fingerprint ${fingerprint} resolved for @${handle}. The fingerprint is deterministically derived from the handle for demo purposes.`,
      "simulated",
    ),
    step(
      "signature",
      "Signature validity",
      matches
        ? "The simulated detached PGP signature matches the message digest computed from the provided text."
        : "The simulated signature does not match the expected digest for this message and @handle.",
      matches ? "simulated" : "failed",
    ),
    step(
      "identity",
      "Identity match",
      matches
        ? `Signing key fingerprint maps to the registered demo identity @${handle}. The sender and recovered signer agree.`
        : "The signing key could not be mapped to the claimed demo identity. Sender and recovered signer diverge.",
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
