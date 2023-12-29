import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const GithubProvider = Github({
  clientId: process.env.GITHUB_ID as string,
  clientSecret: process.env.GITHUB_SECRET as string,
})

export const GoogleProvider = Google({
  clientId: process.env.GOOGLE_ID as string,
  clientSecret: process.env.GOOGLE_SECRET as string,
});

export const CredentialsProvider = Credentials({
  id: "credentials",
  name: "Credentials",
  type: "credentials",
  credentials: {
    username: { label: "Username", type: "text", placeholder: "Masukkan username..." },
    password: { label: "Password", type: "password", placeholder: "Masukkan password..."}
  },
  async authorize(credentials, req) {
    return null
  },
})