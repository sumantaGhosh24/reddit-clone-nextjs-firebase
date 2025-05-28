"use client";

import {useState, useEffect} from "react";
import Link from "next/link";
import {collection, getDocs} from "firebase/firestore";

import {db} from "@/firebase/firebase";
import {useFirebase} from "@/firebase/auth-context";
import {Card} from "@/components/ui/card";

interface CommunityProps {
  id: string;
  title: string;
  description: string;
  members: string[];
}

export default function ExploreCommunities() {
  const firebase = useFirebase();

  const [community, setCommunity] = useState<CommunityProps[]>([]);

  useEffect(() => {
    const unsubscribe = async () => {
      const communitiesRef = collection(db, "communities");
      const querySnapshot = await getDocs(communitiesRef);
      const communitiesNotIn: CommunityProps[] = [];
      querySnapshot.forEach((doc) => {
        const communityData = doc.data();
        if (
          !communityData.members ||
          !communityData.members.includes(firebase.authUser?.id)
        ) {
          communitiesNotIn.push({
            id: doc.id,
            ...communityData,
          } as CommunityProps);
        }
      });
      setCommunity(communitiesNotIn);
    };
    return () => {
      unsubscribe();
    };
  }, [firebase.authUser]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Explore Communities</h3>
      <div className="space-y-4">
        {community.map((com) => (
          <div key={com.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Link
                href={`/r/${com.id}`}
                className="text-base font-medium hover:underline"
              >
                r/{com.title}
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">{com.description}</p>
            <p className="text-sm">{com.members.length || 0} members</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
