import { Flex, chakra, Text, useDisclosure } from "@chakra-ui/react";
import { ConnectKitButton } from "connectkit";
import { truncate } from "@/utils/truncate";
import { useAccount, useEnsName } from "wagmi";
import { usePreparePurchase } from "@/hooks/usePreparePurchase";
import { config } from "@/config";
import BuyForSomeoneElseModal from "./buy-for-someone-else-modal";

export default function ConnectionSettings({
  showPrice = false,
  amount = 0,
  ...props
}) {
  const { address } = useAccount();
  const { buyingFor } = usePreparePurchase();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: ensName } = useEnsName({
    address: buyingFor,
  });

  return (
    <Flex justify={"space-between"} {...props}>
      <BuyForSomeoneElseModal isOpen={isOpen} onClose={onClose} />
      <Flex flexDir={"column"}>
        <Text fontSize={"xs"}>Connected as: {truncate(address, 12)}</Text>
        <ConnectKitButton.Custom>
          {({ show }) => {
            return (
              <Text maxW={"100%"} fontSize={"sm"} fontWeight={700}>
                <chakra.span
                  _hover={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => show()}
                >
                  CHANGE WALLET
                </chakra.span>
              </Text>
            );
          }}
        </ConnectKitButton.Custom>
      </Flex>
      <Flex flexDir={"column"} justify={"end"}>
        {/* <Text
          _hover={{ cursor: "pointer", textDecoration: "underline" }}
          textAlign={"right"}
          fontSize={"xs"}
          onClick={onOpen}
        >
          {buyingFor === address
            ? "Buy for someone else"
            : "Buying for: " + truncate(ensName ? ensName : buyingFor, 12)}
        </Text> */}
        {showPrice && (
          <Text fontWeight={700} fontSize={"xl"}>
            {"Price: " + amount * config.pricePerToken + " ETH"}
          </Text>
        )}
      </Flex>
    </Flex>
  );
}
