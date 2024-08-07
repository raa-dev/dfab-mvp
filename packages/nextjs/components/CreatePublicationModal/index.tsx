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

  const uploadFileToIPFS = async (file: string | Blob) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    const data = await response.json();
    return data.uri;
  };

  const handleCreatePublication = async () => {
    try {
      const uri = await uploadFileToIPFS(file);
      await writeContract({
        chainId: targetNetwork.id,
        abi: deployedContractData?.abi ?? [],
        address: deployedContractData?.address ?? "0x0",
        functionName: "createPublication",
        args: [uri, title, summary, BigInt(cost), parseTags(tags), BigInt(quantity)],
      });
      onClose();
    } catch (error) {
      console.error("Error creating publication:", error);
    }
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
            <FormControl mt={4} display="flex" flexDirection="column">
              <FormLabel fontWeight="bold">Upload your file</FormLabel>
              <input
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                type="file"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFile(URL.createObjectURL(file));
                  }
                }}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel fontWeight="bold">Quantity</FormLabel>
              <NumberInput value={quantity} onChange={value => setQuantity(parseInt(value))} min={1}>
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreatePublication}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
