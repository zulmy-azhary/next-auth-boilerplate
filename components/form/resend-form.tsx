"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { resendSchema } from "@/schemas";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/auth/form-input";
import { useTransition } from "react";
import { resendToken } from "@/actions/resend";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

export const ResendForm = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof resendSchema>>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: ""
    }
  })

  const handleSubmit = form.handleSubmit(values => {
    startTransition(() => {
      resendToken(values).then((data) => {
        if (data.success) {
          return toast.success(data.message);
        }
        return toast.error(data.error.message);
      });
    })
  });
  return (
    <CardWrapper
      headerTitle="Resend Confirmation"
      headerDescription="The verification link will expires after a hour. If you don't verify your email within a hour, you can request another email verification link."
      backButtonLabel="Back to login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            control={form.control}
            name="email"
            label="Email Address"
            type="email"
            placeholder="e.g. johndoe@example.com"
            isPending={isPending}
          />
          <Button type="submit" disabled={isPending} className="w-full">Resend</Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
