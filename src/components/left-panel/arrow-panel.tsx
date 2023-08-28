import { Flex, Spinner, Text } from "@chakra-ui/react";
import ConnectWalletButton from "./connect-wallet-button";
import SoldOut from "./soldout";
import { ConnectKitButton } from "connectkit";
import styles from "../../styles/arrow-panel.module.css";
import { useAccount, useConnect } from "wagmi";
import { useMemo } from "react";
import { usePurchase } from "@/hooks/usePurchase";
import { useTotalSold } from "@/hooks/useTotalSold";
import dynamic from "next/dynamic";
import { useClaim } from "@/hooks/useClaim";
import { usePreparePurchase } from "@/hooks/usePreparePurchase";

import ClaimButton from "./claim-button";
import { useUnclaimedTokens } from "@/hooks/useUnclaimedTokens";

const BuySelector = dynamic(() => import("./buy-selector"), {
  ssr: false,
});

export default function ArrowPanel({ ...props }) {
  const { isConnected } = useAccount();
  const { totalSold } = useTotalSold();
  const {
    isLoading: isPurchaseLoading,
    purchaseCompleted,
    loadingState: purchaseLoadingState,
  } = usePurchase();

  const {
    loadingState: preparePurchaseLoadingState,
    isLoading: isPreparePurchaseLoading,
  } = usePreparePurchase();

  const { isLoading: isConnectLoading } = useConnect();
  const { claimCompleted, isLoading: isClaimLoading } = useClaim();

  const { isLoading: isUnclaimedTokensLoading } = useUnclaimedTokens();

  const loadingStateMemo = useMemo(() => {
    if (isConnectLoading) {
      return "CONNECTING WALLET...";
    } else if (isUnclaimedTokensLoading) {
      return "CHECKING UNCLAIMED TOKENS...";
    } else if (preparePurchaseLoadingState) {
      return preparePurchaseLoadingState;
    } else if (purchaseLoadingState) {
      return purchaseLoadingState;
    } else if (isPreparePurchaseLoading) {
      return "PURCHASE TRANSACTION WAITING...";
    } else if (isPurchaseLoading) {
      return "PURCHASE DETAILS ARE LOADING...";
    } else if (isClaimLoading) {
      return "CLAIMING YOUR TOKENS...";
    } else {
      return undefined;
    }
  }, [
    isClaimLoading,
    isConnectLoading,
    isPreparePurchaseLoading,
    isPurchaseLoading,
    isUnclaimedTokensLoading,
    preparePurchaseLoadingState,
    purchaseLoadingState,
  ]);

  const isSoldOut = useMemo(() => {
    return totalSold >= 6825;
  }, [totalSold]);

  return (
    <Flex
      justify={"center"}
      align={"center"}
      flexDir={"column"}
      mt={"1.25rem"}
      bg={isSoldOut ? "#ffc107" : "#121212"}
      className={isSoldOut ? styles.soldOutArrowPanel : styles.arrowPanel}
      {...props}
    >
      {isPurchaseLoading || isClaimLoading || isUnclaimedTokensLoading ? (
        <>
          <Spinner
            color={"nw-yellow"}
            boxSize={"5rem"}
            speed={"1s"}
            my={loadingStateMemo ? "2.6rem" : "3.8rem"}
          />
          {loadingStateMemo && (
            <Text
              color={"rgb(65, 65, 65)"}
              textTransform={"uppercase"}
              my={"1.2rem"}
              px={10}
              textAlign={"center"}
            >
              {loadingStateMemo}
            </Text>
          )}
        </>
      ) : (
        <>
          {isSoldOut ? (
            <SoldOut />
          ) : (
            <>
              {!isConnected ? (
                <ConnectKitButton.Custom>
                  {({ show }) => {
                    return <ConnectWalletButton onConnect={() => show()} />;
                  }}
                </ConnectKitButton.Custom>
              ) : (
                <>
                  {purchaseCompleted && !claimCompleted ? (
                    <ClaimButton />
                  ) : (
                    <BuySelector
                      buyText={purchaseCompleted ? "BUY AGAIN" : "BUY NOW"}
                    />
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </Flex>
  );
}
