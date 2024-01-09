import { z } from "zod";

// const EMAIL_REGEX = /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i

export const loginSchema = z.object({
  email: z.string().min(1, "Email Address is required.").email("Email Address is required."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
  email: z.string().min(1, "Email Address is required.").email("Invalid Email Address."),
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .min(4, "Name must be at least 4 characters."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must be at least 6 characters."),
});
