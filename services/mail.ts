import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyEmailLink = `http://localhost:3000/verify?token=${token}`;

  await resend.emails.send({
    from: "nextdashboard@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${verifyEmailLink}">Here</a> to confirm your email.</p>`,
  });
};
