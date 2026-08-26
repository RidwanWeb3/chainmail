import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { arcConfig, walletAddEthereumChainParams } from "@/services/blockchain/arc";

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
  on?: (event: string, handler: (...args: never[]) => void) => void;
  removeListener?: (event: string, handler: (...args: never[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}

export type WalletState = {
  address: string | null;
  chainId: number | null;
  connecting: boolean;
  error: string | null;
  hasProvider: boolean;
  wrongNetwork: boolean;
  switchingNetwork: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
  switchToArc: () => Promise<void>;
  clearError: () => void;
};

const WalletContext = createContext<WalletState | null>(null);

function getProvider(): Eip1193Provider | null {
  if (typeof window === "undefined") return null;
  return window.ethereum ?? null;
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasProvider, setHasProvider] = useState(false);

  useEffect(() => {
    const provider = getProvider();
    setHasProvider(Boolean(provider));
    if (!provider) return;

    const handleAccounts = (accounts: string[]) => {
      setAddress(accounts?.[0] ?? null);
    };
    const handleChain = (hex: string) => {
      setChainId(Number.parseInt(hex, 16));
    };

    provider
      .request({ method: "eth_accounts" })
      .then((accounts) => handleAccounts(accounts as string[]))
      .catch(() => undefined);
    provider
      .request({ method: "eth_chainId" })
      .then((hex) => handleChain(hex as string))
      .catch(() => undefined);

    provider.on?.("accountsChanged", handleAccounts as never);
    provider.on?.("chainChanged", handleChain as never);
    return () => {
      provider.removeListener?.("accountsChanged", handleAccounts as never);
      provider.removeListener?.("chainChanged", handleChain as never);
    };
  }, []);

  const connect = useCallback(async () => {
    const provider = getProvider();
    if (!provider) {
      setError("Connect a compatible wallet to continue.");
      return;
    }
    setConnecting(true);
    setError(null);
    try {
      const accounts = (await provider.request({
        method: "eth_requestAccounts",
      })) as string[];
      setAddress(accounts?.[0] ?? null);
      const hex = (await provider.request({ method: "eth_chainId" })) as string;
      setChainId(Number.parseInt(hex, 16));
    } catch (err) {
      const code = (err as { code?: number })?.code;
      setError(
        code === 4001
          ? "Wallet connection cancelled."
          : "Connect a compatible wallet to continue.",
      );
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setError(null);
  }, []);

  const signMessage = useCallback(
    async (message: string) => {
      const provider = getProvider();
      if (!provider || !address) {
        throw new Error("Connect a compatible wallet to continue.");
      }
      try {
        return (await provider.request({
          method: "personal_sign",
          params: [message, address],
        })) as string;
      } catch (err) {
        const code = (err as { code?: number })?.code;
        throw new Error(
          code === 4001
            ? "Signature request cancelled."
            : "The message could not be signed.",
        );
      }
    },
    [address],
  );

  const switchToArc = useCallback(async () => {
    const provider = getProvider();
    if (!provider || !arcConfig.chainIdHex) {
      setError("Arc network configuration is not available yet.");
      return;
    }
    setSwitchingNetwork(true);
    setError(null);
    try {
      try {
        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: arcConfig.chainIdHex }],
        });
      } catch (switchErr) {
        const code = (switchErr as { code?: number })?.code;
        if (code === 4902 || code === -32603) {
          const addParams = walletAddEthereumChainParams();
          if (!addParams) {
            setError("Arc is not configured. Check VITE_ARC_RPC_URL and chain ID.");
            return;
          }
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [addParams],
          });
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: arcConfig.chainIdHex }],
            });
          } catch {
            setError(`Please approve adding and switching to ${arcConfig.chainName}.`);
          }
        } else if (code === 4001) {
          setError("Network switch cancelled by the user.");
        } else {
          setError(`Please switch to ${arcConfig.chainName} in your wallet.`);
        }
      }
    } catch (addErr) {
      const code = (addErr as { code?: number })?.code;
      setError(
        code === 4001
          ? "Network add cancelled by the user."
          : `Unable to add ${arcConfig.chainName}. Configure it manually in your wallet using the RPC URL on the Settings page.`,
      );
    } finally {
      setSwitchingNetwork(false);
    }
  }, []);

  const value = useMemo<WalletState>(
    () => ({
      address,
      chainId,
      connecting,
      error,
      hasProvider,
      wrongNetwork:
        Boolean(address) && arcConfig.configured && chainId !== arcConfig.chainId,
      switchingNetwork,
      connect,
      disconnect,
      signMessage,
      switchToArc,
      clearError: () => setError(null),
    }),
    [
      address,
      chainId,
      connecting,
      error,
      hasProvider,
      switchingNetwork,
      connect,
      disconnect,
      signMessage,
      switchToArc,
    ],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletState {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
