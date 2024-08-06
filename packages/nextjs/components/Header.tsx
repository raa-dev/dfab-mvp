import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { EditIcon, SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Image, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { FaucetButton } from "~~/components/scaffold-eth";

const DynamicRainbowKitCustomConnectButton = dynamic(
  () => import("~~/components/scaffold-eth").then(mod => mod.RainbowKitCustomConnectButton),
  { ssr: false },
);

export const Header = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Flex as="nav" align="center" justify="space-between" wrap="wrap" padding="1rem" bg="#e1e3eb">
      <Flex align="center" mr={5}>
        <Link href="/" passHref>
          <Flex align="center">
            <Image alt="DePhil logo" src="/dephil-logo.png" height="40px" width="auto" objectFit="contain" />
          </Flex>
        </Link>
      </Flex>

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

      <Flex align="center">
        {isClient && (
          <>
            <Link href="/upload" passHref>
              <Button leftIcon={<EditIcon />} colorScheme="orange" variant="solid">
                Upload Article
              </Button>
            </Link>
            <Box mr={3}>
              <Link href="/debug" passHref>
                <Button as="a" variant="ghost" color="black" aria-current={pathname === "/debug" ? "page" : undefined}>
                  Debug Contracts
                </Button>
              </Link>
            </Box>
            <DynamicRainbowKitCustomConnectButton />
            <FaucetButton />
          </>
        )}
      </Flex>
    </Flex>
  );
};