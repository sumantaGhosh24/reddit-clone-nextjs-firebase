"use client";

import {useFirebase} from "@/firebase/auth-context";

import MyCommunities from "./my-communities";
import CreateCommunity from "./create-community";
import SearchCommunity from "./search-community";

export default function SubredditNav() {
  const firebase = useFirebase();

  if (!firebase.authUser) return null;

  return (
    <nav className="border-b bg-background/95 backdrop-blur">
      <div className="flex h-12 items-center px-4 gap-4 overflow-x-auto">
        <MyCommunities />
        <CreateCommunity />
        <SearchCommunity />
      </div>
    </nav>
  );
}
