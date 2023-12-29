"use client";
import { BuiltInProviderType } from 'next-auth/providers/index';
import { ClientSafeProvider, LiteralUnion, signIn } from 'next-auth/react';
import React from 'react'
import { Button } from '@/components/ui/button';

type AuthListProps = {
  providers: Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider>;
};

export default function AuthList({providers}: AuthListProps) {
  return (
    <div className="flex gap-x-2 justify-center items-center w-full h-screen">
      {Object.values(providers!).filter(provider => provider.id !== "credentials").map((provider) => (
        <Button key={provider.name} onClick={() => signIn(provider.id)}>{provider.name}</Button>
      ))}
    </div>
  );
}
