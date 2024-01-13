import { ErrorCard } from "@/components/auth/error-card";
import { Metadata } from "next";
import { AuthError } from "next-auth";

export const metadata: Metadata = {
  title: "Oops! Something went wrong",
};

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { message: AuthError["type"] };
}) {
  return <ErrorCard message={searchParams.message} />;
}
