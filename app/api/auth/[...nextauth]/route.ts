import { CredentialsProvider, GithubProvider, GoogleProvider } from "@/auth/providers";
import NextAuth, { AuthOptions } from "next-auth";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider,
    GithubProvider,
    GoogleProvider
  ],
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
