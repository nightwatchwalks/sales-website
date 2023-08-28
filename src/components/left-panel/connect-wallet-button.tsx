import { Flex, chakra, Button } from "@chakra-ui/react";

export default function ConnectWalletButton({ onConnect, ...props }) {
  return (
    <Flex
      fontSize={["xl", "xl", "xl", "2xl"]}
      flexDir={"column"}
      my={"2rem"}
      {...props}
    >
      <chakra.span
        fontSize={["lg", "lg", "lg", "xl"]}
        fontWeight={500}
        bg={"black"}
        textAlign={"center"}
      >
        Connect your wallet to purchase
      </chakra.span>
      <Button
        borderRadius={0}
        fontWeight={900}
        bg={"#ffc107"}
        color={"black"}
        fontSize={"3xl"}
        my={"0.5rem"}
        p={7}
        onClick={onConnect}
      >
        CONNECT WALLET
      </Button>
    </Flex>
  );
}
