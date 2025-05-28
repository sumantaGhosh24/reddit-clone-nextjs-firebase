"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";

import {useFirebase} from "@/firebase/auth-context";

import LoginModal from "./login-modal";
import RegisterModal from "./register-modal";

const Navbar = () => {
  const router = useRouter();
  const firebase = useFirebase();

  const handleLogout = async () => {
    try {
      await firebase.handleLogout();

      toast.success("Logged out successfully!");

      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">Reddit Clone</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {firebase.authUser ? (
            <>
              <Link href={`/user/${firebase.authUser.username}`}>Profile</Link>
              <button onClick={handleLogout} className="cursor-pointer">
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <LoginModal />
              <RegisterModal />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
