import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import DataTable from "./DataTable";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: any;
  metric: string;
  header: string;
}

const DataModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  song,
  metric,
  header,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <DataTable song={song} metric={metric} />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DataModal;
