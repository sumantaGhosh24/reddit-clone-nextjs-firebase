"use client";

import {useEffect, useState} from "react";
import {collection, limit, onSnapshot, query, where} from "firebase/firestore";

import {db} from "@/firebase/firebase";
import {useFirebase} from "@/firebase/auth-context";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {Button} from "./ui/button";
import {Input} from "./ui/input";
import FindCommunity from "./find-community";

interface SearchCommunityProps {
  id: string;
  title: string;
  description: string;
  image: string;
  banner: string;
  createdBy: string;
  members: string[];
  timestamp: any;
}

const SearchCommunity = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCommunity, setSearchCommunity] = useState<
    SearchCommunityProps[]
  >([]);

  const firebase = useFirebase();

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchCommunity([]);
      return;
    }
    const communitiesRef = collection(db, "communities");
    const communityQuery = query(
      communitiesRef,
      where("title", ">=", searchQuery),
      limit(5)
    );
    const unsubscribe = onSnapshot(communityQuery, (querySnapshot) => {
      const foundCommunities: SearchCommunityProps[] = [];
      querySnapshot.forEach((doc) => {
        foundCommunities.push({
          id: doc.id,
          ...doc.data(),
        } as SearchCommunityProps);
        setSearchCommunity(foundCommunities);
      });
      return () => {
        unsubscribe();
      };
    });
  }, [searchQuery]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-red-700 hover:bg-red-800">
          Search Community
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold mb-4">
            Search Community
          </DialogTitle>
        </DialogHeader>
        <div>
          <form>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Search community..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded border border-gray-300 p-2"
            />
          </form>
          <div className="flex flex-col gap-4 mt-3">
            {searchCommunity.length < 1 ? (
              <p className="font-bold">No community found.</p>
            ) : (
              searchCommunity.map((community) => (
                <FindCommunity
                  key={community.id}
                  currentUser={firebase!.authUser!.id}
                  id={community.id}
                  image={community.image}
                  title={community.title}
                  createdBy={community.createdBy}
                  members={community.members}
                />
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchCommunity;
