"use client";

import {useState, useEffect, FormEvent} from "react";
import Image from "next/image";
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import {toast} from "react-toastify";

import {useFirebase} from "@/firebase/auth-context";
import {db} from "@/firebase/firebase";

import CreatePostDialog from "./create-post-dialog";
import {Button} from "./ui/button";

interface CommunityCardProps {
  id: string;
}

interface CommunityProps {
  id: string;
  title: string;
  description: string;
  image: string;
  banner: string;
  createdBy: string;
  members: string[];
  timestamp: any;
}

const CommunityCard = ({id}: CommunityCardProps) => {
  const [community, setCommunity] = useState<CommunityProps | null>(null);

  const firebase = useFirebase();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "communities", id), (doc) => {
      setCommunity({...doc.data(), id: doc.id} as CommunityProps);
      setIsAdmin(doc.data()?.createdBy === firebase?.authUser?.id);
      setIsMember(doc.data()?.members.includes(firebase?.authUser?.id));
    });
    return () => unsubscribe();
  }, [id]);

  const joinCommunity = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (isAdmin) return;

      if (isMember) {
        await updateDoc(doc(db, "communities", id), {
          members: arrayRemove(firebase?.authUser?.id),
        });
        toast.success("Remove from community!");
      } else {
        await updateDoc(doc(db, "communities", id), {
          members: arrayUnion(firebase?.authUser?.id),
        });
        toast.success("Community joined successfully!");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!community) return <p>Loading...</p>;

  return (
    <div className="bg-white shadow-md rounded-md p-3 my-5">
      <Image
        src={community.banner}
        alt="banner"
        height={400}
        width={800}
        className="h-[250px] w-full rounded object-cover"
      />
      <div className="flex items-center gap-4 mt-3">
        <Image
          src={community.image}
          alt="avatar"
          height={100}
          width={100}
          className="h-24 w-24 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">r/{community.title}</h1>
          <p className="text-muted-foreground">r/{community.description}</p>
          <p className="text-sm text-muted-foreground">
            {community.members.length} members
          </p>
        </div>
        <div className="ml-auto">
          {isAdmin ? (
            <CreatePostDialog
              id={community.id}
              createdBy={community.createdBy}
            />
          ) : isMember ? (
            <Button
              onClick={joinCommunity}
              className="bg-red-700 hover:bg-red-800"
            >
              Leave Community
            </Button>
          ) : (
            <Button
              onClick={joinCommunity}
              className="bg-red-700 hover:bg-red-800"
            >
              Join Community
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityCard;
