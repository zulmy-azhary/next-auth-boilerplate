import { RegisterForm } from "@/components/auth/register-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Dashboard | Register",
  description: "This is the next dashboard app",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
