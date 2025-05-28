import ExploreCommunities from "@/components/explore-communities";
import TrendingPosts from "@/components/trending-posts";

export default function Home() {
  return (
    <div className="flex-1">
      <main className="container py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          <div className="col-span-1 space-y-6 md:col-span-2 lg:col-span-3">
            <TrendingPosts />
          </div>
          <div className="col-span-1 space-y-6">
            <ExploreCommunities />
          </div>
        </div>
      </main>
    </div>
  );
}
