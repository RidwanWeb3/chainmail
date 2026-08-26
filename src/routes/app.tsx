import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  PenSquare,
  ShieldCheck,
  Fingerprint,
  Settings as SettingsIcon,
  DollarSign,
} from "lucide-react";
import { WalletProvider, useWallet } from "@/hooks/useWallet";
import { WalletButton } from "@/components/WalletButton";
import { arcConfig } from "@/services/blockchain/arc";

const TITLE = "CHAINMAIL App — Sign and Verify Messages";
const DESCRIPTION =
  "Connect a wallet, establish a Chainmail identity, sign a message and verify signed communication on Arc.";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/app" },
    ],
    links: [{ rel: "canonical", href: "/app" }],
  }),
  component: AppLayout,
});

const nav = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/app/compose", label: "Compose", icon: PenSquare },
  { to: "/app/verify", label: "Verify", icon: ShieldCheck },
  { to: "/app/payments", label: "Payments", icon: DollarSign },
  { to: "/app/identity", label: "Identity", icon: Fingerprint },
  { to: "/app/settings", label: "Settings", icon: SettingsIcon },
] as const;

function AppLayout() {
  return (
    <WalletProvider>
      <AppShell />
    </WalletProvider>
  );
}

function AppShell() {
  const { address } = useWallet();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5" aria-label="CHAINMAIL home">
            <img
              src="/assets/chainmail-logo.png"
              alt="CHAINMAIL"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-base font-bold tracking-[0.18em]">CHAINMAIL</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground sm:inline-flex">
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${
                  arcConfig.configured ? "bg-turquoise node-pulse" : "bg-muted-foreground"
                }`}
              />
              Arc {arcConfig.configured ? "" : "· not configured"}
            </span>
            <WalletButton />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 pb-24 sm:px-6 lg:pb-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <nav aria-label="Dashboard navigation" className="sticky top-24 space-y-1">
            {nav.map((n) => {
              const active = n.to === "/app" ? pathname === "/app" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border border-border bg-surface/70 text-foreground"
                      : "text-muted-foreground hover:bg-surface/40 hover:text-foreground"
                  }`}
                >
                  <n.icon className="h-4 w-4" aria-hidden="true" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          {!address && (
            <p className="mt-6 rounded-xl border border-border p-4 text-xs text-muted-foreground">
              Exploring in demo mode. Connect a wallet to sign real messages.
            </p>
          )}
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>

      <nav
        aria-label="Dashboard navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
      >
        <ul className="mx-auto flex max-w-lg items-stretch justify-between px-2 py-1.5">
          {nav.slice(0, 4).map((n) => {
            const active = n.to === "/app" ? pathname === "/app" : pathname.startsWith(n.to);
            return (
              <li key={n.to} className="flex-1">
                <Link
                  to={n.to}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium ${
                    active ? "text-cyan" : "text-muted-foreground"
                  }`}
                >
                  <n.icon className="h-5 w-5" aria-hidden="true" />
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
