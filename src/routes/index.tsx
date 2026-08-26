import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { Problem } from "@/components/sections/Problem";
import { About } from "@/components/sections/About";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { BuiltOnArc } from "@/components/sections/BuiltOnArc";
import { Technology } from "@/components/sections/Technology";
import { OpenSource } from "@/components/sections/OpenSource";
import { Roadmap } from "@/components/sections/Roadmap";
import { ContractSection } from "@/components/sections/ContractSection";
import { CTA } from "@/components/sections/CTA";

const TITLE = "CHAINMAIL — Verified Communication for the On-Chain Era";
const DESCRIPTION =
  "CHAINMAIL brings cryptographic identity and blockchain-backed verification to digital communication, built on Arc.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content:
          "Chainmail, blockchain email, Web3 communication, message verification, cryptographic identity, on-chain identity, Arc, blockchain authentication, PGP, secure communication",
      },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "/assets/chainmail-banner.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: "/assets/chainmail-banner.png" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "CHAINMAIL",
          description: DESCRIPTION,
          url: "/",
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Pillars />
        <Problem />
        <About />
        <HowItWorks />
        <Features />
        <BuiltOnArc />
        <Technology />
        <OpenSource />
        <Roadmap />
        <ContractSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
