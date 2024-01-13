import { newVerification } from "@/actions/verify-token";
import { NewVerificationForm } from "@/components/auth/verify-token-form";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify Email",
};

export default async function NewVerificationPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  if (!searchParams.token) redirect("/login");
  const token = await newVerification(searchParams.token);
  let payload: { type: "success" | "error"; message: string } = {
    type: "error",
    message: "",
  };
  if (token.success) {
    payload = {
      type: "success",
      message: token.success,
    };
  }
  if (token.error) {
    payload = {
      type: "error",
      message: token.error,
    };
  }

  return <NewVerificationForm payload={payload} />;
}
