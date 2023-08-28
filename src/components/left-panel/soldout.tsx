import { Text, Box } from "@chakra-ui/react";

export default function SoldOut({ ...props }) {
  return (
    <Box textAlign={"center"} w={"full"} maxW={"420px"} p={10} {...props}>
      <Text color={"black"} fontWeight={900} fontSize={"5xl"}>
        SOLD OUT!
      </Text>
      <Text color={"black"} fontSize={"lg"}>
        You can still buy Night Watch from secondary marketplaces!
      </Text>
    </Box>
  );
}
