import { Fingerprint, ShieldCheck, Blocks, EyeOff } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const features = [
  {
    icon: Fingerprint,
    title: "Cryptographic Identity",
    copy: "Associate communication with a verifiable cryptographic identity.",
  },
  {
    icon: ShieldCheck,
    title: "Message Verification",
    copy: "Verify that a signed message corresponds to the claimed sender.",
  },
  {
    icon: Blocks,
    title: "Blockchain-backed Trust",
    copy: "Use blockchain infrastructure as a verifiable trust layer.",
  },
  {
    icon: EyeOff,
    title: "Privacy by Design",
    copy: "Keep private communication data off-chain and use blockchain for verification-related information.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
    >
      <p className="text-xs font-semibold tracking-[0.24em] text-violet uppercase">
        Core Features
      </p>
      <h2 id="features-title" className="mt-3 text-3xl font-bold sm:text-4xl">
        Infrastructure for verifiable communication.
      </h2>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <Reveal as="li" key={f.title} delay={i * 80} className="panel panel-hover p-6">
            <span
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface/60"
              aria-hidden="true"
            >
              <f.icon className="h-5 w-5 text-cyan" />
            </span>
            <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.copy}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
