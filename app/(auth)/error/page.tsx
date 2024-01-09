import { ErrorCard } from "@/components/auth/error-card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Dashboard | Oops! Something went wrong",
};

export default function AuthErrorPage() {
  return <ErrorCard />;
}
