"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {ChevronDownIcon} from "lucide-react";

import {db} from "@/firebase/firebase";
import {useFirebase} from "@/firebase/auth-context";

import {Button} from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface CommunityProps {
  id: string;
  title: string;
  members: string[];
}

const MyCommunities = () => {
  const firebase = useFirebase();

  const [community, setCommunity] = useState<CommunityProps[]>([]);

  useEffect(() => {
    const communityQuery = query(
      collection(db, "communities"),
      where("members", "array-contains", `${firebase.authUser?.id}`)
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
  }, [firebase.authUser]);

  return (
    <>
      {community.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              Communities
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {community.map((c) => (
              <DropdownMenuItem key={c.id}>
                <Link href={`/r/${c.id}`} className="w-full">
                  r/{c.title.substring(0, 10)}...
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default MyCommunities;
