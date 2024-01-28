import { ResendForm } from "@/components/form/resend-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resend Confirmation",
};

export default function ResendPage() {
  return <ResendForm />;
}
