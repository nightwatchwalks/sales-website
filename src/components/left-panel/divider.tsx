import { Divider as ChakraDivider, Center } from "@chakra-ui/react";

export default function Divider({ ...props }) {
  return (
    <Center {...props}>
      <ChakraDivider
        borderBottomWidth={"1px"}
        borderColor={"white"}
        opacity={"0.3"}
        my={"0.875rem"}
        maxW={"370px"}
      />
    </Center>
  );
}
