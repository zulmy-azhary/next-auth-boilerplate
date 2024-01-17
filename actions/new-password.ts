"use server";

import { newPasswordSchema } from "@/schemas";
import {
  deleteResetPasswordTokenById,
  getResetPasswordToken,
} from "@/services/reset-password-token";
import { getUserByEmail, updateUserById } from "@/services/user";
import { redirect } from "next/navigation";
import { z } from "zod";
import { hashPassword, isExpired, response } from "@/lib/utils";

export const newPassword = async (payload: z.infer<typeof newPasswordSchema>, token: string) => {
  // Check if user input is not valid, then return an error.
  const validatedFields = newPasswordSchema.safeParse(payload);
  if (!validatedFields.success) {
    return response({
      success: false,
      error: {
        code: 422,
        message: "Invalid fields.",
      },
    });
  }

  const { password } = validatedFields.data;

  // Check if token doesn't exist, then redirect to login page.
  const existingToken = await getResetPasswordToken(token);
  if (!existingToken) redirect("/");

  // Check if token has expired, then return an error.
  const hasExpired = isExpired(existingToken.expires);
  if (hasExpired) {
    return response({
      success: false,
      error: {
        code: 401,
        message: "Token has expired. Please resend to your email.",
      },
    });
  }

  // Check if email address doesn't exist, then return an error.
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return response({
      success: false,
      error: {
        code: 401,
        message: "Email address does not exist.",
      },
    });
  }

  // Create new password by hashing the password first.
  const hashedPassword = await hashPassword(password);

  // Replace the old password with the new one.
  await updateUserById(existingUser.id, {
    password: hashedPassword,
  });
  // Delete reset password token.
  await deleteResetPasswordTokenById(existingToken.id);

  // Then return response success.
  return response({
    success: true,
    code: 200,
    message: "Your password has been reset successfully.",
  });
};
