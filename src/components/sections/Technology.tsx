import { Reveal } from "@/components/Reveal";
import { FlowDiagram } from "@/components/FlowDiagram";
import { PGP_STATUS } from "@/services/verification/pgp";

const original = [
  "PGP identities",
  "Email address registration",
  "PGP fingerprint registration",
  "Sender address registration",
  "Email message registration",
  "Email verification",
  "Smart contract interaction",
];

export function Technology() {
  return (
    <section
      id="technology"
      aria-labelledby="tech-title"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
    >
      <p className="text-xs font-semibold tracking-[0.24em] text-cyan uppercase">Technology</p>
      <h2 id="tech-title" className="mt-3 text-3xl font-bold sm:text-4xl">
        From the original Chainmail architecture.
      </h2>
      <p className="mt-5 max-w-3xl text-base text-muted-foreground">
        The original Chainmail implementation demonstrates a blockchain-backed email authentication
        architecture using PGP identities, fingerprints, sender addresses, and registered messages.
        Those components are the conceptual reference for this project — they are not all rebuilt in
        this frontend.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Reveal className="panel p-7">
          <h3 className="text-lg font-semibold">Original architecture (reference)</h3>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {original.map((o) => (
              <li key={o} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet"
                />
                {o}
              </li>
            ))}
          </ul>
          <p className="mt-5 rounded-xl border border-border bg-surface/40 p-4 text-sm text-muted-foreground">
            V1 uses wallet-based message signatures as the web-native authentication mechanism.{" "}
            {PGP_STATUS}.
          </p>
        </Reveal>

        <Reveal delay={100} className="panel p-7">
          <h3 className="text-lg font-semibold">Modernized direction</h3>
          <FlowDiagram
            className="mt-6"
            steps={[
              "PGP / Cryptographic Identity",
              "Chainmail Layer",
              "Blockchain Trust",
              "Arc",
              "Verification",
            ]}
          />
        </Reveal>
      </div>
    </section>
  );
}
