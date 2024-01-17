import { db } from "@/lib/db";
import { setTokenExpiration } from "@/lib/utils";
import crypto from "node:crypto";

export const generateTwoFactorToken = async (email: string) => {
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await deleteTwoFactorTokenById(existingToken.id);
  }

  const token = String(crypto.randomInt(100000, 1000000));
  const expires = setTokenExpiration(60 * 2); // 2 minutes

  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return twoFactorToken;
};

export const getTwoFactorToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
};

export const deleteTwoFactorTokenById = async (id: string) => {
  try {
    return await db.twoFactorToken.delete({
      where: { id },
    });
  } catch {
    return null;
  }
};
