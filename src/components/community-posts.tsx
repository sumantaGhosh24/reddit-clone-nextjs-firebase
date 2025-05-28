"use client";

import {useState, useEffect} from "react";
import {collection, onSnapshot, query, where} from "firebase/firestore";

import {db} from "@/firebase/firebase";

import PostCard from "./post-card";

interface CommunityPostsProps {
  id: string;
}

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

const CommunityPosts = ({id}: CommunityPostsProps) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const postQuery = query(
      collection(db, "posts"),
      where("community", "==", id)
    );
    const unsubscribe = onSnapshot(postQuery, (querySnapshot) => {
      const foundPost: Post[] = [];
      querySnapshot.forEach((doc) => {
        foundPost.push({id: doc.id, ...doc.data()} as Post);
      });
      setPosts(foundPost);
    });
    return () => {
      unsubscribe();
    };
  }, [id]);

  return (
    <div className="flex flex-col gap-3">
      {posts && posts.map((post) => <PostCard key={post.id} {...post} />)}
    </div>
  );
};

export default CommunityPosts;
