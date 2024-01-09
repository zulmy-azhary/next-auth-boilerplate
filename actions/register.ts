"use server";

import { registerSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail } from "@/services/user";
import { generateVerificationToken } from "@/services/verification-token";
import { sendVerificationEmail } from "@/services/mail";

export const register = async (payload: z.infer<typeof registerSchema>) => {
  const validatedFields = registerSchema.safeParse(payload);

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email Address already exists. Please use another one." };
  }

  await createUser({ name, email, password: hashedPassword });

  // ! Send Verification Token
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent. Please check your email." };
};
