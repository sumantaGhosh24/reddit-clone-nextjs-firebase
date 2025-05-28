"use client";

import {toast} from "react-toastify";

import {useFirebase} from "@/firebase/auth-context";
import SubredditNav from "@/components/subreddit-nav";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const firebase = useFirebase();

  if (!firebase.authUser) {
    toast.error("Please login to access this page.", {
      toastId: "login-required",
    });
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SubredditNav />
      <div className="container mx-auto">{children}</div>
    </div>
  );
}
