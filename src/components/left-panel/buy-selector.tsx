import { Flex, chakra, Button, Select } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { usePreparePurchase } from "@/hooks/usePreparePurchase";
import { config } from "@/config";
import { usePurchase } from "@/hooks/usePurchase";

import { parseEther } from "viem";
import ConnectionSettings from "./connection-settings";

export default function BuySelector({ buyText, ...props }) {
  const [amount, setAmount] = useState(1);
  const { address } = useAccount();
  const { purchase, isLoading: isPreparePurchaseLoading } =
    usePreparePurchase();
  const { isLoading } = usePurchase();

  const { data: balanceData, isLoading: isBalanceLoading } = useBalance({
    address,
  });

  const isFundsEnough = useMemo(() => {
    if (isBalanceLoading || !balanceData) {
      return false;
    } else {
      return (
        balanceData.value >=
        BigInt(amount) * parseEther(config.pricePerToken.toString())
      );
    }
  }, [amount, balanceData, isBalanceLoading]);

  return (
    <Flex flexDir={"column"} my={"2rem"} fontSize={"2xl"} {...props}>
      <chakra.span
        fontWeight={400}
        bg={"black"}
        fontSize={["lg", "lg", "lg", "xl"]}
        textAlign={"center"}
      >
        How much do you want to buy?
      </chakra.span>

      <Flex gap={2} my={"0.5rem"}>
        <Select
          variant={"filled"}
          backgroundColor={"#d9d9d9"}
          color={"black"}
          _hover={{
            color: "white",
            backgroundColor: "#232323",
          }}
          _focus={{
            color: "white",
            backgroundColor: "#232323",
          }}
          h={"60px"}
          maxW={"80px"}
          borderRadius={0}
          onChange={(e) => setAmount(Number(e.target.value))}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </Select>
        <Button
          h={"60px"}
          borderRadius={0}
          fontWeight={900}
          bg={"#ffc107"}
          color={"black"}
          fontSize={isFundsEnough ? "3xl" : "lg"}
          flexGrow={1}
          onClick={() => purchase(amount)}
          isDisabled={
            isLoading ||
            isBalanceLoading ||
            !isFundsEnough ||
            isPreparePurchaseLoading
          }
        >
          {isFundsEnough ? buyText : "INSUFFICIENT FUNDS"}
        </Button>
      </Flex>
      <ConnectionSettings showPrice={true} amount={amount} />
    </Flex>
  );
}
