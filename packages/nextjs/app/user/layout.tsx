import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "User profile",
  description: "User profile view",
});

const UserProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default UserProfileLayout;
