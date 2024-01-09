import { CredentialsProvider, GithubProvider, GoogleProvider } from "@/auth/providers";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [CredentialsProvider, GithubProvider, GoogleProvider],
} satisfies NextAuthConfig;