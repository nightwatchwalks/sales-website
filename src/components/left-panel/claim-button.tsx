import {
  Flex,
  chakra,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  Text,
  ModalContent,
  ModalHeader,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Alert,
  AlertIcon,
  Center,
} from "@chakra-ui/react";
import ConnectionSettings from "./connection-settings";
import { useClaim } from "@/hooks/useClaim";
import { usePrepareClaim } from "@/hooks/usePrepareClaim";
import { useAccount, useContractRead } from "wagmi";
import { config } from "@/config";
import nwAbi from "../../../abi/NightWatch.abi.json";

export default function ClaimButton({ ...props }) {
  const { isLoading } = useClaim();
  const { onClose, onOpen, isOpen } = useDisclosure();

  return (
    <Flex flexDir={"column"} my={"2rem"} fontSize={"2xl"} {...props}>
      <ClaimModal onClose={onClose} isOpen={isOpen} />
      <chakra.span
        fontWeight={400}
        bg={"black"}
        fontSize={["lg", "lg", "lg", "xl"]}
        textAlign={"center"}
      >
        Claim your tokens to receive them
      </chakra.span>{" "}
      <Flex gap={2} my={"0.5rem"}>
        <Button
          h={"60px"}
          borderRadius={0}
          fontWeight={900}
          bg={"#ffc107"}
          color={"black"}
          fontSize={"3xl"}
          flexGrow={1}
          onClick={onOpen}
          isDisabled={isLoading}
        >
          CLAIM NOW
        </Button>
      </Flex>
      <ConnectionSettings />
    </Flex>
  );
}

export function ClaimModal({ onClose, isOpen, ...props }) {
  const { claim } = usePrepareClaim();
  const { isLoading } = useClaim();
  const { address } = useAccount();
  const { data } = useContractRead({
    address: config.addresses.nightWatch,
    abi: nwAbi,
    functionName: "balanceOf",
    args: [address],
  });

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={"#2b2b2b"}>
        <ModalHeader>Claim Your Tokens</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert bg={"#00000050"} status="info">
            <AlertIcon />
            <Text>
              Once you claim your tokens, you can check if any have merged!
            </Text>
          </Alert>
          {Number(data) > 0 && (
            <Alert bg={"#00000050"} mt={5} status="warning">
              <AlertIcon />
              <Text>
                If a token {"you've"} listed on OpenSea (or any marketplace)
                merges with one {"you've"} recently purchased, the price on
                OpenSea will{" "}
                <chakra.span fontWeight={700}>remain the same.</chakra.span>{" "}
                Please be cautious and{" "}
                <chakra.span fontWeight={700}>
                  adjust the listing price
                </chakra.span>{" "}
                if you wish.
              </Text>
            </Alert>
          )}

          <Center my={5}>
            <Button
              isDisabled={isLoading}
              colorScheme="yellow"
              fontWeight={700}
              onClick={claim}
            >
              I Understand, Claim Now
            </Button>
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
