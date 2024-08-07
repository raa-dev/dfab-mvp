"use client";

import { useAtom } from "jotai";
import type { NextPage } from "next";
import FeedLayout from "~~/components/GridLayout";
import { useReadDePhilContractHooks } from "~~/hooks/useDePhilContract";
import { accountAddressAtom } from "~~/services/state";
import { IProfile } from "~~/types/dePhil";

const Home: NextPage = () => {
  const accountAddress = useAtom(accountAddressAtom);
  const { useGetProfile } = useReadDePhilContractHooks();
  const { data: user, isLoading } = useGetProfile(accountAddress[0] ?? "");

  const postList = (user as IProfile)?.publications;

  return (
    <>
      <div className="flex flex-col flex-grow items-center justify-center  p-10 w-full">
        <FeedLayout posts={postList} isLoading={isLoading} />
      </div>
    </>
  );
};

export default Home;
