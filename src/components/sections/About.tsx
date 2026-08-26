import { Reveal } from "@/components/Reveal";
import { Info } from "lucide-react";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
    >
      <Reveal className="panel p-8 sm:p-12">
        <p className="text-xs font-semibold tracking-[0.24em] text-cyan uppercase">
          What is CHAINMAIL?
        </p>
        <h2 id="about-title" className="mt-3 text-3xl font-bold sm:text-4xl">
          Communication You Can Verify.
        </h2>
        <p className="mt-5 max-w-3xl text-base text-muted-foreground">
          Traditional communication relies heavily on centralized trust. CHAINMAIL explores a
          blockchain-backed approach where sender identity, cryptographic signatures, and
          verification data can establish a verifiable origin for digital communication.
        </p>
        <div className="mt-6 flex max-w-3xl gap-3 rounded-xl border border-border bg-surface/40 p-4">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-turquoise" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            <strong className="font-semibold text-foreground">Technical note:</strong> Private
            message content should remain off-chain. Blockchain should be used for identity,
            verification metadata, and proofs where appropriate.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
