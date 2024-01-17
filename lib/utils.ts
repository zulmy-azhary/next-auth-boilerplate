import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { sign, verify, type SignOptions, type Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Response, ResponseWithMessage } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, await bcrypt.genSalt());
}

/**
 * Function to check whether the given value is expired or not.
 * @param expires The date that want to check
 * @return true if the value is expired, false otherwise
 */
export function isExpired(expires: Date): boolean {
  return new Date(expires) < new Date();
}

/**
 * Function to set token expiration.
 * @param exp Duration of token expiration, default is 3600 milliseconds or 1 hour
 * @return Generates datetime for the token expiration
 */
export function setTokenExpiration(exp: number = 60 * 60) {
  return new Date(new Date().getTime() + 1000 * exp);
}

/**
 * Function to generate jwt.
 * @param payload The payload want to generate
 * @param options The sign options
 * @return The token generated
 */

export function signJwt(payload: Record<string, unknown>, options?: SignOptions) {
  return sign(payload, process.env.JWT_SECRET as Secret, {
    ...options,
    algorithm: "HS256",
  });
}

export const verifyJwtToken = <T extends object>(token: string) => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET as Secret);
    return {
      valid: true,
      decoded: decoded as T,
    };
  } catch (error) {
    return {
      valid: false,
      decoded: null,
    };
  }
};

// Overload for response status in server action
export function response(response: ResponseWithMessage): Response;
export function response<T extends Record<string, unknown>>(response: Response<T>): Response<T>;
export function response<T extends object>(response: T): T {
  return response;
}
