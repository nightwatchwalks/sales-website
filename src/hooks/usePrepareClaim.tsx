import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import nwVendorAbi from "../../abi/NightWatchVendor.abi.json";
import { config } from "@/config";
import { NWPrepareClaimContext } from "@/context";
import { usePurchase } from "./usePurchase";
import { usePreparePurchase } from "./usePreparePurchase";

export interface usePrepareClaimType {
  claim: () => Promise<void>;
  isLoading: boolean;
  isWriteError: boolean;
  writeError: Error | null;
  isWaitError: boolean;
  waitError: Error | null;
  isSuccess: boolean;
  txData: any;
}

export function usePrepareClaimCtx(): usePrepareClaimType {
  const [customLoading, setCustomLoading] = useState(false);
  const nightWatchVendorContract = config.addresses.vendor;

  const { isConnected } = useAccount();

  const { isLoading: isPreparePurchaseLoading } = usePreparePurchase();

  const {
    signature,
    purchasedTokens,
    isLoading: isPurchaseLoading,
  } = usePurchase();
  const { buyingFor, isWaitLoading: isPurchaseWaitLoading } =
    usePreparePurchase();

  const {
    data: writeData,
    error: writeError,
    isError: isWriteError,
    write,
    isLoading: isContractWriteLoading,
    reset: resetWrite,
  } = useContractWrite({
    address: nightWatchVendorContract,
    abi: nwVendorAbi,
    functionName: "claimTokens",
  });

  const {
    data: txData,
    isSuccess,
    error: waitError,
    isError: isWaitError,
    isLoading: isTransactionLoading,
  } = useWaitForTransaction({
    hash: writeData?.hash,
    enabled: Boolean(writeData) && !isPurchaseWaitLoading,
  });

  const isLoading = useMemo(() => {
    return (
      isTransactionLoading ||
      isContractWriteLoading ||
      customLoading ||
      isPurchaseLoading ||
      isPreparePurchaseLoading
    );
  }, [
    isTransactionLoading,
    isContractWriteLoading,
    customLoading,
    isPurchaseLoading,
    isPreparePurchaseLoading,
  ]);

  const claim = useCallback(async () => {
    if (!isConnected) {
      return;
    }

    if (!write) {
      return;
    }

    setCustomLoading(true);

    write({
      args: [buyingFor, purchasedTokens.map((token) => token.id), signature],
    });
    setCustomLoading(false);
  }, [buyingFor, isConnected, purchasedTokens, signature, write]);

  useEffect(() => {
    if (isPurchaseWaitLoading) {
      resetWrite();
    }
  }, [isPurchaseWaitLoading, resetWrite]);

  return {
    isLoading,
    isSuccess,
    isWriteError,
    writeError,
    isWaitError,
    waitError,
    claim,
    txData,
  };
}

export function usePrepareClaim() {
  const { usePrepareClaim } = useContext(NWPrepareClaimContext);

  if (!usePrepareClaim) {
    throw new Error("You can't use usePrepareClaim outside of NWProvider");
  }

  return usePrepareClaim;
}
