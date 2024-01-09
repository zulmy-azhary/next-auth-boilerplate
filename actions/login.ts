"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/schemas";
import { z } from "zod";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/services/user";
import { generateVerificationToken } from "@/services/verification-token";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/services/mail";

export const login = async (payload: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(payload);

  if (!validatedFields.success) {
    return { error: "Invalid credentials." };
  }

  const { email, password } = validatedFields.data;

  // Check if user, email and password are exist
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist." };
  }

  // Check if passwords are matches
  const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordMatch) {
    return { error: "Invalid credentials." };
  }

  // Check if user doesn't have a verification email, then generate verification token and send to the email account
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Confirmation email sent." };
  }

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
          // { status: 403, message: "Invalid credentials." }
          return { error: "Invalid credentials." };

        case "OAuthAccountNotLinked":
          return {
            error: "Email already used with different provider. Please use a different one.",
          };

        case "Verification":
          return { error: "Verification failed. Please try again." };

        default:
          return { error: "Something went wrong." };
      }
    }

    throw error;
  }
};
