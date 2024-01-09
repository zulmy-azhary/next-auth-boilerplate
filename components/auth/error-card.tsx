import { CardWrapper } from "@/components/auth/card-wrapper";

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerTitle="Error"
      headerDescription="Oops! Something went wrong!"
      backButtonLabel="Back to login"
      backButtonHref="/login"
     />
  );
};
