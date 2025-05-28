import UserPosts from "@/components/user-posts";
import UserCommunities from "@/components/user-communities";
import ProfileDetails from "@/components/profile-details";
import UpdateProfile from "@/components/update-profile";
import UpdateProfileImage from "@/components/update-profile-image";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

interface PageProps {
  params: Promise<{username: string}>;
}

export default async function UserProfilePage({params}: PageProps) {
  const {username} = await params;

  return (
    <div className="container mx-auto mt-8">
      <Tabs defaultValue="details" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Profile Details</TabsTrigger>
          <TabsTrigger value="update">Profile Update</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mb-10">
          <ProfileDetails username={username} />
          <UserCommunities username={username} />
          <UserPosts username={username} />
        </TabsContent>
        <TabsContent value="update">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Profile Update</h2>
            <UpdateProfile username={username} />
            <UpdateProfileImage username={username} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
