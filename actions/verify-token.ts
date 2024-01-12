"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/services/user";
import { getVerificationToken } from "@/services/verification-token";
import { redirect } from "next/navigation";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationToken(token);
  if (!existingToken) {
    return { error: "Invalid token provided." };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    redirect("/resend");
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist." };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email, // This is needed when user want to change their email address
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Your email address has been verified." };
};
