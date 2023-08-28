import { usePurchase } from "@/hooks/usePurchase";
import { useSelectedToken } from "@/hooks/useSelectedToken";
import { Flex, Text } from "@chakra-ui/react";
import Stats from "./stats";
import TokenInfo from "./token-info";

export default function BottomInfoPanel({ ...props }) {
  const { purchaseCompleted } = usePurchase();
  const { selectedToken } = useSelectedToken();

  return (
    <>
      {purchaseCompleted ? (
        <>
          {selectedToken ? (
            <TokenInfo maxW={"420px"} px={12} py={[4, 4, 4, 9]} />
          ) : (
            <Flex justify={"center"} align={"center"} w={"100%"} h={"175px"}>
              <Text
                fontWeight={500}
                textTransform={"uppercase"}
                fontSize={"sm"}
                color={"rgb(65, 65, 65)"}
                textAlign={"center"}
                whiteSpace={"pre-wrap"}
              >
                {"SELECT A TOKEN TO VIEW ITS INFO"}
              </Text>
            </Flex>
          )}
        </>
      ) : (
        <Stats />
      )}
    </>
  );
}
