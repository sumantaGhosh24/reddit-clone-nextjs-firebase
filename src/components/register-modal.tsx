"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {doc, serverTimestamp, setDoc} from "firebase/firestore";
import {toast} from "react-toastify";
import {UploadCloud} from "lucide-react";

import {useFirebase} from "@/firebase/auth-context";
import {db} from "@/firebase/firebase";
import {uploadImage} from "@/firebase/storage";
import {RegisterValidation} from "@/validation/user";

import {Button} from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {Input} from "./ui/input";

const RegisterModal = () => {
  const router = useRouter();
  const firebase = useFirebase();

  if (firebase.authUser) return null;

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");

  const form = useForm<z.infer<typeof RegisterValidation>>({
    resolver: zodResolver(RegisterValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      cf_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterValidation>) => {
    setLoading(true);

    try {
      if (file === "" || file === null)
        return toast.error("Please upload an image.");

      const {firstName, lastName, username, email, password} = values;

      const imageUrl = await uploadImage(file, "users");
      const res: any = await firebase.signUp(email, password);

      await setDoc(doc(db, "users", res.user.uid), {
        firstName,
        lastName,
        username,
        email,
        imageUrl,
        timestamp: serverTimestamp(),
      });

      toast.success("Register Successful!");

      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-red-700 hover:bg-red-800">Sign Up</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold mb-4">
            User Registration
          </DialogTitle>
        </DialogHeader>
        <div>
          <div>
            <Image
              src={
                file
                  ? URL.createObjectURL(file as any)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="avatar"
              height={400}
              width={600}
              className="h-[250px] w-[75%] rounded mb-5 mx-auto"
            />
          </div>
          <label
            htmlFor="file"
            className="flex items-center gap-3 mb-5 cursor-pointer"
          >
            Profile Image <UploadCloud size={48} />
          </label>
          <input
            type="file"
            id="file"
            onChange={(e: any) => setFile(e.target.files[0])}
            className="hidden"
          />
          <Form {...form}>
            <form className="mb-6" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({field}) => (
                    <FormItem className="mb-4 w-full">
                      <FormLabel className="block text-gray-600">
                        First Name
                      </FormLabel>
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
                    <FormItem className="mb-4 w-full">
                      <FormLabel className="block text-gray-600">
                        Last Name
                      </FormLabel>
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
              </div>
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({field}) => (
                    <FormItem className="mb-4 w-full">
                      <FormLabel className="block text-gray-600">
                        Username
                      </FormLabel>
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
                  name="email"
                  render={({field}) => (
                    <FormItem className="mb-4 w-full">
                      <FormLabel className="block text-gray-600">
                        Email
                      </FormLabel>
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
              </div>
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({field}) => (
                    <FormItem className="mb-4 w-full">
                      <FormLabel className="block text-gray-600">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
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
                  name="cf_password"
                  render={({field}) => (
                    <FormItem className="mb-4 w-full">
                      <FormLabel className="block text-gray-600">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          className="w-full rounded border border-gray-300 p-2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="submit"
                className="bg-red-700 text-white hover:bg-red-800 transition-colors disabled:bg-red-300"
                disabled={loading}
              >
                {loading ? "Processing..." : "Register"}
              </Button>
            </form>
          </Form>
          <div className="text-center">
            Already have an account?
            <Link href="/login" className="text-red-500 ml-2 hover:underline">
              login
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
