import { z } from "zod";

// const EMAIL_REGEX = /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i

const EMAIL_SCHEMA = z
  .string()
  .min(1, "Email Address is required.")
  .email("Invalid Email Address.");

export const loginSchema = z.object({
  email: EMAIL_SCHEMA,
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
  email: EMAIL_SCHEMA,
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

export const resendSchema = z.object({
  email: EMAIL_SCHEMA,
});

export const resetPasswordSchema = z.object({
  email: EMAIL_SCHEMA,
});

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required.")
      .min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Confirm Password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password doesn't match.",
    path: ["confirmPassword"],
  });
