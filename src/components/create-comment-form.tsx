"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {arrayUnion, doc, updateDoc} from "firebase/firestore";
import {toast} from "react-toastify";

import {db} from "@/firebase/firebase";
import {useFirebase} from "@/firebase/auth-context";
import {CreateCommentValidation} from "@/validation/comment";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

interface CreateCommentFormProps {
  postId: string;
  username: string;
}

export default function CreateCommentForm({
  postId,
  username,
}: CreateCommentFormProps) {
  const firebase = useFirebase();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof CreateCommentValidation>>({
    resolver: zodResolver(CreateCommentValidation),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateCommentValidation>) => {
    setLoading(true);

    try {
      await updateDoc(doc(db, "posts", postId), {
        comments: arrayUnion({
          user: firebase!.authUser!.id,
          username,
          message: values.message,
          timestamp: new Date(),
        }),
      });

      form.reset();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="text-2xl font-bold mb-3">Leave a Comment</h2>
          <FormField
            control={form.control}
            name="message"
            render={({field}) => (
              <FormItem className="mb-4 w-full">
                <FormLabel className="block text-gray-600">
                  Comment Message
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
            {loading ? "Processing..." : "Create Message"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
