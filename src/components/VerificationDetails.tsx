import { CheckCircle2, XCircle, MinusCircle, FlaskConical, Download, Link2, Check } from "lucide-react";
import { useState } from "react";
import {
  formatTimestamp,
  statusLabel,
  type StepStatus,
  type VerificationReport,
} from "@/services/verification/steps";
import { downloadReportPdf, shareLink } from "@/services/report/verificationReport";
import { DEMO_NOTICE } from "@/services/verification/demo";

const icon: Record<StepStatus, typeof CheckCircle2> = {
  passed: CheckCircle2,
  failed: XCircle,
  skipped: MinusCircle,
  simulated: FlaskConical,
};

const tone: Record<StepStatus, string> = {
  passed: "text-turquoise",
  failed: "text-destructive",
  skipped: "text-muted-foreground",
  simulated: "text-violet",
};

export function VerificationDetails({ report }: { report: VerificationReport }) {
  const [copied, setCopied] = useState(false);
  const link = shareLink(report);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section className="panel p-6" aria-labelledby="verification-details-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="verification-details-title" className="text-lg font-semibold">
          Verification details
        </h2>
        <span className="font-mono text-xs text-muted-foreground">{report.id}</span>
      </div>

      {report.mode === "demo" && (
        <p className="mt-3 rounded-xl border border-violet/50 bg-violet/10 px-4 py-3 text-xs font-semibold tracking-wide text-violet">
          {DEMO_NOTICE}
        </p>
      )}

      <ol className="mt-5 space-y-4">
        {report.steps.map((s) => {
          const Icon = icon[s.status];
          return (
            <li key={s.id} className="flex gap-3">
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${tone[s.status]}`} aria-hidden="true" />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                  {s.label}
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${tone[s.status]}`}>
                    {statusLabel[s.status]}
                  </span>
                </p>
                <p className="mt-1 text-sm break-words text-muted-foreground">{s.detail}</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {formatTimestamp(s.timestamp)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => downloadReportPdf(report)}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download PDF report
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground"
        >
          {copied ? (
            <Check className="h-4 w-4 text-turquoise" aria-hidden="true" />
          ) : (
            <Link2 className="h-4 w-4" aria-hidden="true" />
          )}
          {copied ? "Link copied" : "Copy shareable link"}
        </button>
      </div>
      <p className="mt-3 font-mono text-[11px] break-all text-muted-foreground">{link}</p>
    </section>
  );
}
