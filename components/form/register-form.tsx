"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Form } from "@/components/ui/form";
import { registerSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormInput } from "@/components/auth/form-input";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { register } from "@/actions/register";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(() => {
      register(values).then((data) => {
        if (data.success) {
          router.push("/login");
          return toast.success(data.message);
        }
        return toast.error(data.error.message);
      });
    });
  });

  return (
    <CardWrapper
      headerTitle="Register"
      headerDescription="Register your account by filling out the form below, make sure the data you enter is correct."
      backButtonLabel="Already have an account? Login"
      backButtonHref="/login"
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <FormInput
              control={form.control}
              name="name"
              label="Name"
              type="text"
              placeholder="e.g. John Doe"
              isPending={isPending}
            />
            <FormInput
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="e.g. johndoe@example.com"
              isPending={isPending}
            />
            <FormInput
              control={form.control}
              name="password"
              label="Password"
              type="password"
              placeholder="******"
              isPending={isPending}
            />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
