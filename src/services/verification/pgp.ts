/**
 * PGP verification placeholder.
 *
 * The original Chainmail implementation authenticates senders with PGP keys and
 * on-chain fingerprint registration. That layer is NOT implemented in this MVP,
 * so nothing here may report a "PGP Verified" state.
 */

export const PGP_STATUS = "PGP Integration — Coming Soon" as const;

export type PgpVerificationResult = {
  status: "not-implemented";
  message: typeof PGP_STATUS;
};

export function verifyPgpSignature(): PgpVerificationResult {
  return { status: "not-implemented", message: PGP_STATUS };
}
