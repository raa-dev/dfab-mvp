import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Textarea,
} from "@chakra-ui/react";
import { useWriteContract } from "wagmi";
import { useWriteDePhilContractHooks } from "~~/hooks/useDePhilContract";

export default function CreatePublicationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { targetNetwork, deployedContractData } = useWriteDePhilContractHooks();
  const { writeContract } = useWriteContract();
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState(0);
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState("");
  const [quantity, setQuantity] = useState(1);

  const parseTags = (tags: string): string[] => {
    return tags.split(",").map(tag => tag.trim());
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} blockScrollOnMount={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel fontWeight="bold">Enter a title for your publication:</FormLabel>
              <Input placeholder="publication title" value={title} onChange={e => setTitle(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel fontWeight="bold">Set a price for your publication</FormLabel>
              <NumberInput value={cost} onChange={value => setCost(parseInt(value))} min={0}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel fontWeight="bold">Enter the abstract of your publication:</FormLabel>
              <Textarea placeholder="Abstract" value={summary} onChange={e => setSummary(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel fontWeight="bold">Add some tags for your publication:</FormLabel>
              <Input placeholder="Tags separated by commas" value={tags} onChange={e => setTags(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel fontWeight="bold">Upload your file: </FormLabel>
              <Input placeholder="publication title" value={file} onChange={e => setFile(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                writeContract({
                  chainId: targetNetwork.id,
                  abi: deployedContractData?.abi ?? [],
                  address: deployedContractData?.address ?? "0x0",
                  functionName: "createPublication",
                  args: ["uri", title, summary, BigInt(cost), parseTags(tags), BigInt(quantity)],
                });
                onClose();
              }}
            >
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
