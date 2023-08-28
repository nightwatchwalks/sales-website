import { Box, Flex, Spacer, IconButton, Text } from "@chakra-ui/react";
import PurchaseCompleted from "./purchase-completed";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import NWCard from "./nw-card";
import { useSelectedToken } from "@/hooks/useSelectedToken";
import { usePurchase } from "@/hooks/usePurchase";
import { config } from "@/config";
import { useClaim } from "@/hooks/useClaim";
import { useMemo } from "react";

export default function RightPanel({ ...props }) {
  const { selectedToken, setSelectedToken } = useSelectedToken();
  const { purchaseCompleted, purchasedTokens } = usePurchase();
  const { claimedTokens, claimCompleted } = useClaim();

  const tokensToShow = useMemo(() => {
    return claimedTokens.length > 0 ? claimedTokens : purchasedTokens;
  }, [claimedTokens, purchasedTokens]);

  return (
    <Box
      backgroundPosition={selectedToken ? "top" : "right"}
      backgroundSize={"cover"}
      backgroundRepeat={"no-repeat"}
      style={{
        backgroundImage: !purchaseCompleted
          ? "url(/images/crew-bg.webp)"
          : "url(" +
            (selectedToken
              ? config.metadataServerRoot + "/getImage/" + selectedToken.id
              : "/images/empty.webp") +
            ")",
      }}
      h={"100vh"}
      w={"100%"}
      textAlign={"center"}
      {...props}
    >
      <Flex
        h={"100%"}
        align={"center"}
        justify={"center"}
        flexDir={"column"}
        textShadow={"0px 0px 10px 0px rgba(0, 0, 0, 0.75)"}
      >
        <Spacer />

        {(!selectedToken || !claimCompleted) && purchaseCompleted && (
          <PurchaseCompleted />
        )}
        <Spacer />
        {purchaseCompleted && (
          <>
            <Flex gap={[1, 1, 1, 3]} justify={"center"} align={"center"}>
              <IconButton
                aria-label={"left"}
                fontSize={"64px"}
                variant={"ghost"}
                _hover={{ bg: "transparent" }}
                onClick={() => {
                  if (!selectedToken) {
                    setSelectedToken(tokensToShow[0]);
                    return;
                  }
                  const index = tokensToShow.indexOf(selectedToken);
                  if (index > 0) {
                    setSelectedToken(tokensToShow[index - 1]);
                  } else {
                    setSelectedToken(tokensToShow[tokensToShow.length - 1]);
                  }
                }}
                icon={<AiFillCaretLeft color={"rgba(65, 65, 65, 1)"} />}
              />

              {tokensToShow.map((token, i) => (
                <NWCard key={i} token={token} />
              ))}

              <IconButton
                aria-label={"right"}
                fontSize={"64px"}
                variant={"ghost"}
                _hover={{ bg: "transparent" }}
                onClick={() => {
                  if (!selectedToken) {
                    setSelectedToken(tokensToShow[0]);
                    return;
                  }
                  const index = tokensToShow.indexOf(selectedToken);
                  if (index < tokensToShow.length - 1) {
                    setSelectedToken(tokensToShow[index + 1]);
                  } else {
                    setSelectedToken(tokensToShow[0]);
                  }
                }}
                icon={<AiFillCaretRight color={"rgba(65, 65, 65, 1)"} />}
              />
            </Flex>
            <Flex my={12} align={"center"}>
              <Text fontSize={"lg"} px={2}>
                Switch tokens to update the image and the data on the left.
              </Text>
            </Flex>
          </>
        )}
      </Flex>
    </Box>
  );
}
