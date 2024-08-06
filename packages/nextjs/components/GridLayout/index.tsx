import { FeedTabLayout } from "../TabLayout";
import { SkeletonText } from "@chakra-ui/react";
import { IPublication } from "~~/types/dePhil";

interface IGridLayoutProps {
  posts: IPublication[];
  isLoading: boolean;
  children?: React.ReactNode;
}

export default function FeedLayout({ posts, isLoading }: IGridLayoutProps) {

  console.log(posts);
  return (
    <>
      {isLoading && <SkeletonText />}
      {!isLoading && <FeedTabLayout main={posts} secondary={posts} />}
    </>
  );
}
