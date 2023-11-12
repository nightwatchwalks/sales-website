import { Text, Box } from "@chakra-ui/react";

export default function SaleNotOpen({ ...props }) {
  return (
    <Box textAlign={"center"} w={"full"} maxW={"420px"} p={10} {...props}>
      <Text color={"nw-yellow"} fontWeight={700} fontSize={"3xl"}>
        COMING SOON
      </Text>
    </Box>
  );
}
