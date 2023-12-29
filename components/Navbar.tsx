"use client";
import React from 'react'
import Link from "next/link";
import { signOut, useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';

function AuthNav() {
  const { data: session } = useSession();

  if (session) {
    return (
      // <>
      //   {session.user?.name}
      //   <Image src={session.user?.image as string} alt="Profile picture" className="rounded-full" width={32} height={32} />
      //   <button onClick={() => signOut()}>Logout</button>
      // </>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="pr-4 rounded-none h-fit flex gap-x-2">
            <Avatar>
              <AvatarImage src={session.user?.image as string} />
              <AvatarFallback><UserRound /></AvatarFallback>
            </Avatar>
            <p>{session.user?.name}</p>
          </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex flex-col gap-y-2 py-4">
            <Avatar className="w-24 h-24"><AvatarImage src={session.user?.image as string} /></Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{session.user?.name}</h3>
              <p className="text-sm">{session.user?.email}</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    )
  }

  return (
    <>
      <Link href="/login">Login</Link>
    </>
  )
}

export default function Navbar() {
  return (
    <nav className="flex gap-x-4 items-center justify-between border-b-2 pl-4">
      <p>Next Dashboard</p>
      <AuthNav />
    </nav>
  )
}