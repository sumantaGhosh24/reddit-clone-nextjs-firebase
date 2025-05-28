"use client";

import {useState} from "react";
import Image from "next/image";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {toast} from "react-toastify";
import {UploadCloud} from "lucide-react";

import {db} from "@/firebase/firebase";
import {useFirebase} from "@/firebase/auth-context";
import {uploadImage} from "@/firebase/storage";
import {CreatePostValidation} from "@/validation/post";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {Textarea} from "./ui/textarea";

interface CreatePostDialogProps {
  id: string;
  createdBy: string;
}

export default function CreatePostDialog({
  id,
  createdBy,
}: CreatePostDialogProps) {
  const firebase = useFirebase();

  if (firebase.authUser?.id !== createdBy) return null;

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const form = useForm<z.infer<typeof CreatePostValidation>>({
    resolver: zodResolver(CreatePostValidation),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreatePostValidation>) => {
    setLoading(true);

    try {
      if (image) {
        const imageUrl = await uploadImage(image, "posts");

        await addDoc(collection(db, "posts"), {
          title: values.title,
          content: values.content,
          image: imageUrl,
          community: id,
          createdBy: firebase.authUser?.id,
          upVotes: [],
          downVotes: [],
          comments: [],
          timestamp: serverTimestamp(),
        });

        form.reset();
        setImage(null);

        toast.success("Post created successfully.");
      } else {
        await addDoc(collection(db, "posts"), {
          title: values.title,
          content: values.content,
          community: id,
          createdBy: firebase.authUser?.id,
          upVotes: [],
          downVotes: [],
          comments: [],
          timestamp: serverTimestamp(),
        });

        form.reset();

        toast.success("Post created successfully.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-fit bg-red-700 hover:bg-red-800">
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold mb-4">
            Create a post
          </DialogTitle>
        </DialogHeader>
        <div>
          <div>
            <Image
              src={
                image
                  ? URL.createObjectURL(image as any)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="avatar"
              height={400}
              width={600}
              className="h-[250px] w-[75%] rounded mb-5 mx-auto"
            />
          </div>
          <label
            htmlFor="image"
            className="flex items-center gap-3 mb-5 cursor-pointer"
          >
            Post Image <UploadCloud size={48} />
          </label>
          <input
            type="file"
            id="image"
            onChange={(e: any) => setImage(e.target.files[0])}
            className="hidden"
          />
          <Form {...form}>
            <form className="mb-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="title"
                render={({field}) => (
                  <FormItem className="mb-4 w-full">
                    <FormLabel className="block text-gray-600">
                      Post Title
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
                name="content"
                render={({field}) => (
                  <FormItem className="mb-4 w-full">
                    <FormLabel className="block text-gray-600">
                      Post Content
                    </FormLabel>
                    <FormControl>
                      <Textarea
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
                className="bg-red-700 text-white hover:bg-red-800 transition-colors disabled:bg-red-300 mt-5"
                disabled={loading}
              >
                {loading ? "Processing..." : "Create Post"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
