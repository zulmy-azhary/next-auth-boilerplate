"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/schemas";
import { z } from "zod";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/services/user";
import bcrypt from "bcryptjs";
import { generateTwoFactorToken } from "@/services/two-factor-token";
import { sendTwoFactorEmail } from "@/services/mail";
import { cookies } from "next/headers";
import {
  getTwoFactorConfirmationByUserId,
  deleteTwoFactorConfirmationById,
} from "@/services/two-factor-confirmation";
import { isExpired, signJwt } from "@/lib/utils";

export const login = async (payload: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(payload);

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { email, password } = validatedFields.data;

  // Check if user, email and password doesn't exist, then return an error.
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials." };
  }

  // Check if passwords doesn't matches, then return an error.
  const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordMatch) {
    return { error: "Invalid credentials." };
  }

  // Check if user email isn't verified yet, then return an error.
  if (!existingUser.emailVerified) {
    return { error: "Your email address is not verified yet. Please check your email." };
  }

  // Check if user's 2FA are enabled
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    const existingTwoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
    const hasExpired = isExpired(existingTwoFactorConfirmation?.expires!);

    // If two factor confirmation exist and expired, then delete it.
    if (existingTwoFactorConfirmation && hasExpired) {
      await deleteTwoFactorConfirmationById(existingTwoFactorConfirmation.id);
    }

    // If two factor confirmation doesn't exist or if two factor confirmation has expired, then handle 2fa
    if (!existingTwoFactorConfirmation || hasExpired) {
      const cookieStore = cookies();
      const token = signJwt(validatedFields.data);
      cookieStore.set("credentials-session", token);

      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  return await signInCredentials(email, password);
};

// Sign in credentials from next-auth
export const signInCredentials = async (email: string, password: string) => {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          // { status: true, statusCode: 403, message: "Invalid credentials." }
          return { error: "Invalid credentials." };

        case "OAuthAccountNotLinked":
          return {
            error:
              "Another account already registered with the same Email Address. Please login the different one.",
          };

        case "Verification":
          return { error: "Verification failed. Please try again." };

        case "AuthorizedCallbackError":
          return { error: "Authorization failed. Please try again." };

        default:
          return { error: "Something went wrong." };
      }
    }

    throw error;
  }
};
