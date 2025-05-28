import * as z from "zod";

export const CreatePostValidation = z.object({
  title: z
    .string()
    .min(3, {message: "minimum 3 characters long"})
    .max(50, {message: "maximum 50 characters long"}),
  content: z
    .string()
    .min(10, {message: "minimum 10 characters long"})
    .max(500, {message: "maximum 500 characters long"}),
});
