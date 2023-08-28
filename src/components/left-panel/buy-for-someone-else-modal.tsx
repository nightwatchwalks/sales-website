import { usePreparePurchase } from "@/hooks/usePreparePurchase";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Text,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { isAddress } from "viem";
import { normalize } from "viem/ens";
import { useAccount, usePublicClient } from "wagmi";

export default function BuyForSomeoneElseModal({ isOpen, onClose }) {
  const { setBuyingFor } = usePreparePurchase();
  const [input, setInput] = useState("");
  const client = usePublicClient();
  const [error, setError] = useState("");
  const { address } = useAccount();

  const submit = useCallback(async () => {
    setError("");
    if (isAddress(input)) {
      setBuyingFor(input);
      onClose();
      return;
    } else if (input.toLowerCase().endsWith(".eth")) {
      const ensAddress = await client.getEnsAddress({
        name: normalize(input),
      });
      if (ensAddress) {
        setBuyingFor(ensAddress);
        onClose();
        return;
      }
    }
    setError("Invalid address");
  }, [input, setBuyingFor, onClose, client]);

  const reset = useCallback(() => {
    setBuyingFor(address);
    onClose();
  }, [setBuyingFor, address, onClose]);

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#2b2b2b"}>
          <ModalHeader>Purchase For:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Wallet Address / ENS"
            />
            {error && <Text>Error: {error}</Text>}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={reset}>
              Buy For Yourself
            </Button>
            <Button colorScheme="blue" mr={3} onClick={submit}>
              Save Address
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
