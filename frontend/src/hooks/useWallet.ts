import { useState, useEffect, useCallback } from "react";
import {
  isConnected,
  getAddress,
  signTransaction,
  isAllowed,
  setAllowed,
  getNetwork,
} from "@stellar/freighter-api";
import { NETWORK } from "../contracts/tourism-passport";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFreighter, setHasFreighter] = useState(false);

  // Check if Freighter is available
  useEffect(() => {
    const checkFreighter = async () => {
      try {
        const connected = await isConnected();
        setHasFreighter(connected);
        
        if (connected) {
          const allowed = await isAllowed();
          if (allowed) {
            const addr = await getAddress();
            if (addr.address) {
              setAddress(addr.address);
              setConnected(true);
            }
          }
        }
      } catch (err) {
        console.log("Freighter not detected");
        setHasFreighter(false);
      } finally {
        setLoading(false);
      }
    };
    checkFreighter();
  }, []);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const isFreighterConnected = await isConnected();
      if (!isFreighterConnected) {
        throw new Error("Vui lòng cài đặt Freighter Wallet extension");
      }

      await setAllowed();
      const addr = await getAddress();
      
      if (addr.address) {
        // Verify network
        const network = await getNetwork();
        if (network.network !== NETWORK) {
          throw new Error(`Vui lòng chuyển Freighter sang ${NETWORK}`);
        }
        
        setAddress(addr.address);
        setConnected(true);
      }
    } catch (err: any) {
      setError(err.message || "Không thể kết nối ví");
      console.error("Wallet connection error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setConnected(false);
  }, []);

  const sign = useCallback(
    async (txXDR: string, opts: any) => {
      try {
        const result = await signTransaction(txXDR, opts);
        return result.signedTxXdr;
      } catch (err: any) {
        throw new Error(err.message || "Người dùng từ chối ký giao dịch");
      }
    },
    []
  );

  const shortenAddress = useCallback((addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  }, []);

  return {
    address,
    connected,
    loading,
    error,
    hasFreighter,
    connect,
    disconnect,
    signTransaction: sign,
    shortenAddress,
  };
}
