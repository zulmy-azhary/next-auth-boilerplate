import AuthList from "@/components/AuthList";
import { getProviders } from "next-auth/react";

export default async function LoginPage() {
  const providers = await getProviders();

  return (
    <AuthList providers={providers!} />
  )
}