import { useEffect, useState } from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import {
  ShieldCheck,
  ShieldX,
  FlaskConical,
  ChevronRight,
  Play,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { useIdentity } from "@/hooks/useIdentity";
import { DemoBadge } from "@/components/IdentityCard";
import { NetworkPrompt } from "@/components/NetworkPrompt";
import { VerificationDetails } from "@/components/VerificationDetails";
import { arcConfig } from "@/services/blockchain/arc";
import { verifyWithReport } from "@/services/verification/orchestrator";
import {
  demoHandle,
  demoMessage,
  demoSignature,
  demoStages,
  runDemoVerification,
  type DemoStageId,
} from "@/services/verification/demo";
import { decodeReport } from "@/services/report/verificationReport";
import { type VerificationReport } from "@/services/verification/steps";
import { z } from "zod";

export const Route = createFileRoute("/app/verify")({
  head: () => ({
    meta: [
      { title: "Verify — CHAINMAIL App" },
      {
        name: "description",
        content:
          "Verify a PGP-linked signed message. Walk through a guided end-to-end demo without touching a wallet.",
      },
      { property: "og:title", content: "Verify — CHAINMAIL App" },
      {
        property: "og:description",
        content:
          "Verify a PGP-linked signed message. Walk through a guided end-to-end demo without touching a wallet.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/app/verify" },
    ],
    links: [{ rel: "canonical", href: "/app/verify" }],
  }),
  component: Verify,
});

const Mode = z.enum(["live", "demo"]);
type Mode = z.infer<typeof Mode>;

type VerifySearch = {
  r?: string;
  m?: string;
};

const handleSchema = z
  .string()
  .min(3, "Handle must be at least 3 characters.")
  .max(20, "Handle must be at most 20 characters.")
  .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers or underscores only.");

function Verify() {
  const { address, chainId, wrongNetwork } = useWallet();
  const { identity } = useIdentity();
  const search = useSearch({ from: "/app/verify" }) as VerifySearch;

  const [mode, setMode] = useState<Mode>(address ? "live" : "demo");
  const [sharedReport, setSharedReport] = useState<VerificationReport | null>(null);
  const [sharedReportError, setSharedReportError] = useState<string | null>(null);

  const [message, setMessage] = useState(address ? "" : demoMessage);
  const [signature, setSignature] = useState("");
  const [sender, setSender] = useState(address ?? "");
  const [handle, setHandle] = useState(demoHandle);
  const [handleError, setHandleError] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<VerificationReport | null>(null);

  const [demoStage, setDemoStage] = useState<DemoStageId>("identity");
  const [copiedSig, setCopiedSig] = useState(false);
  const [demoSigReady, setDemoSigReady] = useState(false);

  useEffect(() => {
    if (!search.r) return;
    const parsed = decodeReport(search.r);
    if (!parsed) {
      setSharedReportError("This shared link is corrupted or in an unsupported format.");
      return;
    }
    setSharedReport(parsed);
  }, [search.r]);

  useEffect(() => {
    setError(null);
    setReport(null);
    if (mode === "demo") {
      setMessage(demoMessage);
      setSender(demoHandle.startsWith("@") ? demoHandle : `@${demoHandle}`);
    } else if (address) {
      setSender(address);
      setMessage("");
    }
    setSignature("");
    setDemoSigReady(false);
  }, [mode, address]);

  const onVerifyLive = async () => {
    setError(null);
    setReport(null);
    if (!message.trim() || !signature.trim() || !sender.trim()) {
      setError("Provide the sender address, the message and the signature.");
      return;
    }
    setBusy(true);
    try {
      const res = await verifyWithReport({
        sender: sender.trim(),
        message,
        signature: signature.trim(),
        ...(identity ? { identity: `@${identity.handle}` } : {}),
        chainId,
        expectedChainId: arcConfig.chainId,
      });
      setReport(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setBusy(false);
    }
  };

  const prepareDemoSignature = async () => {
    const parsed = handleSchema.safeParse(handle.replace(/^@/, ""));
    if (!parsed.success) {
      setHandleError(parsed.error.issues[0]?.message ?? "Invalid handle format.");
      setDemoSigReady(false);
      return;
    }
    setHandleError(null);
    try {
      const sig = await demoSignature(parsed.data, demoMessage);
      setSignature(sig);
      setDemoSigReady(true);
    } catch {
      setHandleError("Could not generate a demo signature for this handle.");
    }
  };

  const copyDemoSignature = async () => {
    try {
      await navigator.clipboard.writeText(signature);
      setCopiedSig(true);
      setTimeout(() => setCopiedSig(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const onVerifyDemo = async () => {
    setError(null);
    setReport(null);
    const parsed = handleSchema.safeParse(handle.replace(/^@/, ""));
    if (!parsed.success) {
      setHandleError(parsed.error.issues[0]?.message ?? "Invalid handle format.");
      return;
    }
    setHandleError(null);
    if (!message.trim()) {
      setError("A message is required to run the demo verification.");
      return;
    }
    if (!signature.trim()) {
      setError("Generate or paste the simulated PGP signature first.");
      return;
    }
    setBusy(true);
    try {
      const res = await runDemoVerification(parsed.data, message, signature);
      setReport(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo verification failed.");
    } finally {
      setBusy(false);
    }
  };

  const resetAll = () => {
    setError(null);
    setReport(null);
    setSharedReport(null);
    setSharedReportError(null);
    setHandleError(null);
    if (mode === "demo") {
      setMessage(demoMessage);
      setHandle(demoHandle);
      setSignature("");
      setDemoSigReady(false);
      setSender(`@${demoHandle}`);
      setDemoStage("identity");
    } else {
      setMessage("");
      setSignature("");
      setSender(address ?? "");
    }
  };

  const activeStageIndex = demoStages.findIndex((s) => s.id === demoStage);
  const finalReport = report ?? sharedReport;
  const finalReportMode = finalReport?.mode ?? mode;

  return (
    <div className="space-y-6">
      <header>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Verify Message</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Recover the signing address from a message and signature. You can also run a
              guided end-to-end demo.
            </p>
          </div>
          <div
            role="tablist"
            aria-label="Verification mode"
            className="inline-flex rounded-full border border-border p-1"
          >
            <button
              role="tab"
              aria-selected={mode === "live"}
              onClick={() => setMode("live")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors ${
                mode === "live"
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Live
            </button>
            <button
              role="tab"
              aria-selected={mode === "demo"}
              onClick={() => setMode("demo")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-colors ${
                mode === "demo"
                  ? "bg-violet/15 text-violet shadow-sm ring-1 ring-violet/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
              Demo
            </button>
          </div>
        </div>
      </header>

      <NetworkPrompt />

      {sharedReportError && (
        <section
          role="alert"
          className="panel border-destructive/50 p-5 text-sm text-destructive"
        >
          {sharedReportError}
        </section>
      )}

      {sharedReport && !report && (
        <section
          role="status"
          className="panel border-cyan/40 p-5 text-sm"
        >
          <p className="font-semibold text-foreground">Shared report loaded</p>
          <p className="mt-1 text-muted-foreground">
            This report was generated from a shareable link. Review the verification steps
            below or run a fresh verification to regenerate it.
          </p>
        </section>
      )}

      {mode === "demo" && (
        <section className="panel p-6" aria-labelledby="demo-guide-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2
                id="demo-guide-title"
                className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase"
              >
                Guided demo
              </h2>
              <DemoBadge />
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {demoStages.map((s, i) => (
                <span
                  key={s.id}
                  aria-hidden="true"
                  className={`h-1.5 w-8 rounded-full ${
                    i <= activeStageIndex ? "bg-violet" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>

          <ol className="mt-5 space-y-3">
            {demoStages.map((s, i) => {
              const active = i === activeStageIndex;
              const done = i < activeStageIndex;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setDemoStage(s.id)}
                    className={`w-full rounded-xl border p-4 text-left transition-colors ${
                      active
                        ? "border-violet/50 bg-violet/10"
                        : done
                          ? "border-border bg-surface/40"
                          : "border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            active || done ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {s.title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                      </div>
                      {active ? (
                        <ChevronRight className="h-4 w-4 shrink-0 text-violet" aria-hidden="true" />
                      ) : done ? (
                        <Check className="h-4 w-4 shrink-0 text-turquoise" aria-hidden="true" />
                      ) : null}
                    </div>
                    {active && (
                      <p className="mt-3 text-xs text-violet/90">{s.detail}</p>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <form
        className="panel space-y-5 p-6"
        onSubmit={(e) => {
          e.preventDefault();
          void (mode === "demo" ? onVerifyDemo() : onVerifyLive());
        }}
      >
        {mode === "demo" ? (
          <>
            <div>
              <label htmlFor="demo-handle" className="text-sm font-medium">
                Demo @handle
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-input bg-surface/50 px-4">
                <span className="font-mono text-sm text-muted-foreground">@</span>
                <input
                  id="demo-handle"
                  value={handle}
                  onChange={(e) => {
                    setHandle(e.target.value);
                    setDemoSigReady(false);
                  }}
                  placeholder={demoHandle}
                  className="w-full bg-transparent py-3 text-sm outline-none"
                />
              </div>
              {handleError && (
                <p role="alert" className="mt-2 text-xs text-destructive">
                  {handleError}
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                3–20 characters: letters, numbers or underscores.
              </p>
            </div>

            <div>
              <label htmlFor="demo-message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="demo-message"
                rows={5}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setDemoSigReady(false);
                }}
                className="mt-2 w-full rounded-xl border border-input bg-surface/50 px-4 py-3 text-sm"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor="demo-signature" className="text-sm font-medium">
                  Simulated PGP signature
                </label>
                <button
                  type="button"
                  onClick={() => void prepareDemoSignature()}
                  className="inline-flex items-center gap-1.5 rounded-full border border-violet/40 bg-violet/10 px-3 py-1.5 text-xs font-semibold text-violet"
                >
                  <Play className="h-3 w-3" aria-hidden="true" />
                  Generate signature
                </button>
              </div>
              <textarea
                id="demo-signature"
                rows={3}
                value={signature}
                onChange={(e) => {
                  setSignature(e.target.value);
                  setDemoSigReady(false);
                }}
                placeholder="Paste or generate a SIMULATED-PGP signature…"
                className="mt-2 w-full rounded-xl border border-input bg-surface/50 px-4 py-3 font-mono text-xs"
              />
              {demoSigReady && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-turquoise/40 bg-turquoise/10 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-turquoise uppercase">
                    Simulated signature ready
                  </span>
                  <button
                    type="button"
                    onClick={copyDemoSignature}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold"
                  >
                    {copiedSig ? (
                      <Check className="h-3 w-3 text-turquoise" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3 w-3" aria-hidden="true" />
                    )}
                    {copiedSig ? "Copied" : "Copy signature"}
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="v-message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="v-message"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 w-full rounded-xl border border-input bg-surface/50 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label htmlFor="v-signature" className="text-sm font-medium">
                Signature
              </label>
              <textarea
                id="v-signature"
                rows={3}
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="0x…"
                className="mt-2 w-full rounded-xl border border-input bg-surface/50 px-4 py-3 font-mono text-xs"
              />
            </div>
            <div>
              <label htmlFor="v-sender" className="text-sm font-medium">
                Claimed sender address
              </label>
              <input
                id="v-sender"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="0x…"
                className="mt-2 w-full rounded-xl border border-input bg-surface/50 px-4 py-3 font-mono text-xs"
              />
              {identity && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Local identity: <span className="font-semibold text-foreground">@{identity.handle}</span>
                </p>
              )}
              {wrongNetwork && (
                <p role="alert" className="mt-2 text-xs text-destructive">
                  You are on the wrong network. Use Switch to Arc above for canonical
                  verification context.
                </p>
              )}
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={busy}
            className="rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            {busy ? "Verifying…" : mode === "demo" ? "Run demo verification" : "Verify"}
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset
          </button>
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </form>

      {finalReport && (
        <>
          <section
            role="status"
            className={`panel p-6 ${
              finalReport.verified ? "border-turquoise/50" : "border-destructive/50"
            }`}
          >
            <div className="flex flex-wrap items-center gap-3">
              {finalReport.verified ? (
                <ShieldCheck className="h-6 w-6 text-turquoise" aria-hidden="true" />
              ) : (
                <ShieldX className="h-6 w-6 text-destructive" aria-hidden="true" />
              )}
              <div>
                <h2 className="text-lg font-semibold">
                  {finalReport.verified ? "Verified" : "Not verified"}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Mode:{" "}
                  <span
                    className={
                      finalReportMode === "demo"
                        ? "font-semibold text-violet"
                        : "font-semibold text-foreground"
                    }
                  >
                    {finalReportMode === "demo" ? "DEMO · simulated" : "Live wallet signature"}
                  </span>
                </p>
              </div>
            </div>
            {finalReport.verified ? (
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Identity</dt>
                  <dd className="font-semibold">{finalReport.identity ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Recovered signer</dt>
                  <dd className="font-mono break-all">{finalReport.recovered ?? "—"}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                {finalReport.steps.find((s: { status: string }) => s.status === "failed")?.detail ??
                  "The message could not be verified."}
              </p>
            )}
          </section>

          <VerificationDetails report={finalReport} />
        </>
      )}
    </div>
  );
}
