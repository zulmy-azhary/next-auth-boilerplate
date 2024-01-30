import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyEmailLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to: email,
    subject: "[Next Dashboard] Action required: Verify your email",
    html: `<p>Click <a href="${verifyEmailLink}">Here</a> to verify your email.</p>`,
  });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetPasswordLink = `${process.env.NEXT_PUBLIC_APP_URL}/new-password?token=${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to: email,
    subject: "[Next Dashboard] Action required: Reset your password",
    html: `<p>Click <a href="${resetPasswordLink}">Here</a> to reset your password.</p>`,
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    to: email,
    subject: "[Next Dashboard] Action required: Confirm Two-Factor Authentication",
    html: `<p>${token} is your authentication Code.</p>`,
  });
};
