import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Image, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";
import { hardhat } from "viem/chains";
import { FaucetButton } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";

const DynamicRainbowKitCustomConnectButton = dynamic(
  () => import("~~/components/scaffold-eth").then(mod => mod.RainbowKitCustomConnectButton),
  { ssr: false },
);

export const Header = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1rem" bg="#e1e3eb" w="100vw">
      <Flex align="center" mr={5}>
        <Link href="/" passHref>
          <Flex align="center">
            <Image alt="DePhil logo" src="/dephil-logo.png" height="40px" width="auto" objectFit="contain" />
          </Flex>
        </Link>
        <InputGroup maxWidth="400px" mx={4}>
          <InputLeftElement pointerEvents="none" pl={3}>
            <SearchIcon color="black" />
          </InputLeftElement>
          <Input
            placeholder="Search"
            bg="white"
            borderColor="gray.300"
            _placeholder={{ color: "black" }}
            color="black"
            pl={10}
          />
        </InputGroup>
      </Flex>
      <Flex align="center" gap="8px">
        {isClient && (
          <>
            <Link href="/upload" passHref>
              <Button leftIcon={<FaFileUpload />} colorScheme="orange" variant="solid">
                Upload Article
              </Button>
            </Link>
            {isLocalNetwork && (
              <Box mr={3}>
                <Link href="/debug" passHref>
                  <Button
                    as="a"
                    variant="ghost"
                    color="black"
                    aria-current={pathname === "/debug" ? "page" : undefined}
                  >
                    Debug Contracts
                  </Button>
                </Link>
              </Box>
            )}
            <DynamicRainbowKitCustomConnectButton />
            <FaucetButton />
          </>
        )}
      </Flex>
    </Flex>
  );
};
