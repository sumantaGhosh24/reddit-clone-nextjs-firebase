"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {collection, onSnapshot, query, where} from "firebase/firestore";

import {db} from "@/firebase/firebase";

interface CommunityProps {
  id: string;
  title: string;
  members: string[];
}

export default function UserCommunities({username}: {username: string}) {
  const [user, setUser] = useState("");
  const [community, setCommunity] = useState<CommunityProps[]>([]);

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
    const communityQuery = query(
      collection(db, "communities"),
      where("members", "array-contains", `${user}`)
    );
    const unsubscribe = onSnapshot(communityQuery, (querySnapshot) => {
      const foundCommunity: CommunityProps[] = [];
      querySnapshot.forEach((doc) => {
        foundCommunity.push({id: doc.id, ...doc.data()} as CommunityProps);
      });
      setCommunity(foundCommunity);
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <div className="mt-5">
      <h2 className="text-2xl font-semibold mb-5">User Communities</h2>
      <div className="flex flex-col gap-3">
        {community &&
          community.map((c) => (
            <div key={c.id} className="bg-gray-200 p-2 rounded">
              <Link href={`/r/${c.id}`} className="w-full">
                r/{c.title}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
