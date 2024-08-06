"use client";

import { Avatar, Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useReadDePhilContractHooks } from "~~/hooks/useDePhilContract";
import { IProfile } from "~~/types/dePhil";

const UserProfile: NextPage = ({ params: { address } }) => {
  const { useGetProfile, useGetUserPoints } = useReadDePhilContractHooks();
  const { data: user, isLoading } = useGetProfile(address as string);
  const { data: userPoints } = useGetUserPoints(address as string);

  if (isLoading) {
    return (
      <Box padding="6" boxShadow="lg" bg="white">
        <SkeletonCircle size="10" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
      </Box>
    );
  }

  return (
    <div className="container mx-auto my-10 flex gap-1 items-center">
      <Avatar size="sm" />
      <h1>{(user as IProfile)?.username ?? address}</h1>
      <h1>{userPoints ?? "0"}</h1>
    </div>
  );
};

export default UserProfile;
