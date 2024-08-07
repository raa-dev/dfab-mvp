import PostCard from "../PostCard";
import { Grid, Spinner, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { IPublicationTabs } from "~~/types/dePhil";

export default function FeedTabLayout({ main, secondary }: IPublicationTabs) {
  const rows = Math.ceil(main?.length / 5);
  const columns = Math.min(main?.length, 5);

  const secondaryRows = Math.ceil(main?.length / 5);
  const secondaryColumns = Math.min(main?.length, 5);

  return (
    <Tabs isFitted colorScheme="orange">
      <TabList fontWeight="bold" fontSize="28">
        {main ? (
          <>
            <Tab>Featured</Tab>
            <Tab>Following</Tab>
          </>
        ) : (
          <Spinner />
        )}
      </TabList>
      <TabPanels>
        <TabPanel>
          <Grid
            display={{ base: "flex", lg: "grid" }}
            flexDirection={{ base: "column", lg: "unset" }}
            h="auto"
            maxW="auto"
            templateRows={{ lg: `repeat(${rows}, 1fr)` }}
            templateColumns={{ lg: `repeat(${columns}, 1fr)` }}
            gap={4}
          >
            {main?.map((post, index) => (
              <div key={index} className="py-[16px] shadow-2xl rounded-[10px]">
                <PostCard data={post} />
              </div>
            ))}
          </Grid>
        </TabPanel>
        <TabPanel>
          <Grid
            display={{ base: "flex", lg: "grid" }}
            flexDirection={{ base: "column", lg: "unset" }}
            h="auto"
            maxW="auto"
            templateRows={{ lg: `repeat(${secondaryRows}, 1fr)` }}
            templateColumns={{ lg: `repeat(${secondaryColumns}, 1fr)` }}
            gap={4}
          >
            {secondary?.map((post, index) => (
              <div key={index} className="py-[16px] shadow-2xl rounded-[10px]">
                <PostCard data={post} />
              </div>
            ))}
          </Grid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
