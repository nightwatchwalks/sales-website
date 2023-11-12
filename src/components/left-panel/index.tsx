import { Flex, Center } from "@chakra-ui/react";
import Logo from "./logo";
import PurchaseCompletedLeftPanel from "./purchase-completed-left-panel";
import Socials from "./socials";
import StatsBox from "./stats-box";
import dynamic from "next/dynamic";
import Divider from "./divider";
import BottomInfoPanel from "./bottom-info-panel";
import { config } from "@/config";

const ArrowPanel = dynamic(() => import("./arrow-panel"), {
  ssr: false,
});

export default function LeftPanel({ ...props }) {
  return (
    <Flex flexDir={"column"} justify={"center"} minH={"100vh"} {...props}>
      <Logo px={10} />
      <Divider px={10} />
      <PurchaseCompletedLeftPanel />
      <ArrowPanel />
      {config.isSaleOpen && <StatsBox />}
      <Divider w={"full"} />
      <BottomInfoPanel />
      <Divider w={"full"} />
      <Center>
        <Socials />
      </Center>
    </Flex>
  );
}
