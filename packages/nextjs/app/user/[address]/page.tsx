"use client";

import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Button,
  Grid,
  GridItem,
  Input,
  SkeletonCircle,
  SkeletonText,
  Textarea,
} from "@chakra-ui/react";
import { useAtom } from "jotai";
import { FaEdit } from "react-icons/fa";
import { Address } from "viem";
import { useWriteContract } from "wagmi";
import { ProfileTabLayout } from "~~/components/TabLayout";
import { useReadDePhilContractHooks, useWriteDePhilContractHooks } from "~~/hooks/useDePhilContract";
import { accountDisplayNameAtom } from "~~/services/state";
import { IProfile, IPublication } from "~~/types/dePhil";

const UserProfile = ({ params: { address } }: { params: { address: string } }) => {
  const [accountDisplayName] = useAtom(accountDisplayNameAtom);
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [publications, setPublications] = useState<IPublication[]>([]);

  const { useGetProfile, useGetUserPoints } = useReadDePhilContractHooks();
  const { data: user, isLoading } = useGetProfile(address as string);
  const { data: userPoints } = useGetUserPoints(address as string);

  const { targetNetwork, deployedContractData } = useWriteDePhilContractHooks();
  const { writeContract } = useWriteContract();

  useEffect(() => {
    if (user) {
      setFollowers((user as IProfile)?.followers ?? []);
      setFollowing((user as IProfile)?.following ?? []);
      setPublications((user as IProfile)?.publications ?? []);
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-col self-center w-full max-w-[1112px] gap-[32px]">
        <div className="xl:m-10 p-10 w-full h-auto bg-white self-center rounded-[10px]">
          <SkeletonCircle size="24" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
        </div>
        <Grid templateColumns="repeat(2,1fr)" gap={4} h="100%">
          <GridItem>
            <section className="flex flex-col w-full justify-between bg-white p-4 rounded-[10px]">
              <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
            </section>
          </GridItem>
          <GridItem>
            <section className="flex flex-col w-full justify-between bg-white p-4 rounded-[10px]">
              <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
            </section>
          </GridItem>
        </Grid>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditEnabled(!isEditEnabled);
  };

  const handleSubmit = () => {
    setIsEditEnabled(false);
  };

  return (
    <div className="flex flex-col self-center w-full max-w-[1112px] gap-[32px]">
      <div className="xl:m-10 p-10 flex w-full justify-between bg-white text-black self-center rounded-[10px] shadow-2xl">
        <div className="flex flex-col gap-[8px]">
          <Avatar size="lg" />
          <span className="flex flex-col justify-center gap-[8px] text-[20px]">
            {!isEditEnabled ? (
              <h1 className="font-bold">{(user as IProfile)?.username ?? address}</h1>
            ) : (
              <Input placeholder="Enter your new username" size="md" variant="filled" />
            )}
            <h1>{accountDisplayName ?? address}</h1>
          </span>
        </div>
        <div className="flex flex-col gap-[8px]">
          <div className="self-end h-[64px]">
            {!isEditEnabled ? (
              <button onClick={handleEdit}>
                <FaEdit />
              </button>
            ) : (
              <Button onClick={handleSubmit} colorScheme="orange" variant="outline">
                Submit
              </Button>
            )}
          </div>
          <span className="flex font-bold justify-center items-center gap-[8px]">
            <h1 className="text-[28px] text-[#FC4100]">{Number(userPoints) ?? "0"}</h1>
            <h1 className="text-[20px] text-[#00215E]">{Number(userPoints) > 1 ? "points" : "point"}</h1>
          </span>
        </div>
      </div>
      <Grid templateColumns="repeat(2,1fr)" gap={4} h="100%">
        <GridItem>
          <section className="flex flex-col w-3/4 justify-between bg-white text-black p-4 rounded-[10px] shadow-2xl">
            <span className="flex flex-col gap-[8px]">
              <h1 className="font-bold text-[20px]">Bio</h1>
              <span>
                {!isEditEnabled ? (
                  <p className="text-[18px]">{(user as IProfile)?.bio ?? "No bio"}</p>
                ) : (
                  <Textarea placeholder="Enter your bio" size="md" variant="filled" />
                )}
              </span>
            </span>
            <div className="flex w-full justify-between pb-[32px]">
              <span>
                <h1 className="font-bold text-[20px]">Followers</h1>
                <AvatarGroup size="sm" max={3}>
                  {followers.length > 0 ? (
                    followers.map((f, i) => <Avatar size="sm" variant="filled" key={i} border="white" />)
                  ) : (
                    <p>No followers yet.</p>
                  )}
                </AvatarGroup>
              </span>
              <div className="w-[2px] h-[89px] bg-black rounded-[10px]" />
              <span>
                <h1 className="font-bold text-[20px]">Following</h1>
                <AvatarGroup size="sm" max={3}>
                  {following.length > 0 ? (
                    following.map((f, i) => <Avatar size="sm" key={i} border="white" />)
                  ) : (
                    <p>Start following someone!</p>
                  )}
                </AvatarGroup>
              </span>
            </div>
            <Button
              colorScheme="orange"
              variant="solid"
              onClick={() => {
                writeContract({
                  chainId: targetNetwork.id,
                  abi: deployedContractData?.abi ?? [],
                  address: deployedContractData?.address ?? "0x0",
                  functionName: "follow",
                  args: [address as unknown as Address],
                });
              }}
            >
              Follow
            </Button>
          </section>
        </GridItem>
        <GridItem>
          <section className="flex flex-col w-full justify-between text-black p-4 rounded-[10px]">
            <ProfileTabLayout main={publications} secondary={[]} />
          </section>
        </GridItem>
      </Grid>
    </div>
  );
};

export default UserProfile;
