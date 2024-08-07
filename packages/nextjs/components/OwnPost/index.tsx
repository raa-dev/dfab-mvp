/* eslint-disable react-hooks/rules-of-hooks */
import {
  Avatar,
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  SkeletonCircle,
  SkeletonText,
  Tag,
} from "@chakra-ui/react";
import { HiOutlineHandThumbDown, HiOutlineHandThumbUp } from "react-icons/hi2";
import { TfiCommentAlt } from "react-icons/tfi";
import { useReadDePhilContractHooks } from "~~/hooks/useDePhilContract";
import { IProfile, IPublication } from "~~/types/dePhil";
import { formatedDate } from "~~/utils/scaffold-eth/common";

interface IPostCardProps {
  data: IPublication;
}

export default function OwnPostCard({ data }: IPostCardProps) {
  if (!data) {
    return null;
  }

  const { id, title, summary, author, cost, upVotes, downVotes, commentsCount, tags, createdAt } = data;

  console.log(upVotes, downVotes, commentsCount);

  const { useGetProfile, useGetPublication } = useReadDePhilContractHooks();
  const { data: user, isLoading } = useGetProfile(author);
  const { data: publication } = useGetPublication(id);

  return (
    <Card boxShadow="none">
      <CardHeader className="font-extrabold text-[28px]">{title}</CardHeader>
      <CardBody>
        {isLoading && (
          <Box padding="6" boxShadow="lg" bg="white">
            <SkeletonCircle size="10" />
            <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
          </Box>
        )}
        {!isLoading && (
          <span className="flex flex-col w-full">
            <div className="flex gap-1 items-center">
              <Avatar size="sm" />
              <p className="text-[18px] font-bold">{(user as IProfile)?.username}</p>
            </div>
            <p className="text-[18px]">{formatedDate(createdAt)}</p>
            <p className="text-[19.3px]">{summary}</p>
            <span>
              {tags.map((tag, i) => {
                return (
                  <Tag key={i} size="lg" className="mr-1" bgColor="#C2C6D6">
                    {tag}
                  </Tag>
                );
              })}
            </span>
            <div className="flex justify-between w-full mt-[16px]">
              <Tag size="lg" className="flex gap-1 justify-center items-center text-[20px] w-full" bgColor="#C2C6D6">{Number(cost)} ETH</Tag>
            </div>
          </span>
        )}
      </CardBody>
      <CardFooter>
        <div className="flex justify-between w-full">
          <span className="flex gap-1 text-[18px]">
            <span className="flex gap-1 justify-center items-center font-bold">
              <HiOutlineHandThumbUp />
              {Number((publication as IPublication)?.upVotes)}
            </span>
            <span className="flex gap-1 justify-center items-center font-bold">
              <HiOutlineHandThumbDown />
              {Number((publication as IPublication)?.downVotes)}
            </span>
          </span>
          <span className="flex gap-1 justify-center items-center font-bold">
            <TfiCommentAlt /> {Number((publication as IPublication)?.commentsCount)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
