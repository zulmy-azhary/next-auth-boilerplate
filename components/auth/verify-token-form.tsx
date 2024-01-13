import { CardWrapper } from "@/components/auth/card-wrapper";
import { Message } from "@/components/auth/message";

type NewVerificationFormProps = {
  token?: string;
  payload: {
    type: "success" | "error",
    message: string;
  }
};

export const NewVerificationForm = ({ payload }: NewVerificationFormProps) => {
  return (
    <CardWrapper
      headerTitle="Verify Email"
      headerDescription="Confirming your email verification"
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <div className="flex flex-col items-center justify-center w-full">
        <Message message={payload.message} type={payload.type} />
      </div>
    </CardWrapper>
  );
};
