"use server";

import { loginSchema, twoFactorSchema } from "@/schemas";
import { z } from "zod";
import { getUserByEmail } from "@/services/user";
import {
  deleteTwoFactorTokenById,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "@/services/two-factor-token";
import { isExpired, response } from "@/lib/utils";
import { generateTwoFactorConfirmation } from "@/services/two-factor-confirmation";
import { signInCredentials } from "@/actions/login";
import { cookies } from "next/headers";
import { sendTwoFactorEmail } from "@/services/mail";

export const twoFactor = async (
  payload: z.infer<typeof twoFactorSchema>,
  credentials: z.infer<typeof loginSchema>
) => {
  // Check if user input is not valid.
  const validatedFields = twoFactorSchema.safeParse(payload);
  if (!validatedFields.success) {
    return response({
      success: false,
      error: {
        code: 422,
        message: "Invalid fields.",
      },
    });
  }

  const { code } = validatedFields.data;

  // Check if email address doesn't exist, then return an error.
  const existingUser = await getUserByEmail(credentials.email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return response({
      success: false,
      error: {
        code: 401,
        message: "Email address does not exist.",
      },
    });
  }

  // Check if token invalid or doesn't exist, then return an error.
  const twoFactorToken = await getTwoFactorTokenByEmail(credentials.email);
  if (!twoFactorToken || twoFactorToken.token !== code) {
    return response({
      success: false,
      error: {
        code: 422,
        message: "Invalid code.",
      },
    });
  }

  // Check if token has expired. then return an error.
  const hasExpired = isExpired(twoFactorToken.expires);
  if (hasExpired) {
    return response({
      success: false,
      error: {
        code: 401,
        message: "Code has been expired. Please resend the 2FA code to your email.",
      },
    });
  }

  // Delete two factor token, and generate two factor confirmation
  await deleteTwoFactorTokenById(twoFactorToken.id);
  await generateTwoFactorConfirmation(existingUser.id);

  // Delete credentials-session's payload from login page.
  const cookieStore = cookies();
  cookieStore.delete("credentials-session");

  // Then try to sign in with next-auth credentials.
  return await signInCredentials(credentials.email, credentials.password);
};

// Resend Two Factor Authentication
export const resendTwoFactor = async (email: string) => {
  // Check if email doesn't exist to generate token, then return an error.
  const twoFactorToken = await generateTwoFactorToken(email);
  if (!twoFactorToken) {
    return response({
      success: false,
      error: {
        code: 422,
        message: "Failed to resend two factor authentication.",
      },
    });
  }

  // Send two factor authentication code to the email.
  await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);
  return response({
    success: true,
    code: 201,
    message: "Two factor authentication code has been sent to your email.",
  });
};
