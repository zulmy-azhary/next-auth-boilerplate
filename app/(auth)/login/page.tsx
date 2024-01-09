import { LoginForm } from "@/components/auth/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Dashboard | Login",
  description: "This is the next dashboard app",
};

export default async function LoginPage() {
  return <LoginForm />;
}
