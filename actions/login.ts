"use server";

import { signIn } from "@/auth";
import { loginSchema } from "@/schemas";
import { z } from "zod";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/services/user";
import bcrypt from "bcryptjs";

export const login = async (payload: z.infer<typeof loginSchema>) => {
  const validatedFields = loginSchema.safeParse(payload);

  if (!validatedFields.success) {
    return { error: "Invalid fields." };
  }

  const { email, password } = validatedFields.data;

  // Check if user, email and password are exist
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid credentials." };
  }

  // Check if passwords are matches
  const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordMatch) {
    return { error: "Invalid credentials." };
  }

  // Check if user email isn't verified yet, then show message
  if (!existingUser.emailVerified) {
    return { error: "Your email address is not verified yet. Please check your email." };
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
            error:
              "Another account already registered with the same Email Address. Please login the different one.",
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
