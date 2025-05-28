"use client";

import {useState, useEffect} from "react";
import {collection, getDocs, query, where} from "firebase/firestore";
import {toast} from "react-toastify";
import {TrendingUpIcon} from "lucide-react";

import {db} from "@/firebase/firebase";
import {useFirebase} from "@/firebase/auth-context";
import {Card} from "@/components/ui/card";

import PostCard from "./post-card";

interface Post {
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

export default function TrendingPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  const firebase = useFirebase();

  useEffect(() => {
    const unsubscribe = async () => {
      const communitiesRef = collection(db, "communities");
      const qCommunities = query(
        communitiesRef,
        where("members", "array-contains", firebase.authUser?.id)
      );
      const communitySnapshot = await getDocs(qCommunities);

      const communityIds: string[] = [];
      communitySnapshot.forEach((doc) => {
        communityIds.push(doc.id);
      });

      if (communityIds.length === 0) {
        toast.warning("User is not a member of any communities.");
        return;
      }

      const userPosts: Post[] = [];
      for (let i = 0; i < communityIds.length; i++) {
        const qPostsForBatch = query(
          collection(db, "posts"),
          where("community", "==", communityIds[i])
        );
        const postSnapshot = await getDocs(qPostsForBatch);

        postSnapshot.forEach((doc) => {
          userPosts.push({id: doc.id, ...doc.data()} as Post);
        });
      }
      setPosts(userPosts);
    };

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUpIcon className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Trending Today</h2>
      </div>
      <div className="space-y-4">
        {posts && posts.map((post) => <PostCard key={post.id} {...post} />)}
      </div>
    </Card>
  );
}
