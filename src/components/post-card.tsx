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
  ArrowUpIcon,
  ArrowDownIcon,
  MessageSquareIcon,
  ShareIcon,
} from "lucide-react";

import {db} from "@/firebase/firebase";
import {useFirebase} from "@/firebase/auth-context";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCardProps {
  id: string;
  title: string;
  content: string;
  image: string;
  upVotes?: string[];
  downVotes?: string[];
  comments?: {}[];
  createdBy: string;
  community: string;
  timestamp: any;
}

export default function PostCard({
  id,
  title,
  content,
  image,
  upVotes,
  downVotes,
  comments,
  createdBy,
  community,
  timestamp,
}: PostCardProps) {
  const [communityTitle, setCommunityTitle] = useState<string>("");
  const [authorUsername, setAuthorUsername] = useState<string>("");

  const firebase = useFirebase();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "communities", community), (doc) => {
      setCommunityTitle(doc.data()?.title as string);
    });
    return () => unsubscribe();
  }, [community]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", createdBy), (doc) => {
      setAuthorUsername(doc.data()?.username as string);
    });
    return () => unsubscribe();
  }, [createdBy]);

  const isUpVoted = upVotes?.includes(firebase!.authUser!.id);
  const isDownVoted = downVotes?.includes(firebase!.authUser!.id);

  const handleUpVote = async () => {
    if (isUpVoted) return;

    if (isDownVoted) {
      await updateDoc(doc(db, "posts", id), {
        downVotes: arrayRemove(firebase!.authUser!.id),
        upVotes: arrayUnion(firebase!.authUser!.id),
      });
    } else {
      await updateDoc(doc(db, "posts", id), {
        upVotes: arrayUnion(firebase!.authUser!.id),
      });
    }
  };

  const handleDownVote = async () => {
    if (isDownVoted) return;

    if (isUpVoted) {
      await updateDoc(doc(db, "posts", id), {
        upVotes: arrayRemove(firebase!.authUser!.id),
        downVotes: arrayUnion(firebase!.authUser!.id),
      });
    } else {
      await updateDoc(doc(db, "posts", id), {
        downVotes: arrayUnion(firebase!.authUser!.id),
      });
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareToSocialMedia = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], "_blank");
  };

  return (
    <Card className="p-4 hover:border-accent transition-colors">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <Button
            className="w-fit bg-red-700 hover:bg-red-800 disabled:bg-red-300"
            disabled={isUpVoted}
            onClick={handleUpVote}
          >
            <ArrowUpIcon color="white" /> ({upVotes?.length || 0})
          </Button>
          <span className="text-sm font-medium">
            {upVotes!.length - downVotes!.length || 0}
          </span>
          <Button
            className="w-fit bg-red-700 hover:bg-red-800 disabled:bg-red-300"
            disabled={isDownVoted}
            onClick={handleDownVote}
          >
            <ArrowDownIcon color="white" /> ({downVotes?.length || 0})
          </Button>
        </div>
        <div className="flex-1 space-y-2">
          <div className="text-sm text-muted-foreground">
            <Link
              href={`/r/${community}`}
              className="font-medium text-foreground hover:underline"
            >
              r/{communityTitle}
            </Link>
            {" · "}
            <span>
              <Link href={`/user/${authorUsername}`} className="font-medium">
                Posted by user/{authorUsername}{" "}
              </Link>
              {timestamp &&
                formatDistanceStrict(timestamp?.toDate(), new Date())}
            </span>
          </div>
          {image && (
            <Image
              src={image}
              alt="post"
              height={400}
              width={600}
              className="h-[250px] w-full rounded mb-5 mx-auto"
            />
          )}
          <Link href={`/r/${community}/post/${id}`}>
            <h3 className="text-lg font-semibold hover:underline mb-3">
              {title}
            </h3>
          </Link>
          <p className="text-sm">{content}</p>
          <div className="flex gap-4 pt-2">
            <Button className="gap-2 bg-red-700 hover:bg-red-800">
              <MessageSquareIcon className="h-4 w-4" />
              {comments?.length} Comments
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
  );
}
