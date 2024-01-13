"use server";

import { newPasswordSchema } from "@/schemas";
import { getResetPasswordToken } from "@/services/reset-password-token";
import { getUserByEmail } from "@/services/user";
import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const newPassword = async (payload: z.infer<typeof newPasswordSchema>, token: string) => {
  const validatedFields = newPasswordSchema.safeParse(payload);
  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { password } = validatedFields.data;

  const existingToken = await getResetPasswordToken(token);
  if (!existingToken) redirect("/");

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired. Please resend to your email." };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist." };
  }

  const hashedPassword = await bcrypt.hash(password, bcrypt.genSaltSync());

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.resetPasswordToken.delete({
    where: { id: existingToken.id }
  });

  return { success: "Your password has been reset successfully." };
};
