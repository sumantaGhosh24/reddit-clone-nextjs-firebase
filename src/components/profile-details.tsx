"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {formatDistanceStrict} from "date-fns";

import {db} from "@/firebase/firebase";

interface ProfileDetailsProps {
  username: string;
}

const ProfileDetails = ({username}: ProfileDetailsProps) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (username.trim() === "") {
      return;
    }
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("username", "==", username));
    const unsubscribe = onSnapshot(userQuery, (querySnapshot) => {
      const userDoc = querySnapshot.docs[0];
      if (userDoc) {
        setUser({...userDoc.data()} as any);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [username]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-5">Profile Details</h2>
      {user && (
        <div className="flex flex-col gap-3">
          <Image
            src={
              user?.imageUrl ??
              "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
            }
            alt="avatar"
            className="h-24 w-24 rounded-full"
            height={100}
            width={100}
          />
          <p>
            <strong>Name: </strong>
            <span className="capitalize">
              {user?.firstName} {user?.lastName}
            </span>
          </p>
          <p>
            <strong>Username: </strong>
            <span>{user?.username}</span>
          </p>
          <p>
            <strong>Email: </strong>
            <span>{user?.email}</span>
          </p>
          <p>
            <strong>Created At: </strong>
            <span>
              {formatDistanceStrict(user?.timestamp?.toDate(), new Date())}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
