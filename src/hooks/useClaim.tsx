import { useCallback, useContext, useEffect, useState } from "react";
import { decodeEventLog } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import nwAbi from "../../abi/NightWatch.abi.json";
import { MergedToken, Token } from "@/types";
import { getFrames, getSet, translateTrios } from "@/utils";
import { useMappings } from "./useMappings";
import { useSelectedToken } from "./useSelectedToken";
import { usePrepareClaim } from "./usePrepareClaim";
import { usePurchase } from "./usePurchase";
import { NWClaimContext } from "@/context";
import { usePreparePurchase } from "./usePreparePurchase";

export interface useClaimType {
  claimedTokens: Token[];
  mergedTokens: MergedToken[];
  claimCompleted: boolean;
  anyClaimCompleted: boolean;
  isLoading: boolean;
}

export function useClaimCtx(): useClaimType {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [claimedTokens, setClaimedTokens] = useState<Token[]>([]);
  const [mergedTokens, setMergedTokens] = useState<MergedToken[]>([]);
  const [claimCompleted, setClaimCompleted] = useState<boolean>(false);
  const [anyClaimCompleted, setAnyClaimCompleted] = useState<boolean>(false);
  const { address } = useAccount();
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const publicClient = usePublicClient();
  const { mappings } = useMappings();

  const {
    isLoading: isPrepareClaimLoading,
    isSuccess,
    txData,
  } = usePrepareClaim();
  const { purchasedTokens } = usePurchase();
  const { setCustomPurchaseData, buyingFor, isWaitLoading } =
    usePreparePurchase();
  const { setSelectedToken } = useSelectedToken();
  const [lastSuccessTxHash, setLastSuccessTxHash] = useState<string | null>();

  const updateClaimData = useCallback(async () => {
    if (!txData) {
      setLoading(false);
      return;
    }

    if (!publicClient) {
      setLoading(false);
      return;
    }

    setClaimCompleted(false);
    setClaimedTokens([]);
    setMergedTokens([]);
    setLastSuccessTxHash(txData.transactionHash);

    let localClaimedTokens: Array<Token | null> = purchasedTokens;
    let localMergedTokens: MergedToken[] = [];

    const logs = txData.logs;
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      const logData = log.data;
      const logTopics = log.topics;
      let decodedLog: { eventName: string; args: {} };

      try {
        decodedLog = decodeEventLog({
          abi: nwAbi,
          data: logData,
          topics: logTopics,
          strict: false,
        });
      } catch (error: any) {
        if (error.toString().includes("AbiEventSignatureNotFoundError"))
          continue;
        setLoading(false);
        throw error;
      }

      if (decodedLog.eventName === "Merge") {
        const {
          tokenId,
          tokenIdBurned,
          oldTokenData,
          updatedTokenData,
          owner,
        } = decodedLog.args as any;

        const set = getSet(Number(updatedTokenData));
        const frames = getFrames(Number(updatedTokenData));
        const oldFrames = getFrames(Number(oldTokenData));
        const framesOfOldToken = frames.filter(
          (item) => !oldFrames.includes(item),
        );

        const mergedToken: MergedToken = {
          id: Number(tokenId),
          set: set,
          frames: frames,
          trioName: translateTrios(set, mappings),
          burnedTokenId: Number(tokenIdBurned),
          burnedTokensFrames: framesOfOldToken,
        };

        localMergedTokens.push(mergedToken);
      }
    }

    // Remove burned tokens from purchased tokens and add merged tokens instead
    for (let i = 0; i < localClaimedTokens.length; i++) {
      const token = localClaimedTokens[i];

      if (!token) continue;

      for (let j = 0; j < localMergedTokens.length; j++) {
        const mergedToken = localMergedTokens[j];

        if (token.id === mergedToken.id) {
          localClaimedTokens[i] = mergedToken;
        }

        if (token.id === mergedToken.burnedTokenId) {
          localClaimedTokens[i] = null;

          if (!localClaimedTokens.find((item) => item?.id === mergedToken.id)) {
            localClaimedTokens.push(mergedToken);
          }
        } else {
          if (mergedToken.id === token.id) {
            localClaimedTokens[i] = mergedToken;
          }
        }
      }
    }

    // delete undefined tokens
    const localClaimedTokensFiltered = localClaimedTokens.filter(
      (item) => item,
    ) as Token[];

    setMergedTokens(localMergedTokens);
    setClaimedTokens(localClaimedTokensFiltered);
    setSelectedToken(null);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    setClaimCompleted(true);
    setAnyClaimCompleted(true);
  }, [mappings, publicClient, setSelectedToken, txData, purchasedTokens]);

  useEffect(() => {
    if (isPrepareClaimLoading) {
      setLoading(true);
    }

    if (!isPrepareClaimLoading) {
      setLoading(false);
      if (isSuccess) {
        if (txData.transactionHash !== lastSuccessTxHash) {
          setCustomPurchaseData(null);
          setClaimCompleted(false);
          setClaimedTokens([]);
          setMergedTokens([]);
          updateClaimData();
        }
      }
    }
  }, [
    isPrepareClaimLoading,
    isSuccess,
    lastSuccessTxHash,
    setCustomPurchaseData,
    txData,
    updateClaimData,
  ]);

  useEffect(() => {
    if (isWaitLoading) {
      setClaimCompleted(false);
      setClaimedTokens([]);
      setMergedTokens([]);
    }
  }, [isWaitLoading]);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }
    setClaimedTokens([]);
    setSelectedToken(null);

    setMergedTokens([]);
    setAnyClaimCompleted(false);
  }, [address, buyingFor, firstLoad, setSelectedToken]);

  return {
    claimedTokens,
    mergedTokens,
    claimCompleted,
    anyClaimCompleted,
    isLoading,
  };
}

export function useClaim() {
  const { useClaim } = useContext(NWClaimContext);

  if (!useClaim) {
    throw new Error("You can't use useClaim outside of NWProvider");
  }

  return useClaim;
}
