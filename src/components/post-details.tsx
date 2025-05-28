"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import {formatDistanceStrict} from "date-fns";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MessageSquareIcon,
  ShareIcon,
} from "lucide-react";

import {db} from "@/firebase/firebase";
import {useFirebase} from "@/firebase/auth-context";

import CommentSection from "./comment-section";
import CreateCommentForm from "./create-comment-form";
import {Button} from "./ui/button";
import {Card} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface PostDetailsProps {
  communityId: string;
  postId: string;
}

interface PostProps {
  id: string;
  title: string;
  content: string;
  image: string;
  upVotes: string[];
  downVotes: string[];
  comments: {}[];
  createdBy: string;
  community: string;
  timestamp: any;
}

const PostDetails = ({communityId, postId}: PostDetailsProps) => {
  const [post, setPost] = useState<PostProps | null>(null);
  const [communityTitle, setCommunityTitle] = useState<string>("");
  const [authorUsername, setAuthorUsername] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "posts", postId), (doc) => {
      setPost({...doc.data(), id: doc.id} as PostProps);
    });
    return () => unsubscribe();
  }, [postId]);

  useEffect(() => {
    if (!communityId) return;
    const unsubscribe = onSnapshot(
      doc(db, "communities", communityId),
      (doc) => {
        setCommunityTitle(doc.data()?.title as string);
      }
    );
    return () => unsubscribe();
  }, [communityId]);

  useEffect(() => {
    if (!post?.createdBy) return;
    const unsubscribe = onSnapshot(doc(db, "users", post!.createdBy), (doc) => {
      setAuthorUsername(doc.data()?.username as string);
    });
    return () => unsubscribe();
  }, [post]);

  const firebase = useFirebase();

  const isUpVoted = post?.upVotes?.includes(firebase!.authUser!.id);
  const isDownVoted = post?.downVotes?.includes(firebase!.authUser!.id);

  const handleUpVote = async () => {
    if (isUpVoted) return;

    if (isDownVoted) {
      await updateDoc(doc(db, "posts", postId), {
        downVotes: arrayRemove(firebase!.authUser!.id),
        upVotes: arrayUnion(firebase!.authUser!.id),
      });
    } else {
      await updateDoc(doc(db, "posts", postId), {
        upVotes: arrayUnion(firebase!.authUser!.id),
      });
    }
  };

  const handleDownVote = async () => {
    if (isDownVoted) return;

    if (isUpVoted) {
      await updateDoc(doc(db, "posts", postId), {
        upVotes: arrayRemove(firebase!.authUser!.id),
        downVotes: arrayUnion(firebase!.authUser!.id),
      });
    } else {
      await updateDoc(doc(db, "posts", postId), {
        downVotes: arrayUnion(firebase!.authUser!.id),
      });
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareToSocialMedia = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(post!.title);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], "_blank");
  };

  return (
    <div className="container py-6 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
      {post && (
        <>
          <div className="col-span-1 space-y-6 md:col-span-2 lg:col-span-3">
            <Card className="p-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <Button
                    className="w-fit bg-red-700 hover:bg-red-800 disabled:bg-red-300"
                    disabled={isUpVoted}
                    onClick={handleUpVote}
                  >
                    <ArrowUpIcon color="white" /> ({post?.upVotes?.length || 0})
                  </Button>
                  <span className="text-sm font-medium">
                    {post!.upVotes!.length - post!.downVotes!.length || 0}
                  </span>
                  <Button
                    className="w-fit bg-red-700 hover:bg-red-800 disabled:bg-red-300"
                    disabled={isDownVoted}
                    onClick={handleDownVote}
                  >
                    <ArrowDownIcon color="white" /> (
                    {post?.downVotes?.length || 0})
                  </Button>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <Link
                      href={`/r/${communityId}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      r/{communityTitle}
                    </Link>
                    {" · "}
                    <span>
                      <Link
                        href={`/user/${authorUsername}`}
                        className="font-medium"
                      >
                        Posted by user/{authorUsername}{" "}
                      </Link>
                      {formatDistanceStrict(
                        post?.timestamp?.toDate(),
                        new Date()
                      )}
                    </span>
                  </div>
                  {post?.image && (
                    <Image
                      src={post?.image}
                      alt="post"
                      height={400}
                      width={600}
                      className="h-[250px] w-full rounded mb-5 mx-auto"
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-3">{post?.title}</h3>
                  <p className="text-sm">{post?.content}</p>
                  <div className="flex gap-4 pt-2">
                    <Button className="gap-2 bg-red-700 hover:bg-red-800">
                      <MessageSquareIcon className="h-4 w-4" />
                      {post?.comments?.length} Comments
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button className="gap-2 bg-red-700 hover:bg-red-800">
                          <ShareIcon className="h-4 w-4" />
                          Share
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => shareToSocialMedia("twitter")}
                          className="cursor-pointer"
                        >
                          Share on Twitter
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => shareToSocialMedia("facebook")}
                          className="cursor-pointer"
                        >
                          Share on Facebook
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => shareToSocialMedia("linkedin")}
                          className="cursor-pointer"
                        >
                          Share on LinkedIn
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => shareToSocialMedia("reddit")}
                          className="cursor-pointer"
                        >
                          Share on Reddit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <CreateCommentForm postId={postId} username={authorUsername} />
              <CommentSection comments={post.comments} />
            </Card>
          </div>
          <div className="col-span-1 space-y-6">
            <Card className="p-4">
              <h2 className="text-xl font-semibold">
                About r/{communityTitle}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Welcome to r/{communityTitle}!
              </p>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetails;
