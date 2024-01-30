import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyEmailLink = `http://localhost:3000/verify?token=${token}`;

  await resend.emails.send({
    from: `mail@${process.env.RESEND_DOMAIN}`,
    to: email,
    subject: "[Next Dashboard] Action required: Verify your email",
    html: `<p>Click <a href="${verifyEmailLink}">Here</a> to verify your email.</p>`,
  });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetPasswordLink = `http://localhost:3000/new-password?token=${token}`;

  await resend.emails.send({
    from: `mail@${process.env.RESEND_DOMAIN}`,
    to: email,
    subject: "[Next Dashboard] Action required: Reset your password",
    html: `<p>Click <a href="${resetPasswordLink}">Here</a> to reset your password.</p>`,
  });
};

export const sendTwoFactorEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: `mail@${process.env.RESEND_DOMAIN}`,
    to: email,
    subject: "[Next Dashboard] Action required: Confirm Two-Factor Authentication",
    html: `<p>${token} is your authentication Code.</p>`,
  });
};
