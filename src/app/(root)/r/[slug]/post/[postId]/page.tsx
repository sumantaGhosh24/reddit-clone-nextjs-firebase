import PostDetails from "@/components/post-details";

interface PageProps {
  params: Promise<{
    slug: string;
    postId: string;
  }>;
}

export default async function PostPage({params}: PageProps) {
  const {slug, postId} = await params;

  return <PostDetails communityId={slug} postId={postId} />;
}
