"use client";

import {FormEvent, useState} from "react";
import Image from "next/image";
import {doc, updateDoc} from "firebase/firestore";
import {toast} from "react-toastify";
import {CloudUpload} from "lucide-react";

import {useFirebase} from "@/firebase/auth-context";
import {db} from "@/firebase/firebase";
import {deleteImage, uploadImage} from "@/firebase/storage";

import {Button} from "./ui/button";

interface UpdateProfileImageProps {
  username: string;
}

const UpdateProfileImage = ({username}: UpdateProfileImageProps) => {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  const firebase = useFirebase();

  if (firebase.authUser?.username !== username) return null;

  const handleUpdateImage = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      await deleteImage(firebase.authUser?.imageUrl);
      const imageUrl = await uploadImage(file, "users");
      const obj = {imageUrl};
      await updateDoc(
        doc(db, "users", firebase!.authUser!.id),
        {...(obj as any)},
        {merge: true}
      );
      toast.success("Image updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdateImage} className="mt-6 p-4 rounded">
      <Image
        src={
          file ? URL.createObjectURL(file as any) : firebase?.authUser?.imageUrl
        }
        alt="avatar"
        height={100}
        width={100}
        className="block h-24 w-24 rounded-full bg-black mx-auto mb-5"
      />
      <label htmlFor="file" className="flex items-center gap-3 mb-4">
        Profile Image <CloudUpload size={48} />{" "}
      </label>
      <input
        type="file"
        id="file"
        onChange={(e: any) => setFile(e.target.files[0])}
        className="hidden"
      />
      <Button
        type="submit"
        className="bg-red-700 text-white hover:bg-red-800 transition-colors disabled:bg-red-300"
        disabled={loading}
      >
        {loading ? "Processing" : "Update Image"}
      </Button>
    </form>
  );
};

export default UpdateProfileImage;
