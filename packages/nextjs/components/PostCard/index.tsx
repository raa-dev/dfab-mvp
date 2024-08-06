/* eslint-disable react-hooks/rules-of-hooks */
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  SkeletonCircle,
  SkeletonText,
  Tag,
} from "@chakra-ui/react";
import { FaEthereum } from "react-icons/fa";
import { HiOutlineHandThumbDown, HiOutlineHandThumbUp } from "react-icons/hi2";
import { TfiCommentAlt } from "react-icons/tfi";
import { useReadDePhilContractHooks } from "~~/hooks/useDePhilContract";
import { IProfile, IPublication } from "~~/types/dePhil";
import { formatedDate } from "~~/utils/scaffold-eth/common";

interface IPostCardProps {
  data: IPublication;
}

export default function PostCard({ data }: IPostCardProps) {
  if (!data) {
    return null;
  }

  const { title, summary, author, cost, upVotes, downVotes, commentsCount, tags, createdAt } = data;

  const { useGetProfile } = useReadDePhilContractHooks();
  const { data: user, isLoading } = useGetProfile(author);

  return (
    <Card>
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
              <p className="text-[18px]">{(user as IProfile)?.username}</p>
            </div>
            <p className="text-[18px]">{formatedDate(createdAt)}</p>
            <p className="text-[19.3px]">{summary}</p>
            <span>
              {tags.map((tag, i) => {
                return (
                  <Tag key={i} size="sm" className="mr-1">
                    {tag}
                  </Tag>
                );
              })}
            </span>
            <div className="flex justify-between w-full">
              <span className="flex gap-1 items-center text-[20px]">
                {Number(cost)} <FaEthereum />
              </span>
              <Button colorScheme="orange">Mint</Button>
            </div>
          </span>
        )}
      </CardBody>
      <CardFooter>
        <div className="flex justify-between w-full">
          <span className="flex gap-1 text-[18px]">
            <span className="flex gap-1 justify-center items-center">
              <HiOutlineHandThumbUp />
              {Number(upVotes)}
            </span>
            <span className="flex gap-1 justify-center items-center">
              <HiOutlineHandThumbDown />
              {Number(downVotes)}
            </span>
          </span>
          <span className="flex gap-1 justify-center items-center">
            <TfiCommentAlt /> {Number(commentsCount)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
