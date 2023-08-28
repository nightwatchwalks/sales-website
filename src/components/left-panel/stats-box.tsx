import { config } from "@/config";
import { useTotalSold } from "@/hooks/useTotalSold";
import { Flex, Box, Text } from "@chakra-ui/react";

export default function StatsBox({ ...props }) {
  const { totalSold } = useTotalSold();

  return (
    <Flex
      w={"full"}
      maxW={"420px"}
      alignSelf={"center"}
      mt={"1.2rem"}
      justify={"space-around"}
      {...props}
    >
      <Box>
        <Text fontSize={"md"}>PRICE</Text>
        <Text fontWeight={700} fontSize={"2xl"}>
          {config.pricePerToken} ETH
        </Text>
      </Box>
      <Box>
        <Text fontSize={"md"}>TOTAL SOLD</Text>
        <Text fontWeight={700} fontSize={"2xl"}>
          {totalSold}/6825
        </Text>
      </Box>
    </Flex>
  );
}
