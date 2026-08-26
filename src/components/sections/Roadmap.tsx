import { Reveal } from "@/components/Reveal";

const phases = [
  {
    phase: "Phase 01",
    title: "Foundation",
    status: "Building",
    items: [
      "Website",
      "Wallet connection",
      "Chainmail identity",
      "Message signing",
      "Message verification",
      "Arc integration",
    ],
  },
  {
    phase: "Phase 02",
    title: "Private Communication",
    status: "Coming Next",
    items: [
      "PGP integration",
      "Encrypted messaging",
      "Secure attachments",
      "Improved identity verification",
    ],
  },
  {
    phase: "Phase 03",
    title: "On-Chain Payments",
    status: "Future",
    items: [
      "USDC payment requests",
      "Payment links",
      "Invoices",
      "Payment confirmations",
    ],
  },
  {
    phase: "Phase 04",
    title: "Agentic Communication",
    status: "Future",
    items: [
      "AI agent identities",
      "Agent-to-agent communication",
      "Machine-verifiable messages",
      "Automated payment requests",
    ],
  },
];

export function Roadmap() {
  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-title"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
    >
      <p className="text-xs font-semibold tracking-[0.24em] text-violet uppercase">
        Roadmap
      </p>
      <h2 id="roadmap-title" className="mt-3 text-3xl font-bold sm:text-4xl">
        Built in stages, not promises.
      </h2>
      <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {phases.map((p, i) => (
          <Reveal as="li" key={p.phase} delay={i * 80} className="panel panel-hover p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                {p.phase}
              </span>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                  p.status === "Building"
                    ? "border-turquoise/50 text-turquoise"
                    : p.status === "Coming Next"
                      ? "border-electric/50 text-electric"
                      : "border-border text-muted-foreground"
                }`}
              >
                {p.status}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
            <ul className="mt-3 space-y-2">
              {p.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan/70"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
