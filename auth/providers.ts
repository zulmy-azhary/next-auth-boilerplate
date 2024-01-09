import { loginSchema } from "@/schemas";
import { getUserByEmail } from "@/services/user";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";

export const CredentialsProvider = Credentials({
  async authorize(credentials) {
    const validatedFields = loginSchema.safeParse(credentials);

    if (validatedFields.success) {
      const { email, password } = validatedFields.data;

      const user = await getUserByEmail(email);
      if (!user || !user.password) return null;

      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (passwordsMatch) return user;
    }

    return null;
  },
});

export const GithubProvider = Github({
  clientId: process.env.GITHUB_ID as string,
  clientSecret: process.env.GITHUB_SECRET as string,
});

export const GoogleProvider = Google({
  clientId: process.env.GOOGLE_ID as string,
  clientSecret: process.env.GOOGLE_SECRET as string,
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code",
    },
  },
});
