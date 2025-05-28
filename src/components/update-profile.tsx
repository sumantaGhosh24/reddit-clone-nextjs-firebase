"use client";

import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {doc, onSnapshot, updateDoc} from "firebase/firestore";
import {toast} from "react-toastify";

import {useFirebase} from "@/firebase/auth-context";
import {db} from "@/firebase/firebase";
import {ProfileValidation} from "@/validation/user";

import {Button} from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {Input} from "./ui/input";

interface UpdateProfileProps {
  username: string;
}

const UpdateProfile = ({username}: UpdateProfileProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
  });

  const firebase = useFirebase();

  if (firebase.authUser?.username !== username) return null;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", firebase!.authUser!.id),
      (doc) => {
        setData({
          firstName: doc.data()?.firstName,
          lastName: doc.data()?.lastName,
        });
      }
    );
    return () => {
      unsubscribe();
    };
  }, [firebase?.authUser?.id]);

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    values: {
      firstName: data.firstName,
      lastName: data.lastName,
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileValidation>) => {
    setLoading(true);

    try {
      await updateDoc(
        doc(db, "users", firebase!.authUser!.id),
        {...(values as any)},
        {merge: true}
      );
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 rounded">
        <FormField
          control={form.control}
          name="firstName"
          render={({field}) => (
            <FormItem className="mb-4">
              <FormLabel className="block text-gray-600">First Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="w-full rounded border border-gray-300 p-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({field}) => (
            <FormItem className="mb-4">
              <FormLabel className="block text-gray-600">Last Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="w-full rounded border border-gray-300 p-2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-red-700 text-white hover:bg-red-800 transition-colors disabled:bg-red-300"
          disabled={loading}
        >
          {loading ? "Processing" : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default UpdateProfile;
