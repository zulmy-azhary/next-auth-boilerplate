"use server";

import { isExpired } from "@/lib/utils";
import { getUserByEmail, updateUserById } from "@/services/user";
import { deleteVerificationTokenById, getVerificationToken } from "@/services/verification-token";
import { redirect } from "next/navigation";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationToken(token);
  if (!existingToken) {
    return { error: "Invalid token provided." };
  }

  const hasExpired = isExpired(existingToken.expires);
  if (hasExpired) {
    redirect("/resend");
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist." };
  }

  await updateUserById(existingUser.id, {
    emailVerified: new Date(),
    email: existingToken.email, // This is needed when user want to change their email address
  });

  await deleteVerificationTokenById(existingToken.id);

  return { success: "Your email address has been verified." };
};
