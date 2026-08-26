import { HelpCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const claimants = ["a person", "a company", "a protocol", "a DAO", "an organization"];

export function Problem() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-title"
      className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6"
    >
      <Reveal className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-violet uppercase">
            The Problem
          </p>
          <h2 id="problem-title" className="mt-3 text-3xl font-bold sm:text-4xl">
            Can You Trust the Sender?
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Digital communication can be difficult to authenticate. A recipient may receive a
            message claiming to come from anyone at all.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {claimants.map((c) => (
              <li
                key={c}
                className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground"
              >
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-base text-muted-foreground">
            But the recipient still needs a way to establish one thing.
          </p>
        </div>

        <div className="panel p-8 text-center">
          <HelpCircle className="mx-auto h-8 w-8 text-purple" aria-hidden="true" />
          <p className="mt-5 text-2xl font-bold sm:text-3xl">Who actually sent it?</p>
          <p className="mt-4 text-sm text-muted-foreground">
            CHAINMAIL addresses this with cryptographic identity and blockchain-backed verification.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
