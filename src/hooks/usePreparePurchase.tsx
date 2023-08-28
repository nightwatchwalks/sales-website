// This hook is used to prepare purchase transactions and send them.
// When the transaction is completed, returns the transaction data.
// usePurchase hook should be used to get translated transaction data.

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Hash, Hex, parseEther } from "viem";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import nwVendorAbi from "../../abi/NightWatchVendor.abi.json";
import { config } from "@/config";
import { NWContext } from "@/context";

export interface usePreparePurchaseType {
  purchase: (amount: number) => Promise<void>;
  isLoading: boolean;
  isWriteLoading: boolean;
  isWaitLoading: boolean;
  isWriteError: boolean;
  isWaitError: boolean;
  customLoading: boolean;
  writeError: Error | null;
  waitError: Error | null;
  isSuccess: boolean;
  txData: any;
  setCustomPurchaseData: (hash: Hash | null) => void;
  loadingState: string | undefined;
  anySuccess: boolean;
  buyingFor: Hex | undefined;
  setBuyingFor: (address: Hex | undefined) => void;
}

export function usePreparePurchaseCtx(): usePreparePurchaseType {
  const nightWatchVendorContract = config.addresses.vendor;

  const { address, isConnected } = useAccount();

  const [customLoading, setCustomLoading] = useState(false);
  const [customHash, setCustomHash] = useState<Hash | null>(null);
  const [loadingState, setLoadingState] = useState<string | undefined>();
  const [anySuccess, setAnySuccess] = useState(false);
  const [buyingFor, setBuyingForState] = useState<Hex | undefined>(address);
  const [firstLoad, setFirstLoad] = useState(true);

  const {
    data: writeData,
    error: writeError,
    isError: isWriteError,
    writeAsync,
    reset,
    isLoading: isContractWriteLoading,
  } = useContractWrite({
    address: nightWatchVendorContract,
    abi: nwVendorAbi,
    functionName: "purchaseTokens",
  });

  const {
    data: txData,
    isSuccess,
    error: waitError,
    isError: isWaitError,
    isLoading: isTransactionLoading,
    refetch,
  } = useWaitForTransaction({
    hash: customHash ?? writeData?.hash,
  });

  const setBuyingFor = useCallback(
    (buyingFor_) => {
      if (buyingFor === buyingFor_) return;
      setBuyingForState(buyingFor_);
      setAnySuccess(false);
      setLoadingState(undefined);
      setCustomLoading(false);
      setCustomHash(null);
      reset();
    },
    [buyingFor, reset],
  );

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }
    if (buyingFor && address && address !== buyingFor) {
      location.reload();
      return;
    }

    setBuyingFor(address);
  }, [address, buyingFor, firstLoad, setBuyingFor]);

  useEffect(() => {
    if (isSuccess) {
      setAnySuccess(true);
    }
  }, [isSuccess]);

  const isLoading = useMemo(() => {
    return isTransactionLoading || isContractWriteLoading || customLoading;
  }, [isTransactionLoading, isContractWriteLoading, customLoading]);

  const purchase = useCallback(
    async (amount: number) => {
      if (!isConnected) {
        return;
      }

      if (!writeAsync) {
        return;
      }

      setCustomLoading(true);
      setLoadingState("TRANSACTION WAITING FOR CONFIRMATION...");

      try {
        await writeAsync({
          args: [amount, buyingFor],
          value: parseEther((amount * config.pricePerToken).toString()),
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingState(undefined);
        setCustomLoading(false);
      }
    },
    [buyingFor, isConnected, writeAsync],
  );

  const setCustomPurchaseData = useCallback(
    async (hash: Hash | null) => {
      if (!hash) {
        setCustomHash(null);
        return;
      }

      setCustomLoading(true);
      setCustomHash(hash);
      setLoadingState("UNCLAIMED TOKENS LOADING...");
      await delay(100);
      refetch();
      setCustomLoading(false);
      setLoadingState(undefined);
    },
    [setCustomHash, refetch],
  );

  return {
    isLoading,
    isSuccess,
    isWriteError,
    writeError,
    isWaitError,
    waitError,
    isWriteLoading: isContractWriteLoading,
    isWaitLoading: isTransactionLoading,
    customLoading,
    purchase,
    txData,
    setCustomPurchaseData,
    loadingState,
    anySuccess,
    buyingFor,
    setBuyingFor,
  };
}

export function usePreparePurchase() {
  const { usePreparePurchase } = useContext(NWContext);

  if (!usePreparePurchase) {
    throw new Error("You can't use usePreparePurchase outside of NWProvider");
  }

  return usePreparePurchase;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
