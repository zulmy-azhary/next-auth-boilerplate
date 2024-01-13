import { db } from "@/lib/db";
import { v4 as uuid } from "uuid";

export const generateResetPasswordToken = async (email: string) => {
  const existingToken = await getResetPasswordTokenByEmail(email);
  if (existingToken) {
    await db.resetPasswordToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const token = uuid();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour in milliseconds

  const resetPasswordToken = await db.resetPasswordToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return resetPasswordToken;
};

export const getResetPasswordToken = async (token: string) => {
  try {
    const resetPasswordToken = await db.resetPasswordToken.findUnique({
      where: { token },
    });

    return resetPasswordToken;
  } catch (error) {
    return null;
  }
};

export const getResetPasswordTokenByEmail = async (email: string) => {
  try {
    const resetPasswordToken = await db.resetPasswordToken.findFirst({
      where: { email },
    });

    return resetPasswordToken;
  } catch (error) {
    return null;
  }
};
