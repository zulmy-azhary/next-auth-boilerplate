import { ResetForm } from "@/components/form/reset-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password"
}

export default function ForgotPassword() {
  return <ResetForm />;
}
