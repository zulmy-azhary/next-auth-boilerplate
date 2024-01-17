import { CardWrapper } from "@/components/auth/card-wrapper";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

type ErrorCardProps = {
  message?: AuthError["type"];
};

export const ErrorCard = ({ message }: ErrorCardProps) => {
  let headerDescription =
    "Oops! Something went wrong. Please contact administrator for more details or try again later.";

  if (!message) {
    redirect("/login");
  }

  if (message === "OAuthAccountNotLinked") {
    headerDescription =
      "Another account already registered with the same Email Address. Please login the different one.";
  }

  return (
    <CardWrapper
      headerTitle="An Error Occured"
      headerDescription={headerDescription}
      backButtonLabel="Back to login"
      backButtonHref="/login"
      heroImage="/assets/error.svg"
    />
  );
};
