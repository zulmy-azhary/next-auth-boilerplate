import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

export const metadata: Metadata = {
  title: "Next Dashboard | Login",
  description: "This is the next dashboard app",
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }

  return (
    <main>{children}</main>
  )
}
