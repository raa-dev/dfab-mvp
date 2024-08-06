"use client";

import { Avatar, Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import { useAtom } from "jotai";
import { useReadDePhilContractHooks } from "~~/hooks/useDePhilContract";
import { accountDisplayNameAtom } from "~~/services/state";
import { IProfile } from "~~/types/dePhil";

const UserProfile = ({ params: { address } }: { params: { address: string } }) => {
  const [accountDisplayName] = useAtom(accountDisplayNameAtom);

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
    <div className="p-10 flex w-full justify-between max-w-[1112px] bg-white text-black">
      <div className="flex flex-col gap-[8px]">
        <Avatar size="lg" />
        <span className="flex flex-col justify-center gap-[8px] text-[20px]">
          <h1 className="font-bold">{(user as IProfile)?.username ?? address}</h1>
          <h1>{accountDisplayName ?? address}</h1>
        </span>
      </div>
      <span className="flex font-bold justify-center items-center gap-[8px]">
        <h1 className="text-[28px] text-[#FC4100]">{Number(userPoints) ?? "0"}</h1>
        <h1 className="text-[20px] text-[#00215E]">points</h1>
      </span>
    </div>
  );
};

export default UserProfile;
