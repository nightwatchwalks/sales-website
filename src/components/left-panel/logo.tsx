import { Flex, Image, useMediaQuery } from "@chakra-ui/react";

export default function Logo({ ...props }) {
  const [largerThan370] = useMediaQuery("(min-width: 370px)");
  return (
    <Flex justify={"center"} align={"center"} flexDir={"column"} {...props}>
      <Image
        maxW={largerThan370 ? "370px" : "100%"}
        px={[5, 5, 5, 0]}
        src="/images/logo.webp"
        alt="Night Watch"
      />
    </Flex>
  );
}
