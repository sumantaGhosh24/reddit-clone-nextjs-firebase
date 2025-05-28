import * as z from "zod";

export const RegisterValidation = z
  .object({
    firstName: z
      .string()
      .min(3, {message: "minimum 3 characters long"})
      .max(20, {message: "maximum 20 characters long"}),
    lastName: z
      .string()
      .min(3, {message: "minimum 3 characters long"})
      .max(20, {message: "maximum 20 characters long"}),
    username: z
      .string()
      .min(5, {message: "minimum 5 characters long"})
      .max(20, {message: "maximum 20 characters long"}),
    email: z.string().email().min(1),
    password: z.string().min(6, {message: "minimum 6 characters long"}),
    cf_password: z.string().min(6, {message: "minimum 6 characters long"}),
  })
  .refine((data) => data.password === data.cf_password, {
    message: "password and confirm password not match.",
    path: ["cf_password"],
  });

export const LoginValidation = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
});

export const ProfileValidation = z.object({
  firstName: z
    .string()
    .min(3, {message: "minimum 3 characters long"})
    .max(20, {message: "maximum 20 characters long"}),
  lastName: z
    .string()
    .min(3, {message: "minimum 3 characters long"})
    .max(20, {message: "maximum 20 characters long"}),
});
