import { useSelectedToken } from "@/hooks/useSelectedToken";
import { Flex, Text } from "@chakra-ui/react";

export default function TokenInfo({ ...props }) {
  const { selectedToken } = useSelectedToken();

  return (
    <Flex
      alignSelf={"center"}
      w={"full"}
      flexDir={"column"}
      fontSize={["md", "md", "md", "lg"]}
      {...props}
    >
      <Text fontWeight={"700"} fontSize={["xl", "xl", "xl", "2xl"]}>
        Night Watch #{selectedToken?.id}
      </Text>
      <Text>
        {"•"} Trio #{selectedToken?.set}
      </Text>
      <Text>
        {"•"} {selectedToken?.trioName}
      </Text>
      <Text>
        {"•"} Frames: {selectedToken?.frames.map((fr) => fr + 1).join(", ")}
      </Text>
    </Flex>
  );
}
