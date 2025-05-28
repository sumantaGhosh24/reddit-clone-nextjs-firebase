"use client";

import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {toast} from "react-toastify";
import {Plus, UserCheck, UserCog} from "lucide-react";

import {db} from "@/firebase/firebase";

import {Button} from "./ui/button";

interface FindCommunityProps {
  currentUser: string;
  id: string;
  image: string;
  title: string;
  createdBy: string;
  members: string[];
}

const FindCommunity = ({
  currentUser,
  id,
  image,
  title,
  createdBy,
  members,
}: FindCommunityProps) => {
  const [isAdmin] = useState(currentUser === createdBy);
  const [isMember, setIsMember] = useState(members.includes(currentUser));

  const router = useRouter();

  const joinCommunity = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "communities", id), {
        members: arrayUnion(currentUser),
      });

      setIsMember(true);

      toast.success("Joined community successfully.");

      router.push(`/r/${id}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-red-700 text-white rounded">
      <div className="flex items-center justify-between gap-5 p-3">
        <Image
          src={image}
          alt="community"
          className="h-12 w-12 rounded-full"
          height={100}
          width={100}
        />
        <p
          className="text-lg font-bold capitalize underline cursor-pointer"
          onClick={() => router.push(`/r/${id}`)}
        >
          {title}
        </p>
        {isAdmin ? (
          <Button
            onClick={() => toast.info("You are admin of this community.")}
          >
            <UserCog size={24} />
          </Button>
        ) : isMember ? (
          <Button
            onClick={() => toast.info("You are member of this community.")}
          >
            <UserCheck size={24} />
          </Button>
        ) : (
          <Button onClick={joinCommunity}>
            <Plus size={24} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FindCommunity;
