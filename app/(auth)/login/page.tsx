import { LoginForm } from "@/components/form/login-form";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login",
};

export default async function LoginPage({ searchParams }: { searchParams: { error: string } }) {
  if (searchParams.error) redirect(`/error?message=${searchParams.error}`);
  return <LoginForm />;
}
