/**
 * Verification step model.
 *
 * Every step records what was checked, its outcome and the exact time the
 * check ran. Steps never claim on-chain verification: the network step only
 * reports the wallet/network context of the check.
 */

export type StepStatus = "passed" | "failed" | "skipped" | "simulated";

export type VerificationStep = {
  id: string;
  label: string;
  detail: string;
  status: StepStatus;
  timestamp: string;
};

export type VerificationReport = {
  id: string;
  createdAt: string;
  mode: "live" | "demo";
  sender: string;
  identity: string | null;
  message: string;
  signature: string;
  recovered: string | null;
  verified: boolean;
  steps: VerificationStep[];
};

export function step(
  id: string,
  label: string,
  detail: string,
  status: StepStatus,
): VerificationStep {
  return { id, label, detail, status, timestamp: new Date().toISOString() };
}

export function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  } catch {
    return iso;
  }
}

export const statusLabel: Record<StepStatus, string> = {
  passed: "Passed",
  failed: "Failed",
  skipped: "Skipped",
  simulated: "Simulated",
};
