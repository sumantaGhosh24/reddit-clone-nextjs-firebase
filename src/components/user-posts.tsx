"use client";

import {useEffect, useState} from "react";
import {collection, onSnapshot, query, where} from "firebase/firestore";

import {db} from "@/firebase/firebase";

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

export default function UserPosts({username}: {username: string}) {
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (username.trim() === "") {
      return;
    }
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("username", "==", username));
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
      const userDoc = querySnapshot.docs[0];
      if (userDoc) {
        setUser(userDoc.id);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [username]);

  useEffect(() => {
    if (user === "") return;
    const postQuery = query(
      collection(db, "posts"),
      where("createdBy", "==", user)
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
  }, [user]);

  return (
    <div className="mt-5">
      <h2 className="text-2xl font-semibold mb-5">User Posts</h2>
      <div className="flex flex-col gap-3">
        {posts && posts.map((post) => <PostCard key={post.id} {...post} />)}
      </div>
    </div>
  );
}
