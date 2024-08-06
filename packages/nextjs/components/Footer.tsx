import React from "react";
import { SwitchTheme } from "./SwitchTheme";
import { Faucet } from "./scaffold-eth";
import { Avatar, Box, Flex, Image, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { hardhat } from "viem/chains";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

const teamMembers = [
  { name: "Raa", image: "/avatar-raa.jpg" },
  { name: "Rob Z", image: "/avatar-rob.jpg" },
  { name: "Yael Marahi", image: "/avatar-yael.jpg" },
  { name: "Victor Hinojosa", image: "/avatar-victor.jpg" },
];

export const Footer = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  return (
    <Box as="footer" bg="#f0f0f4" py={4}>
      {isLocalNetwork && (
        <div className="fixed flex justify-between items-center w-full z-10 p-4 bottom-0 left-0 pointer-events-none">
          <div className="flex flex-col md:flex-row gap-2 pointer-events-auto">
            <>
              <Faucet />
            </>
          </div>
          <SwitchTheme className={`pointer-events-auto ${isLocalNetwork ? "self-end md:self-auto" : ""}`} />
        </div>
      )}
      <Flex direction="column" align="center" maxW="1200px" mx="auto">
        <Image src="/dephil-logo-2.png" alt="DePhil Logo" mb={4} height="50px" />

        <SimpleGrid columns={4} spacing={4} width="100%" justifyItems="center" mb={4}>
          {teamMembers.map(member => (
            <VStack key={member.name} spacing={2}>
              <Avatar name={member.name} src={member.image} size="md" />
              <Text fontSize="sm" fontWeight="medium" color="black" textAlign="center">
                {member.name}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>

        <Text fontSize="sm" color="gray.600">
          DFAB @ 2024
        </Text>
      </Flex>
    </Box>
  );
};
