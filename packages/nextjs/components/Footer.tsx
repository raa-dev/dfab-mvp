import React from "react";
import { Box, Flex, Text, Image, Avatar, SimpleGrid, VStack } from "@chakra-ui/react";

const teamMembers = [
  { name: "Raa", image: "/avatar-raa.jpg" },
  { name: "Rob Z", image: "/avatar-rob.jpg" },
  { name: "Yael Marahi", image: "/avatar-yael.jpg" },
  { name: "Victor Hinojosa", image: "/avatar-victor.jpg" },
];

export const Footer = () => {
  return (
    <Box as="footer" bg="#f0f0f4" py={4}>
      <Flex direction="column" align="center" maxW="1200px" mx="auto">
        <Image src="/dephil-logo-2.png" alt="DePhil Logo" mb={4} height="50px" />
        
        <SimpleGrid columns={4} spacing={4} width="100%" justifyItems="center" mb={4}>
          {teamMembers.map((member) => (
            <VStack key={member.name} spacing={2}>
              <Avatar name={member.name} src={member.image} size="md" />
              <Text fontSize="sm" fontWeight="medium" color="black" textAlign="center">
                {member.name}
              </Text>
            </VStack>
          ))}
        </SimpleGrid>
        
        <Text fontSize="sm" color="gray.600">
          De fan a builder 2024
        </Text>
      </Flex>
    </Box>
  );
};