"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {
  addDoc,
  arrayUnion,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import {toast} from "react-toastify";
import {UploadCloud} from "lucide-react";

import {db} from "@/firebase/firebase";
import {useFirebase} from "@/firebase/auth-context";
import {uploadImage} from "@/firebase/storage";
import {CreateCommunityValidation} from "@/validation/community";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
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
import {Textarea} from "./ui/textarea";

const CreateCommunity = () => {
  const firebase = useFirebase();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [banner, setBanner] = useState(null);

  const form = useForm<z.infer<typeof CreateCommunityValidation>>({
    resolver: zodResolver(CreateCommunityValidation),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof CreateCommunityValidation>
  ) => {
    setLoading(true);

    try {
      if (!image || !banner) return toast.error("Please upload an image.");

      const {title, description} = values;

      const imageUrl = await uploadImage(image, "communities");
      const bannerUrl = await uploadImage(banner, "communities");

      const res = await addDoc(collection(db, "communities"), {
        title,
        description,
        image: imageUrl,
        banner: bannerUrl,
        createdBy: firebase.authUser?.id,
        members: arrayUnion(firebase.authUser?.id),
        timestamp: serverTimestamp(),
      });

      form.reset();
      setImage(null);
      setBanner(null);

      toast.success("Community created successfully.");

      router.push(`/r/${res.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-red-700 hover:bg-red-800">
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold mb-4">
            Create Community
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
            Community Image <UploadCloud size={48} />
          </label>
          <input
            type="file"
            id="image"
            onChange={(e: any) => setImage(e.target.files[0])}
            className="hidden"
          />
          <div>
            <Image
              src={
                banner
                  ? URL.createObjectURL(banner as any)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="avatar"
              height={400}
              width={600}
              className="h-[250px] w-[75%] rounded mb-5 mx-auto"
            />
          </div>
          <label
            htmlFor="banner"
            className="flex items-center gap-3 mb-5 cursor-pointer"
          >
            Community Banner <UploadCloud size={48} />
          </label>
          <input
            type="file"
            id="banner"
            onChange={(e: any) => setBanner(e.target.files[0])}
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
                      Community Title
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
                name="description"
                render={({field}) => (
                  <FormItem className="mb-4 w-full">
                    <FormLabel className="block text-gray-600">
                      Community Description
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
                className="bg-red-700 text-white hover:bg-red-800 transition-colors disabled:bg-red-300"
                disabled={loading}
              >
                {loading ? "Processing..." : "Create Community"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCommunity;
