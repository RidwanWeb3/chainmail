import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import {
  clearIdentity,
  isValidHandle,
  loadIdentity,
  saveIdentity,
  type ChainmailIdentity,
} from "@/services/identity/identity";

export function useIdentity() {
  const { address } = useWallet();
  const [identity, setIdentity] = useState<ChainmailIdentity | null>(null);

  useEffect(() => {
    setIdentity(address ? loadIdentity(address) : null);
  }, [address]);

  const claim = useCallback(
    (handle: string) => {
      if (!address) throw new Error("Connect a compatible wallet to continue.");
      if (!isValidHandle(handle)) {
        throw new Error("Use 3–20 characters: letters, numbers or underscores.");
      }
      setIdentity(saveIdentity(address, handle));
    },
    [address],
  );

  const release = useCallback(() => {
    if (!address) return;
    clearIdentity(address);
    setIdentity(null);
  }, [address]);

  return { identity, claim, release };
}
