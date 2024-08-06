import PostCard from "../PostCard";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

export default function TabLayout({ posted }: { posted: any[] }) {

    return (
    <Tabs isFitted colorScheme="orange">
      <TabList fontWeight="bold" fontSize="28">
        <Tab>Published</Tab>
        <Tab>Minted</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {posted?.map((post, index) => (
            <PostCard key={index} data={post} />
          ))}
        </TabPanel>
        <TabPanel></TabPanel>
      </TabPanels>
    </Tabs>
  );
}
