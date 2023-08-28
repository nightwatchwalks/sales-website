import { createContext } from "react";
import { useMappingsCtx, useMappingsType } from "@/hooks/useMappings";
import {
  usePreparePurchaseCtx,
  usePreparePurchaseType,
} from "@/hooks/usePreparePurchase";
import { usePurchaseCtx, usePurchaseType } from "@/hooks/usePurchase";
import {
  useSelectedTokenCtx,
  useSelectedTokenType,
} from "@/hooks/useSelectedToken";
import { useTotalMergedCtx, useTotalMergedType } from "@/hooks/useTotalMerged";
import { useTotalSoldCtx, useTotalSoldType } from "@/hooks/useTotalSold";
import {
  usePrepareClaimCtx,
  usePrepareClaimType,
} from "@/hooks/usePrepareClaim";
import { useClaimCtx, useClaimType } from "@/hooks/useClaim";
import {
  useUnclaimedTokensCtx,
  useUnclaimedTokensType,
} from "@/hooks/useUnclaimedTokens";

export interface NWContextType {
  useMappings: useMappingsType | undefined;
  usePreparePurchase: usePreparePurchaseType | undefined;
  useSelectedToken: useSelectedTokenType | undefined;
  useTotalMerged: useTotalMergedType | undefined;
  useTotalSold: useTotalSoldType | undefined;
}

export interface NWPurchaseContextType {
  usePurchase: usePurchaseType | undefined;
  useUnclaimedTokens: useUnclaimedTokensType | undefined;
}

export interface NWPrepareClaimContextType {
  usePrepareClaim: usePrepareClaimType | undefined;
}

export interface NWClaimContextType {
  useClaim: useClaimType | undefined;
}

export const NWContext = createContext<NWContextType>({
  useMappings: undefined,
  usePreparePurchase: undefined,
  useSelectedToken: undefined,
  useTotalMerged: undefined,
  useTotalSold: undefined,
});

export const NWPurchaseContext = createContext<NWPurchaseContextType>({
  usePurchase: undefined,
  useUnclaimedTokens: undefined,
});

export const NWPrepareClaimContext = createContext<NWPrepareClaimContextType>({
  usePrepareClaim: undefined,
});

export const NWClaimContext = createContext<NWClaimContextType>({
  useClaim: undefined,
});

export function NWProvider({ children }) {
  const { mappings, loading: mappingsLoading } = useMappingsCtx();
  const {
    purchase,
    isLoading,
    isWaitLoading,
    isWriteLoading,
    isWriteError,
    isWaitError,
    writeError,
    waitError,
    isSuccess,
    txData,
    setCustomPurchaseData,
    loadingState,
    buyingFor,
    setBuyingFor,
    anySuccess,
    customLoading,
  } = usePreparePurchaseCtx();

  const { selectedToken, setSelectedToken } = useSelectedTokenCtx();
  const { totalMerged, loading: totalMergedLoading } = useTotalMergedCtx();
  const { totalSold, loading: totalSoldLoading } = useTotalSoldCtx();

  return (
    <NWContext.Provider
      value={{
        useMappings: {
          mappings,
          loading: mappingsLoading,
        },
        usePreparePurchase: {
          isLoading,
          isWaitLoading,
          isWriteLoading,
          isSuccess,
          isWriteError,
          writeError,
          isWaitError,
          waitError,
          customLoading,
          purchase,
          txData,
          setCustomPurchaseData,
          loadingState,
          buyingFor,
          setBuyingFor,
          anySuccess,
        },
        useSelectedToken: {
          selectedToken,
          setSelectedToken,
        },
        useTotalMerged: {
          totalMerged,
          loading: totalMergedLoading,
        },
        useTotalSold: {
          totalSold,
          loading: totalSoldLoading,
        },
      }}
    >
      <NWPurchaseProvider>
        <NWPrepareClaimProvider>
          <NWClaimProvider>{children}</NWClaimProvider>
        </NWPrepareClaimProvider>
      </NWPurchaseProvider>
    </NWContext.Provider>
  );
}

export function NWPurchaseProvider({ children }) {
  const {
    purchasedTokens,
    purchaseCompleted,
    isLoading,
    anyPurchaseCompleted,
    signature,
    loadingState,
    customError,
    setCustomError,
  } = usePurchaseCtx();
  const { isLoading: isUnclaimedTokensLoading } = useUnclaimedTokensCtx();
  return (
    <NWPurchaseContext.Provider
      value={{
        usePurchase: {
          purchasedTokens,
          purchaseCompleted,
          isLoading,
          anyPurchaseCompleted,
          signature,
          loadingState,
          customError,
          setCustomError,
        },
        useUnclaimedTokens: {
          isLoading: isUnclaimedTokensLoading,
        },
      }}
    >
      {children}
    </NWPurchaseContext.Provider>
  );
}

export function NWPrepareClaimProvider({ children }) {
  const {
    claim,
    isLoading,
    isWriteError,
    isWaitError,
    writeError,
    waitError,
    isSuccess,
    txData,
  } = usePrepareClaimCtx();
  return (
    <NWPrepareClaimContext.Provider
      value={{
        usePrepareClaim: {
          claim,
          isLoading,
          isWriteError,
          writeError,
          isWaitError,
          waitError,
          isSuccess,
          txData,
        },
      }}
    >
      {children}
    </NWPrepareClaimContext.Provider>
  );
}

export function NWClaimProvider({ children }) {
  const {
    claimedTokens,
    mergedTokens,
    anyClaimCompleted,
    claimCompleted,
    isLoading,
  } = useClaimCtx();
  return (
    <NWClaimContext.Provider
      value={{
        useClaim: {
          claimedTokens,
          mergedTokens,
          claimCompleted,
          anyClaimCompleted,
          isLoading,
        },
      }}
    >
      {children}
    </NWClaimContext.Provider>
  );
}
