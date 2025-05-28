import * as z from "zod";

export const CreateCommentValidation = z.object({
  message: z
    .string()
    .min(10, {message: "minimum 10 characters long"})
    .max(500, {message: "maximum 500 characters long"}),
});
