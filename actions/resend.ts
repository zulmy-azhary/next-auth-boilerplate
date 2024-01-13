"use server";

import { resendSchema } from "@/schemas";
import { sendVerificationEmail } from "@/services/mail";
import { generateVerificationToken, getVerificationTokenByEmail } from "@/services/verification-token";
import { z } from "zod";

export const resendToken = async (payload: z.infer<typeof resendSchema>) => {
  const validatedFields = resendSchema.safeParse(payload);
  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { email } = validatedFields.data;

  const existingToken = await getVerificationTokenByEmail(email);
  if (!existingToken) {
    return { error: "Failed to resend verification email." };
  }
  
  const verificationToken = await generateVerificationToken(existingToken.email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent. Please check your email." };
}