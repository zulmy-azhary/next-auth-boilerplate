"use server";

import { z } from "zod";
import { resetPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/services/user";
import { generateResetPasswordToken } from "@/services/reset-password-token";
import { sendResetPasswordEmail } from "@/services/mail";

export const resetPassword = async (payload: z.infer<typeof resetPasswordSchema>) => {
  const validatedFields = resetPasswordSchema.safeParse(payload);
  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist." };
  }

  const resetPasswordToken = await generateResetPasswordToken(email);
  await sendResetPasswordEmail(resetPasswordToken.email, resetPasswordToken.token);

  return { success: "Email has been sent. Please check to your email." };
};
