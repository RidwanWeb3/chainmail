/**
 * Arc network configuration.
 *
 * All values come from environment variables so the official Arc parameters can
 * be verified and set before production deployment. Nothing here is guessed and
 * no legacy Goerli/Anvil configuration from the original repository is reused.
 */

export type ArcConfig = {
  chainId: number | null;
  chainIdHex: string | null;
  rpcUrl: string | null;
  explorerUrl: string | null;
  configured: boolean;
};

function envValue(value: unknown): string | null {
  const v = typeof value === "string" ? value.trim() : "";
  return v.length > 0 ? v : null;
}

const rawChainId = envValue(import.meta.env["VITE_ARC_CHAIN_ID"]);
const parsedChainId = rawChainId ? Number(rawChainId) : NaN;

export const arcConfig: ArcConfig = {
  chainId: Number.isFinite(parsedChainId) ? parsedChainId : null,
  chainIdHex: Number.isFinite(parsedChainId) ? `0x${parsedChainId.toString(16)}` : null,
  rpcUrl: envValue(import.meta.env["VITE_ARC_RPC_URL"]),
  explorerUrl: envValue(import.meta.env["VITE_ARC_EXPLORER_URL"]),
  configured: Number.isFinite(parsedChainId),
};

export const contractAddress = envValue(
  import.meta.env["VITE_CHAINMAIL_CONTRACT_ADDRESS"],
);

export const xUrl = envValue(import.meta.env["VITE_CHAINMAIL_X_URL"]);

export const GITHUB_URL = "https://github.com/zepeng811/chainmail";
export const BUY_URL = "https://radardex.pro";

export function explorerAddressUrl(address: string): string | null {
  if (!arcConfig.explorerUrl) return null;
  return `${arcConfig.explorerUrl.replace(/\/$/, "")}/address/${address}`;
}

export function shortenAddress(address: string, size = 4): string {
  if (address.length <= size * 2 + 2) return address;
  return `${address.slice(0, size + 2)}...${address.slice(-size)}`;
}
