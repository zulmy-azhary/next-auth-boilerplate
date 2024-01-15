"use server";

import { registerSchema } from "@/schemas";
import { z } from "zod";
import { createUser, getUserByEmail } from "@/services/user";
import { generateVerificationToken } from "@/services/verification-token";
import { sendVerificationEmail } from "@/services/mail";
import { hashPassword } from "@/lib/utils";

export const register = async (payload: z.infer<typeof registerSchema>) => {
  const validatedFields = registerSchema.safeParse(payload);

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await hashPassword(password);

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email address already exists. Please use another one." };
  }

  await createUser({ name, email, password: hashedPassword });

  // ! Send Verification Token
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent. Please check your email." };
};
