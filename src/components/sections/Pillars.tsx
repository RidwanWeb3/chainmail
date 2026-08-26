import { Fingerprint, ShieldCheck, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const pillars = [
  {
    icon: Fingerprint,
    title: "Identity",
    copy: "A Chainmail identity binds communication to a verifiable cryptographic key.",
  },
  {
    icon: ShieldCheck,
    title: "Authentication",
    copy: "Messages are signed, so the sender can be established cryptographically.",
  },
  {
    icon: BadgeCheck,
    title: "Verification",
    copy: "Recipients check the signature against the claimed sender and identity.",
  },
];

export function Pillars() {
  return (
    <section
      aria-labelledby="pillars-title"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
    >
      <h2 id="pillars-title" className="sr-only">
        Trust pillars
      </h2>
      <p className="text-center text-sm font-medium tracking-[0.24em] text-muted-foreground uppercase">
        Trust the sender. Verify the message.
      </p>
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {pillars.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 90} className="panel panel-hover p-6">
            <p.icon className="h-6 w-6 text-cyan" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold tracking-[0.16em] uppercase">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.copy}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
