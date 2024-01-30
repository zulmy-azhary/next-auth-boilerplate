"use client";

import { profileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/auth/form-input";
import { Button } from "@/components/ui/button";
import { profile } from "@/actions/profile";
import { toast } from "sonner";
import { ExtendedUser } from "@/types/next-auth";
import { FormToggle } from "@/components/auth/form-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

type ProfileFormProps = {
  user: ExtendedUser;
};

export const ProfileForm = ({ user }: ProfileFormProps) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    values: {
      name: user.name || undefined,
      email: user.email || undefined,
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: user.isTwoFactorEnabled || undefined,
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(() => {
      profile(values).then((data) => {
        if (data.success) {
          form.reset();
          return toast.success(data.message);
        }
        return toast.error(data.error.message);
      });
    });
  });

  return (
    <>
      <div className="col-span-2 col-start-2 flex justify-center">
        <Avatar className="w-64 h-64">
          <AvatarImage src={user.image ?? ""} />
          <AvatarFallback>
            <UserRound size={128} />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="col-span-3 space-y-12">
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
              {!user.isOAuth && (
                <>
                  <FormInput
                    control={form.control}
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="e.g. johndoe@example.com"
                    isPending={isPending}
                    disabled={user.isOAuth}
                  />
                  <FormInput
                    control={form.control}
                    name="password"
                    label="Old Password"
                    type="password"
                    placeholder="******"
                    autoComplete="off"
                    isPending={isPending}
                  />
                  <FormInput
                    control={form.control}
                    name="newPassword"
                    label="New Password"
                    type="password"
                    placeholder="******"
                    autoComplete="off"
                    isPending={isPending}
                  />
                  <FormToggle
                    control={form.control}
                    name="isTwoFactorEnabled"
                    label="Two-Factor Authentication"
                    description="Protect your account with additional security by enabling two-factor authentication for login. You will be required to enter both your credentials and an authentication code to login."
                    isPending={isPending}
                  />
                </>
              )}
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              Update profile
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
