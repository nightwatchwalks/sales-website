import { useClaim } from "@/hooks/useClaim";
import { usePurchase } from "@/hooks/usePurchase";
import { Text, Box, Link } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function PurchaseCompletedLeftPanel({ ...props }) {
  const { purchasedTokens, purchaseCompleted } = usePurchase();
  const { mergedTokens, claimCompleted, claimedTokens } = useClaim();

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
    <Box alignSelf={"center"} w={"full"} maxW={"420px"} px={10} {...props}>
      {purchaseCompleted ? (
        <>
          <Text
            textAlign={"center"}
            fontFamily={"montserrat"}
            color={"white"}
            fontWeight={900}
            fontSize={["xl", "xl", "xl", "2xl"]}
          >
            {claimCompleted ? "CLAIM COMPLETED!" : "PURCHASE COMPLETED!"}
          </Text>
          <Text
            textAlign={"center"}
            fontFamily={"montserrat"}
            fontSize={"md"}
            color={"white"}
            whiteSpace={"pre-wrap"}
          >
            You {claimCompleted ? "claimed" : "purchased"}{" "}
            {purchasedTokenAmount} Night Watch NFT
            {purchasedTokenAmount > 1 && "s"}.
          </Text>
          <Text
            textAlign={"center"}
            fontFamily={"montserrat"}
            fontSize={"md"}
            fontWeight={600}
            color={"nw-yellow"}
            whiteSpace={"pre-wrap"}
          >
            {claimCompleted &&
              mergedTokenAmount > 0 &&
              mergedTokenAmount + " merge happened in your wallet!"}
          </Text>
        </>
      ) : (
        <Text
          textAlign={"center"}
          fontFamily={"montserrat"}
          fontSize={"sm"}
          color={"white"}
        >
          <Link
            color={"nw-yellow"}
            href={"https://impossibletrios.art/"}
            isExternal
          >
            Night Watch
          </Link>{" "}
          is an experimental art collection of impossible animal trios. Start
          collecting to complete your animation via merge!
        </Text>
      )}
    </Box>
  );
}
