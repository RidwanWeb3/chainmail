import { recoverMessageAddress, isAddress, type Hex } from "viem";

/**
 * Wallet-signature verification. This is an off-chain cryptographic check:
 * a personal_sign signature is NOT a blockchain transaction.
 */

export type VerificationInput = {
  sender: string;
  message: string;
  signature: string;
  identity?: string;
};

export type VerificationResult =
  | {
      status: "verified";
      recovered: string;
      identity: string | null;
    }
  | {
      status: "failed";
      reason: string;
    };

export async function verifyWalletSignature(input: VerificationInput): Promise<VerificationResult> {
  const sender = input.sender.trim();
  const signature = input.signature.trim();

  if (!isAddress(sender)) {
    return { status: "failed", reason: "Sender is not a valid wallet address." };
  }
  if (!/^0x[0-9a-fA-F]+$/.test(signature)) {
    return { status: "failed", reason: "Signature is not a valid hex string." };
  }
  if (input.message.length === 0) {
    return { status: "failed", reason: "Message is empty." };
  }

  try {
    const recovered = await recoverMessageAddress({
      message: input.message,
      signature: signature as Hex,
    });

    if (recovered.toLowerCase() !== sender.toLowerCase()) {
      return {
        status: "failed",
        reason: "The signature does not correspond to the claimed sender.",
      };
    }

    return {
      status: "verified",
      recovered,
      identity: input.identity?.trim() ? input.identity.trim() : null,
    };
  } catch {
    return { status: "failed", reason: "Unable to verify this message." };
  }
}
