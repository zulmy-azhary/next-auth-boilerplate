"use server";

import { registerSchema } from "@/schemas";
import { z } from "zod";
import { createUser, getUserByEmail } from "@/services/user";
import { generateVerificationToken } from "@/services/verification-token";
import { sendVerificationEmail } from "@/services/mail";
import { hashPassword, response } from "@/lib/utils";

export const register = async (payload: z.infer<typeof registerSchema>) => {
  // Check if user input is not valid.
  const validatedFields = registerSchema.safeParse(payload);
  if (!validatedFields.success) {
    return response({
      success: false,
      error: {
        code: 422,
        message: "Invalid fields.",
      },
    });
  }
  const { name, email, password } = validatedFields.data;

  // Check if user already exist, then return an error.
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return response({
      success: false,
      error: {
        code: 422,
        message: "Email address already exists. Please use another one.",
      },
    });
  }

  // Hash password that user entered.
  const hashedPassword = await hashPassword(password);

  // Create an user.
  await createUser({ name, email, password: hashedPassword });

  // Generate verification token, then send it to the email.
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  // Return response success.
  return response({
    success: true,
    code: 201,
    message: "Confirmation email sent. Please check your email.",
  });
};
