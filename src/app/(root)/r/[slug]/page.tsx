import CommunityCard from "@/components/community-card";
import CommunityEvents from "@/components/community-events";
import CommunityPosts from "@/components/community-posts";

interface PageProps {
  params: Promise<{slug: string}>;
}

export default async function CommunityPage({params}: PageProps) {
  const {slug} = await params;

  return (
    <div className="min-h-screen">
      <CommunityCard id={slug} />
      <div className="container grid grid-cols-1 gap-6 py-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="col-span-1 space-y-6 md:col-span-2 lg:col-span-3">
          <CommunityPosts id={slug} />
        </div>
        <div className="col-span-1 space-y-6">
          <CommunityEvents />
        </div>
      </div>
    </div>
  );
}
