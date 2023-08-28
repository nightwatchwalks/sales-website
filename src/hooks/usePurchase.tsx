// This hook is used to get completed purchase transactions translated data.

import { useCallback, useContext, useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import nwAbi from "../../abi/NightWatch.abi.json";
import { config } from "@/config";
import { usePreparePurchase } from "./usePreparePurchase";
import { Token } from "@/types";
import { translateFrames, translateTrios } from "@/utils";
import { useMappings } from "./useMappings";
import { useSelectedToken } from "./useSelectedToken";
import { NWPurchaseContext } from "@/context";

export interface usePurchaseType {
  purchasedTokens: Token[];
  purchaseCompleted: boolean;
  isLoading: boolean;
  anyPurchaseCompleted: boolean;
  signature: string | undefined;
  loadingState: string | undefined;
  customError: Error | null;
  setCustomError: (error: Error | null) => void;
}

export function usePurchaseCtx(): usePurchaseType {
  const {
    isLoading: isPreparePurchaseLoading,
    isWaitLoading,
    customLoading,
    isSuccess,
    txData,
    buyingFor,
    anySuccess,
  } = usePreparePurchase();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [purchasedTokens, setPurchasedTokens] = useState<Token[]>([]);
  const [purchaseCompleted, setPurchaseCompleted] = useState<boolean>(false);
  const [anyPurchaseCompleted, setAnyPurchaseCompleted] =
    useState<boolean>(false);
  const [signature, setSignature] = useState<string | undefined>();
  const [loadingState, setLoadingState] = useState<string | undefined>();
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const [lastSuccessTxHash, setLastSuccessTxHash] = useState<string | null>();
  const [customError, setCustomError] = useState<Error | null>(null);

  const publicClient = usePublicClient();
  const { mappings } = useMappings();
  const { address } = useAccount();

  const { setSelectedToken } = useSelectedToken();

  const updatePurchaseData = useCallback(async () => {
    if (!txData) {
      setLoading(false);
      return;
    }

    if (!publicClient) {
      setLoading(false);
      return;
    }

    setLastSuccessTxHash(txData.transactionHash);

    setPurchaseCompleted(false);
    setPurchasedTokens([]);

    setLoadingState("Waiting for tokens to be shuffled randomly...");
    const claimRes = await fetch(
      "/api/getClaimTokens?receiver=" +
        buyingFor +
        "&block=" +
        Number(txData.blockNumber).toString(),
    );

    if (!claimRes.ok) {
      const { message } = await claimRes.json();
      setLoadingState(undefined);
      setLoading(false);
      setCustomError(
        new Error("Failed to get claim data of tokens. Error:" + message),
      );
      return;
    }

    const { signature, tokens } = await claimRes.json();
    setLoadingState(undefined);
    setSignature(signature);

    const localPurchasedTokens: any = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];

      const set = (await publicClient.readContract({
        address: config.addresses.nightWatch,
        abi: nwAbi,
        functionName: "getSet",
        args: [token],
      })) as number;

      const frames = (await publicClient.readContract({
        address: config.addresses.nightWatch,
        abi: nwAbi,
        functionName: "getFrames",
        args: [token],
      })) as number[];

      localPurchasedTokens.push({
        id: token,
        set: set,
        frames: translateFrames(frames),
        trioName: translateTrios(set, mappings),
      });
    }

    setPurchasedTokens(localPurchasedTokens);
    setSelectedToken(null);
    setAnyPurchaseCompleted(true);
    setPurchaseCompleted(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [buyingFor, mappings, publicClient, setSelectedToken, txData]);

  useEffect(() => {
    if (!isWaitLoading && isSuccess) {
      setTimeout(() => {
        if (isSuccess) {
          if (txData.transactionHash !== lastSuccessTxHash) {
            console.log("Updating purchase data...");
            setLoading(true);
            updatePurchaseData();
          }
        } else {
          setLoading(false);
        }
      }, 100);
    }

    if (isWaitLoading) {
      setPurchaseCompleted(false);
      setPurchasedTokens([]);
      setSelectedToken(null);
    }
  }, [
    anySuccess,
    isPreparePurchaseLoading,
    isSuccess,
    isWaitLoading,
    lastSuccessTxHash,
    setSelectedToken,
    txData,
    updatePurchaseData,
  ]);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }
    setPurchaseCompleted(false);
    setSelectedToken(null);
    setPurchasedTokens([]);
    setAnyPurchaseCompleted(false);
    setSignature(undefined);
  }, [address, buyingFor, firstLoad, setSelectedToken]);

  return {
    purchasedTokens,
    purchaseCompleted,
    isLoading,
    anyPurchaseCompleted,
    signature,
    loadingState,
    customError,
    setCustomError,
  };
}

export function usePurchase() {
  const { usePurchase } = useContext(NWPurchaseContext);

  if (!usePurchase) {
    throw new Error("You can't use usePurchase outside of NWProvider");
  }

  return usePurchase;
}
