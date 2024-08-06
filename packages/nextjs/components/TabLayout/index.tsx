import PostCard from "../PostCard";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";

export default function TabLayout({ posted }: { posted: any[] }) {

    console.log(posted);

    return (
    <Tabs isFitted colorScheme="orange">
      <TabList fontWeight="bold" fontSize="28">
        <Tab>Published</Tab>
        <Tab>Minted</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {posted?.map((post, index) => (
            <div key={index} className="py-[16px] shadow-2xl rounded-[10px]">
                <PostCard data={post} />
            </div>
          ))}
        </TabPanel>
        <TabPanel></TabPanel>
      </TabPanels>
    </Tabs>
  );
}
