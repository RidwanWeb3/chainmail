import { verifyWalletSignature, type VerificationInput } from "./signature";
import { step, type VerificationReport, type VerificationStep } from "./steps";
import { PGP_STATUS } from "./pgp";
import { arcConfig } from "@/services/blockchain/arc";

export type VerifyWithReportInput = {
  sender: string;
  message: string;
  signature: string;
  identity?: string;
  chainId?: number | null;
  expectedChainId?: number | null;
};

export async function verifyWithReport(
  input: VerifyWithReportInput,
): Promise<VerificationReport> {
  const steps: VerificationStep[] = [];
  const onCorrectNetwork =
    !input.expectedChainId || !input.chainId ? null : input.chainId === input.expectedChainId;

  const chainLabel = arcConfig.chainId ? `Arc chain ${arcConfig.chainId}` : "expected chain";

  if (onCorrectNetwork === true) {
    steps.push(
      step(
        "network",
        "Network check",
        `Wallet is connected to ${chainLabel}. Off-chain signature verification does not require a network call.`,
        "passed",
      ),
    );
  } else if (onCorrectNetwork === false) {
    steps.push(
      step(
        "network",
        "Network check",
        `Wallet reports chain ${String(input.chainId)} — expected ${chainLabel}. Signature verification continues but network context is non-canonical.`,
        "failed",
      ),
    );
  } else {
    steps.push(
      step(
        "network",
        "Network check",
        `No chain context available. Signature verification is purely cryptographic.`,
        "skipped",
      ),
    );
  }

  steps.push(
    step(
      "pgp",
      "PGP key check",
      PGP_STATUS,
      "skipped",
    ),
  );

  const startedAt = Date.now();
  const result = await verifyWalletSignature(input);

  if (result.status === "verified") {
    steps.push(
      step(
        "signature",
        "Signature validity",
        `personal_sign signature cryptographically verified in ${Date.now() - startedAt}ms. Recovered address matches the claimed sender.`,
        "passed",
      ),
    );
    steps.push(
      step(
        "identity",
        "Identity match",
        input.identity?.trim()
          ? `The signing address is associated with identity ${input.identity.trim()} (local mapping).`
          : "The signing address matches the claimed sender. No @handle identity was provided for mapping.",
        "passed",
      ),
    );
  } else {
    steps.push(
      step(
        "signature",
        "Signature validity",
        `Signature check failed: ${result.reason}`,
        "failed",
      ),
    );
    steps.push(
      step(
        "identity",
        "Identity match",
        "Identity could not be confirmed because the signature did not validate against the claimed sender.",
        "failed",
      ),
    );
  }

  return {
    id: `verif-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    mode: "live",
    sender: input.sender.trim(),
    identity: input.identity?.trim() ? input.identity.trim() : null,
    message: input.message,
    signature: input.signature.trim(),
    recovered: result.status === "verified" ? result.recovered : null,
    verified: result.status === "verified",
    steps,
  };
}
