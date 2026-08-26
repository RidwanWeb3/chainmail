import { z } from "zod";
import { isAddress, isHex } from "viem";

const HANDLE_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

export const handleSchema = z
  .string({ message: "Handle must be text." })
  .trim()
  .toLowerCase()
  .transform((s: string): string => s.replace(/^@+/, ""))
  .refine((v: string): boolean => HANDLE_REGEX.test(v), {
    message: "3–20 characters: letters, numbers or underscores only.",
  });

export const messageSchema = z
  .string({ message: "Message must be text." })
  .min(1, "Message cannot be empty.")
  .max(50_000, "Message too long (max 50,000 characters).");

export const signatureSchema = z
  .string({ message: "Signature must be text." })
  .trim()
  .refine((v: string): boolean => v.length > 0, "Signature cannot be empty.")
  .refine((v: string): boolean => v.startsWith("0x") && isHex(v) && v.length >= 130, {
    message: "Signature must be a 0x… hex string of at least 65 bytes (130 hex chars).",
  });

export const addressSchema = z
  .string({ message: "Address must be text." })
  .trim()
  .refine(
    (v: string): boolean => isAddress(v),
    "Invalid wallet address (not EIP-55 / 20-byte hex format).",
  );

export const maybeHandleSchema = z.preprocess(
  (raw: unknown): unknown => (raw === "" || raw === null || raw === undefined ? null : raw),
  z
    .string()
    .trim()
    .toLowerCase()
    .transform((s: string): string => s.replace(/^@+/, ""))
    .refine((v: string): boolean => HANDLE_REGEX.test(v), {
      message: "3–20 characters: letters, numbers or underscores only.",
    })
    .nullable(),
);

export const pgpPublicKeySchema = z
  .string({ message: "PGP public key must be armored text." })
  .trim()
  .refine(
    (v: string): boolean => v.startsWith("-----BEGIN PGP PUBLIC KEY BLOCK-----"),
    "PGP public key must start with -----BEGIN PGP PUBLIC KEY BLOCK-----",
  );

export const pgpPrivateKeySchema = z
  .string({ message: "PGP private key must be armored text." })
  .trim()
  .refine(
    (v: string): boolean => v.startsWith("-----BEGIN PGP PRIVATE KEY BLOCK-----"),
    "PGP private key must start with -----BEGIN PGP PRIVATE KEY BLOCK-----",
  );

export type ValidHandle = z.infer<typeof handleSchema>;
export type ValidMessage = z.infer<typeof messageSchema>;
export type ValidSignature = z.infer<typeof signatureSchema>;
export type ValidAddress = z.infer<typeof addressSchema>;

/* ---------- Payments ---------- */

export const paymentAmountSchema = z
  .string({ message: "Amount must be text." })
  .trim()
  .refine((v: string): boolean => /^\d+(\.\d{0,6})?$/.test(v), {
    message: "Use up to 6 decimals. Example: 125.50",
  })
  .refine((v: string): boolean => Number(v) > 0, {
    message: "Amount must be greater than zero.",
  })
  .refine((v: string): boolean => Number(v) <= 1_000_000_000, {
    message: "Amount exceeds the maximum (1,000,000,000 USDC).",
  });

export const paymentDescriptionSchema = z
  .string({ message: "Description must be text." })
  .trim()
  .max(280, "Description must be 280 characters or less.")
  .optional()
  .or(z.literal(""));

export const invoiceIdSchema = z
  .string({ message: "Invoice ID must be text." })
  .trim()
  .regex(/^INV-[A-Z0-9]{6,16}$/, "Invalid invoice ID format.");

export const txHashSchema = z
  .string({ message: "Transaction hash must be text." })
  .trim()
  .refine(
    (v: string): boolean => v.startsWith("0x") && isHex(v) && v.length === 66,
    "Transaction hash must be a 0x… hex string of 32 bytes (66 chars).",
  );

export type ValidPaymentAmount = z.infer<typeof paymentAmountSchema>;
export type ValidInvoiceId = z.infer<typeof invoiceIdSchema>;
export type ValidTxHash = z.infer<typeof txHashSchema>;
