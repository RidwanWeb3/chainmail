import { jsPDF } from "jspdf";
import { DEMO_NOTICE } from "@/services/verification/demo";
import {
  formatTimestamp,
  statusLabel,
  type VerificationReport,
} from "@/services/verification/steps";

/* ---------- shareable on-page link ---------- */

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeReport(report: VerificationReport): string {
  return toBase64Url(JSON.stringify(report));
}

export function decodeReport(encoded: string): VerificationReport | null {
  try {
    const parsed = JSON.parse(fromBase64Url(encoded)) as VerificationReport;
    if (!parsed || !Array.isArray(parsed.steps)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function shareLink(report: VerificationReport): string {
  const base =
    typeof window === "undefined" ? "" : `${window.location.origin}${window.location.pathname}`;
  return `${base}?r=${encodeReport(report)}`;
}

/* ---------- PDF report ---------- */

export function downloadReportPdf(report: VerificationReport): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const width = doc.internal.pageSize.getWidth();
  const maxWidth = width - margin * 2;
  let y = margin;
  const link = typeof window === "undefined" ? "" : shareLink(report);

  const line = (text: string, size = 10, style: "normal" | "bold" = "normal", gap = 14) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    const parts = doc.splitTextToSize(text, maxWidth) as string[];
    parts.forEach((part) => {
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(part, margin, y);
      y += gap;
    });
  };

  line("CHAINMAIL", 20, "bold", 24);
  line("Message Verification Report", 12, "normal", 22);

  if (report.mode === "demo") {
    doc.setFillColor(240, 236, 255);
    doc.rect(margin, y - 12, maxWidth, 34, "F");
    doc.setTextColor(90, 40, 180);
    line(DEMO_NOTICE, 9, "bold", 28);
    doc.setTextColor(0, 0, 0);
  }

  y += 6;
  line(`Result: ${report.verified ? "VERIFIED" : "NOT VERIFIED"}`, 13, "bold", 20);
  line(`Report ID: ${report.id}`);
  line(`Generated: ${formatTimestamp(report.createdAt)}`);
  line(
    `Mode: ${report.mode === "demo" ? "Demo (simulated — no blockchain check)" : "Live wallet signature (off-chain cryptographic check)"}`,
  );
  line(`Identity: ${report.identity ?? "—"}`);
  line(`Claimed sender: ${report.sender}`);
  line(`Recovered signer: ${report.recovered ?? "—"}`);
  y += 8;

  line("Message", 12, "bold", 18);
  line(report.message);
  y += 4;
  line("Signature", 12, "bold", 18);
  line(report.signature, 8);
  y += 8;

  line("Verification steps", 12, "bold", 18);
  report.steps.forEach((s, i) => {
    line(`${i + 1}. ${s.label} — ${statusLabel[s.status]}`, 10, "bold", 14);
    line(s.detail, 9);
    line(formatTimestamp(s.timestamp), 8, "normal", 16);
  });

  y += 8;
  if (link) {
    line("Shareable link (open this URL to reload the report)", 10, "bold", 14);
    line(link, 8);
    y += 8;
  }

  line(
    "A wallet signature is an off-chain cryptographic proof and is not a blockchain transaction. Demo mode never touches a wallet or a smart contract.",
    8,
  );

  doc.save(`chainmail-verification-${report.id}.pdf`);
}
