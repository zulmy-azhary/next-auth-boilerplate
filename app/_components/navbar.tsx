import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import { auth, signOut } from "@/auth";
import Link from "next/link";

async function AuthNav() {
  const session = await auth();

  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="pr-4 rounded-none h-fit flex gap-x-2">
          <Avatar>
            <AvatarImage src={session.user.image ?? ""} />
            <AvatarFallback>
              <UserRound />
            </AvatarFallback>
          </Avatar>
          <p>{session.user.name}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex flex-col gap-y-2 py-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={session.user.image ?? ""} />
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{session.user.name}</h3>
              <p className="text-sm">{session.user.email}</p>
              <p className="text-sm">{session.user.role}</p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full flex justify-between">
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Navbar() {
  return (
    <nav className="flex gap-x-4 items-center justify-between border-b-2 pl-4">
      <Link href="/">
        <h1 className="text-2xl font-semibold">Next Dashboard</h1>
      </Link>
      <AuthNav />
    </nav>
  );
}
