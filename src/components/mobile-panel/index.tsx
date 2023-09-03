import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Image,
  Spacer,
  Spinner,
  useMediaQuery,
} from "@chakra-ui/react";
import Logo from "../left-panel/logo";
import PurchaseCompletedLeftPanel from "../left-panel/purchase-completed-left-panel";
import { useSelectedToken } from "@/hooks/useSelectedToken";
import { usePurchase } from "@/hooks/usePurchase";
import { config } from "@/config";
import TokenInfo from "../left-panel/token-info";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import Divider from "../left-panel/divider";
import { useEffect, useMemo } from "react";
import { useClaim } from "@/hooks/useClaim";

export default function MobilePanel({ ...props }) {
  const { selectedToken, setSelectedToken } = useSelectedToken();
  const { purchaseCompleted, purchasedTokens } = usePurchase();
  const { claimedTokens } = useClaim();

  const tokensToShow = useMemo(() => {
    return claimedTokens.length > 0 ? claimedTokens : purchasedTokens;
  }, [claimedTokens, purchasedTokens]);

  const [isDesktop] = useMediaQuery("(min-width: 992px)");

  useEffect(() => {
    if (!selectedToken && !isDesktop) {
      setSelectedToken(tokensToShow[0]);
    }
  }, [
    selectedToken,
    purchasedTokens,
    setSelectedToken,
    isDesktop,
    tokensToShow,
  ]);

  return (
    <Flex flexDir={"column"} justify={"center"} minH={"100vh"} {...props}>
      {purchaseCompleted ? (
        <>
          <Spacer />
          <Logo px={10} />
          <Divider px={10} />
          <PurchaseCompletedLeftPanel />
          <Box px={10}>
            <Image
              w={"100%"}
              py={9}
              src={
                selectedToken
                  ? config.metadataServerRoot + "/getImage/" + selectedToken.id
                  : config.assetsUrl + "/images/loading.gif"
              }
              fallbackSrc={config.assetsUrl + "/images/loading.gif"}
              alt={"Token Image"}
            />
            <Flex>
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
              <TokenInfo textAlign={"center"} px={2} />
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
          </Box>
          <Spacer />
          <Button
            fontWeight={900}
            fontSize={"2xl"}
            py={"1.25em"}
            mt={"2em"}
            bg={"nw-yellow"}
            color={"black"}
            borderRadius={0}
            onClick={() => {
              const target = document.getElementById(
                "main-panel",
              ) as HTMLElement;
              target.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }}
          >
            {claimedTokens.length == 0 ? "CLAIM TOKENS" : "BUY AGAIN"}
          </Button>
        </>
      ) : (
        <Center>
          <Spinner />
        </Center>
      )}
    </Flex>
  );
}
