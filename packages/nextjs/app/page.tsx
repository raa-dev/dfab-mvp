"use client";

import type { NextPage } from "next";
import FeedLayout from "~~/components/GridLayout";
import { useReadDePhilContractHooks } from "~~/hooks/useDePhilContract";
import { IProfile } from "~~/types/dePhil";

const Home: NextPage = () => {
  const { useGetProfile } = useReadDePhilContractHooks();
  const { data: user, isLoading } = useGetProfile("0x5A9FfdC00aEf7AbA7dddc573403Ede4F3870d5f8");

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
