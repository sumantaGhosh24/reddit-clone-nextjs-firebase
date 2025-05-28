"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "react-toastify";

import {useFirebase} from "@/firebase/auth-context";
import {LoginValidation} from "@/validation/user";

import {Button} from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {Input} from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

const LoginModal = () => {
  const firebase = useFirebase();
  const router = useRouter();

  if (firebase.authUser) return null;

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginValidation>>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginValidation>) => {
    setLoading(true);

    try {
      const {email, password} = values;
      await firebase.signIn(email, password);

      toast.success("Login Successful!");

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
        <Button variant="outline">Log In</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl font-semibold mb-4">
            User Login
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form className="mb-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({field}) => (
                  <FormItem className="mb-4">
                    <FormLabel className="block text-gray-600">Email</FormLabel>
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
                name="password"
                render={({field}) => (
                  <FormItem className="mb-4">
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
              <Button
                type="submit"
                className="bg-red-700 text-white hover:bg-red-800 transition-colors disabled:bg-red-300"
                disabled={loading}
              >
                {loading ? "Processing..." : "Login"}
              </Button>
            </form>
          </Form>
          <div className="text-center">
            <p>
              Don&apos;t have an account?
              <Link
                href="/register"
                className="text-red-500 ml-2 hover:underline"
              >
                register
              </Link>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
