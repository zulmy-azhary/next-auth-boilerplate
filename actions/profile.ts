"use server";

import { profileSchema } from "@/schemas";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { hashPassword, response } from "@/lib/utils";
import { getUserByEmail, getUserById, updateUserById } from "@/services/user";
import { update } from "@/auth";
import { deleteTwoFactorConfirmationByUserId } from "@/services/two-factor-confirmation";
import bcrypt from "bcryptjs";
import { generateVerificationToken } from "@/services/verification-token";
import { sendVerificationEmail } from "@/services/mail";

export const profile = async (payload: z.infer<typeof profileSchema>) => {
  // Check if user input is not valid, then return an error.
  const validatedFields = profileSchema.safeParse(payload);
  if (!validatedFields.success) {
    return response({
      success: false,
      error: {
        code: 422,
        message: "Invalid fields.",
      },
    });
  }

  let { name, email, password, newPassword, isTwoFactorEnabled } = validatedFields.data;

  // Check if current user does not exist, then return an error.
  const user = await currentUser();
  if (!user) {
    return response({
      success: false,
      error: {
        code: 401,
        message: "Unauthorized.",
      },
    });
  }

  // Check if user does not exist in the database, then return an error.
  const existingUser = await getUserById(user.id);
  if (!existingUser) {
    return response({
      success: false,
      error: {
        code: 401,
        message: "Unauthorized.",
      },
    });
  }

  // Check if current user logged in with OAuth provider (Google or Github), then prevent to update few fields.
  if (user.isOAuth) {
    email = undefined;
    password = undefined;
    newPassword = undefined;
    isTwoFactorEnabled = undefined;
  }

  // Check if user trying to update the email address
  if (email && email !== user.email) {
    // Check if email already in use from another user and make sure that email doesn't same as current user.
    const existingEmail = await getUserByEmail(email);
    if (existingEmail && user.id !== existingEmail.id) {
      return response({
        success: false,
        error: {
          code: 422,
          message: "The email address you have entered is already in use. Please use another one.",
        },
      });
    }

    // Generate verification token, then send it to the email.
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    // Return response success.
    return response({
      success: true,
      code: 201,
      message: "Confirmation email sent. Please check your email.",
    });
  }

  // Check if password not entered, then don't update the password.
  if (!password || !newPassword) {
    password = undefined;
  }

  // Check if password entered
  if (password && newPassword && existingUser.password) {
    // Check if passwords doesn't matches, then return an error.
    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
      return response({
        success: false,
        error: {
          code: 401,
          message: "Incorrect password.",
        },
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    password = hashedPassword;
  }

  // Check if user disabled 2fa, then delete two factor confirmation
  if (!isTwoFactorEnabled) {
    await deleteTwoFactorConfirmationByUserId(existingUser.id);
  }

  // Update current user
  const updatedUser = await updateUserById(existingUser.id, {
    name,
    email,
    password,
    isTwoFactorEnabled,
  });

  // Update session
  await update({ user: { ...updatedUser } });

  // Return response success.
  return response({
    success: true,
    code: 204,
    message: "Profile updated.",
  });
};
