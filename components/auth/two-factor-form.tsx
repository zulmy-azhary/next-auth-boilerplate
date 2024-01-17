"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { loginSchema, twoFactorSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/auth/form-input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { resendTwoFactor, twoFactor } from "@/actions/two-factor";
import { toast } from "sonner";

type TwoFactorFormProps = {
  payload: z.infer<typeof loginSchema>;
};

export const TwoFactorForm = ({ payload }: TwoFactorFormProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(() => {
      twoFactor(values, payload).then((data) => {
        if (!data) return;
        if (!data.success) {
          return toast.error(data.error.message);
        }
      });
    });
  });

  const handleResend = () => {
    startTransition(() => {
      resendTwoFactor(payload.email).then((data) => {
        if (data.success) {
          return toast.success(data.message);
        }
        return toast.error(data.error.message);
      });
    });
  };

  return (
    <CardWrapper
      headerTitle="Two-Factor Authentication"
      headerDescription="Please enter the 6 digit code from your email to access your account. Code will expire after 2 minutes."
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            control={form.control}
            name="code"
            label="Authentication Code"
            placeholder="XXXXXX"
            isPending={isPending}
            autoComplete="off"
          />
          <Button type="submit" disabled={isPending} className="w-full">
            Verify
          </Button>
        </form>
        <Button
          type="button"
          variant="link"
          disabled={isPending}
          className="w-full"
          onClick={handleResend}
        >
          Resend
        </Button>
      </Form>
    </CardWrapper>
  );
};
