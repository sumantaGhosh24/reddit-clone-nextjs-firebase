import * as z from "zod";

export const CreateCommunityValidation = z.object({
  title: z
    .string()
    .min(3, {message: "minimum 3 characters long"})
    .max(20, {message: "maximum 20 characters long"}),
  description: z
    .string()
    .min(3, {message: "minimum 3 characters long"})
    .max(200, {message: "maximum 200 characters long"}),
});
