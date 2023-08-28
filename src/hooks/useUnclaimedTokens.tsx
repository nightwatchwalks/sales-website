import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { NWPurchaseContext } from "@/context";
import { usePreparePurchase } from "./usePreparePurchase";

export interface useUnclaimedTokensType {
  isLoading: boolean;
}

export function useUnclaimedTokensCtx(): useUnclaimedTokensType {
  const {
    setCustomPurchaseData,
    txData,
    isSuccess,
    isLoading: isPreparePurchaseLoading,
    anySuccess,
    buyingFor,
  } = usePreparePurchase();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getUnclaimedTokens = async () => {
      if (!buyingFor || isSuccess || anySuccess || isPreparePurchaseLoading) {
        setLoading(false);
        return;
      }

      try {
        const claimRes = await fetch(
          "/api/getClaimTokens?receiver=" + buyingFor,
        );
        if (claimRes.ok) {
          const { transactionHash } = await claimRes.json();
          if (txData && txData.hash === transactionHash) return;
          setCustomPurchaseData(transactionHash);
        }
      } catch (e) {
        console.error("Error getting unclaimed tokens", e);
      } finally {
        setLoading(false);
      }
    };

    if (!txData) {
      setLoading(true);
      getUnclaimedTokens();
    }
  }, [buyingFor]);

  return {
    isLoading,
  };
}

export function useUnclaimedTokens() {
  const { useUnclaimedTokens } = useContext(NWPurchaseContext);

  if (!useUnclaimedTokens) {
    throw new Error("You can't use useUnclaimedTokens outside of NWProvider");
  }

  return useUnclaimedTokens;
}
