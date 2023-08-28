import { usePrepareClaim } from "@/hooks/usePrepareClaim";
import { usePreparePurchase } from "@/hooks/usePreparePurchase";
import { usePurchase } from "@/hooks/usePurchase";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";

import { useCallback, useEffect, useMemo } from "react";

export default function ErrorHandler({ ...props }) {
  const {
    isWriteError: isWriteErrorPreparePurchase,
    isWaitError: isWaitErrorPreparePurchase,
    writeError: writeErrorPreparePurchase,
    waitError: waitErrorPreparePurchase,
    isLoading: isLoadingPreparePurchase,
  } = usePreparePurchase();
  const {
    isWriteError: isWriteErrorPrepareClaim,
    isWaitError: isWaitErrorPrepareClaim,
    writeError: writeErrorPrepareClaim,
    waitError: waitErrorPrepareClaim,
    isLoading: isLoadingPrepareClaim,
  } = usePrepareClaim();

  const { customError, setCustomError } = usePurchase();

  const getError = useCallback(() => {
    if (customError) {
      return customError;
    }
    if (isWriteErrorPreparePurchase) {
      return writeErrorPreparePurchase;
    }
    if (!isLoadingPreparePurchase && isWaitErrorPreparePurchase) {
      return waitErrorPreparePurchase;
    }
    if (isWriteErrorPrepareClaim) {
      return writeErrorPrepareClaim;
    }
    if (!isLoadingPrepareClaim && isWaitErrorPrepareClaim) {
      return waitErrorPrepareClaim;
    }
  }, [
    isLoadingPrepareClaim,
    isLoadingPreparePurchase,
    isWaitErrorPrepareClaim,
    isWaitErrorPreparePurchase,
    isWriteErrorPrepareClaim,
    isWriteErrorPreparePurchase,
    waitErrorPrepareClaim,
    waitErrorPreparePurchase,
    writeErrorPrepareClaim,
    writeErrorPreparePurchase,
    customError,
  ]);

  const errorMsg = useMemo(() => {
    const error = getError();
    if (error) {
      if (error.toString().includes("rejected")) {
        return "You rejected the transaction.";
      }
      return error.message;
    }
  }, [getError]);

  const { isOpen, onClose, onOpen } = useDisclosure();

  const flushAndClose = useCallback(() => {
    if (customError) {
      setCustomError(null);
    }
    onClose();
  }, [customError, onClose, setCustomError]);

  useEffect(() => {
    if (errorMsg) {
      console.error(errorMsg);
      onOpen();
    }
  }, [errorMsg, onOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={flushAndClose} isCentered {...props}>
        <ModalOverlay bg="rgba(0,0,0,0.4)" />

        <ModalContent bg={"#2b2b2b"}>
          <ModalCloseButton onClick={flushAndClose} />
          <ModalHeader>Error</ModalHeader>
          <ModalBody>{errorMsg}</ModalBody>

          <ModalFooter>
            <Button bg={"#383838"} onClick={flushAndClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
