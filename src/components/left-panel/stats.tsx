import { Flex, Box } from "@chakra-ui/react";
import StatsItem from "./stats-item";
import { useTotalMerged } from "@/hooks/useTotalMerged";

export default function Stats({ ...props }) {
  const { totalMerged, loading } = useTotalMerged();

  return (
    <Flex align={"center"} px={10} flexDir={"column"} {...props}>
      <Box maxW={"370px"} w={"full"}>
        <StatsItem item="Total Merged:" value={totalMerged} />
        <StatsItem item="Creator Earnings" value="5%" />
        <StatsItem item="Token Standard" value="ERC-721" />
        <StatsItem item="Chain" value="Ethereum" />
      </Box>
    </Flex>
  );
}
