import PostCard from "../PostCard";
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { IPublicationTabs } from "~~/types/dePhil";

export default function ProfileTabLayout({ main, secondary }: IPublicationTabs) {
  return (
    <Tabs isFitted colorScheme="orange">
      <TabList fontWeight="bold" fontSize="28">
        <Tab>Published</Tab>
        <Tab>Minted</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          {main?.map((post, index) => (
            <div key={index} className="py-[16px] shadow-2xl rounded-[10px]">
              <PostCard data={post} />
            </div>
          ))}
        </TabPanel>
        <TabPanel>
          {secondary?.map((post, index) => (
            <div key={index} className="py-[16px] shadow-2xl rounded-[10px]">
              <PostCard data={post} />
            </div>
          ))}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
