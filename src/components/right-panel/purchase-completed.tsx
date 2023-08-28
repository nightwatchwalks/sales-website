import { useClaim } from "@/hooks/useClaim";
import { usePurchase } from "@/hooks/usePurchase";
import { useSelectedToken } from "@/hooks/useSelectedToken";
import {
  Alert,
  AlertIcon,
  Box,
  chakra,
  Spacer,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

export default function PurchaseCompleted({ ...props }) {
  const { purchasedTokens } = usePurchase();
  const { claimedTokens, mergedTokens, claimCompleted } = useClaim();
  const { selectedToken } = useSelectedToken();

  const [purchasedTokenAmount, setPurchasedTokenAmount] = useState(0);
  const [mergedTokenAmount, setMergedTokenAmount] = useState(0);

  useEffect(() => {
    if (claimedTokens?.length > 0) {
      setPurchasedTokenAmount(claimedTokens.length);
    } else if (purchasedTokens?.length > 0) {
      setPurchasedTokenAmount(purchasedTokens.length);
    } else {
      setPurchasedTokenAmount(0);
    }

    if (mergedTokens?.length > 0) {
      setMergedTokenAmount(mergedTokens.length);
    } else {
      setMergedTokenAmount(0);
    }
  }, [purchasedTokens, mergedTokens, claimedTokens]);

  return (
    <Flex
      flexDir={"column"}
      textShadow={"#000000 0px 0px 10px"}
      bg={"blackAlpha.500"}
      w={"full"}
      py={"3.5rem"}
      mt={"9rem"}
      {...props}
    >
      {claimCompleted && (
        <div>
          <chakra.span fontSize={"6xl"} fontWeight={500}>
            CLAIM{" "}
          </chakra.span>
          <chakra.span fontSize={"6xl"} color={"#ffc107"} fontWeight={700}>
            COMPLETED!
          </chakra.span>
        </div>
      )}
      <Text fontSize={"xl"}>
        You {claimCompleted ? "claimed" : "purchased"} {purchasedTokenAmount}{" "}
        Night Watch NFT
        {purchasedTokenAmount > 1 && "s"}.
      </Text>
      {mergedTokenAmount > 0 && claimCompleted && (
        <Text fontSize={"2xl"} color={"nw-yellow"}>
          {mergedTokenAmount} merge happened in your wallet!
        </Text>
      )}
      {!claimCompleted && (
        <div>
          <chakra.span fontSize={"6xl"} fontWeight={500}>
            READY FOR{" "}
          </chakra.span>
          <chakra.span fontSize={"6xl"} color={"#ffc107"} fontWeight={700}>
            CLAIM!
          </chakra.span>
          <Text fontWeight={500} fontSize={"lg"}>
            {"Don't"} forget to{" "}
            <chakra.span color={"nw-yellow"}>claim</chakra.span> your tokens and
            receive them in your wallet!
          </Text>
        </div>
      )}
    </Flex>
  );
}
