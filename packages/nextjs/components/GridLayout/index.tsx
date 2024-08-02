import PostCard from "../PostCard";
import { Grid, GridItem, SkeletonText } from "@chakra-ui/react";
import { IPublication } from "~~/types/dePhil";

interface IGridLayoutProps {
  posts: IPublication[];
  isLoading: boolean;
  children?: React.ReactNode;
}

export default function FeedLayout({ posts, isLoading }: IGridLayoutProps) {
  const rows = Math.ceil(posts?.length / 5);
  const columns = Math.min(posts?.length, 5);

  return (
    <>
      {isLoading && <SkeletonText />}
      {!isLoading && (
        <Grid
          display={{ base: "flex", lg: "grid" }}
          flexDirection={{ base: "column", lg: "unset" }}
          h="auto"
          maxW="auto"
          templateRows={{ lg: `repeat(${rows}, 1fr)` }}
          templateColumns={{ lg: `repeat(${columns}, 1fr)` }}
          gap={4}
        >
          {posts?.map((post, index) => (
            <GridItem key={index} colSpan={1} w={{ base: "100%", lg: "auto" }}>
              <PostCard data={post} />
            </GridItem>
          ))}
        </Grid>
      )}
    </>
  );
}
