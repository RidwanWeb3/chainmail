import { Reveal } from "@/components/Reveal";
import { FlowDiagram } from "@/components/FlowDiagram";
import { arcConfig } from "@/services/blockchain/arc";

export function BuiltOnArc() {
  return (
    <section id="arc" aria-labelledby="arc-title" className="relative overflow-hidden py-20">
      <div aria-hidden="true" className="bg-grid absolute inset-0" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <Reveal className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-turquoise uppercase">
              Ecosystem
            </p>
            <h2 id="arc-title" className="mt-3 text-4xl font-bold sm:text-5xl">
              Built on <span className="text-gradient">Arc</span>
            </h2>
            <p className="mt-5 max-w-xl text-base text-muted-foreground">
              CHAINMAIL is designed to bring verifiable communication infrastructure into the Arc
              ecosystem.
            </p>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground">
              Network parameters are configuration-driven and verified before deployment. Legacy
              Ethereum/Goerli values from the original repository are treated as historical
              reference only.
            </p>
            <dl className="mt-7 grid gap-3 sm:grid-cols-3">
              {[
                ["Chain ID", arcConfig.chainId ? String(arcConfig.chainId) : "—"],
                ["RPC", arcConfig.rpcUrl ? "Configured" : "—"],
                ["Explorer", arcConfig.explorerUrl ? "Configured" : "—"],
              ].map(([k, v]) => (
                <div key={k} className="panel px-4 py-3">
                  <dt className="text-xs tracking-[0.16em] text-muted-foreground uppercase">{k}</dt>
                  <dd className="mt-1 font-mono text-sm text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">Powered by @Circle</p>
          </div>

          <FlowDiagram
            steps={[
              "Chainmail",
              "Cryptographic Identity",
              "Verification Layer",
              "Arc",
              "On-Chain Trust",
            ]}
          />
        </Reveal>
      </div>
    </section>
  );
}
