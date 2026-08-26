import { Reveal } from "@/components/Reveal";
import { FlowDiagram } from "@/components/FlowDiagram";

const steps = [
  {
    n: "01",
    title: "Identity",
    copy: "Establish a Chainmail identity associated with a wallet.",
  },
  { n: "02", title: "Sign", copy: "Cryptographically sign communication." },
  {
    n: "03",
    title: "Register",
    copy: "Register the relevant identity or verification information.",
  },
  {
    n: "04",
    title: "Verify",
    copy: "Allow the recipient to verify the authenticity of the message.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
    >
      <p className="text-xs font-semibold tracking-[0.24em] text-cyan uppercase">How It Works</p>
      <h2 id="how-title" className="mt-3 text-3xl font-bold sm:text-4xl">
        Four steps to a verifiable message.
      </h2>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_0.7fr] lg:items-center">
        <ol className="grid gap-4 sm:grid-cols-2">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 90} className="panel panel-hover p-6">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="node-pulse h-2.5 w-2.5 rounded-full bg-cyan" />
                <span className="font-mono text-sm text-muted-foreground">{s.n}</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold tracking-[0.16em] uppercase">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.copy}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <FlowDiagram steps={["Identity", "Sign", "Register", "Verify"]} />
        </Reveal>
      </div>
    </section>
  );
}
