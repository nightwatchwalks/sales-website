import { Flex, Text } from "@chakra-ui/react";

export default function StatsItem({ item, value, ...props }) {
  return (
    <Flex justify={"space-between"} {...props}>
      <Text>{item}</Text>
      <Text>{value}</Text>
    </Flex>
  );
}
