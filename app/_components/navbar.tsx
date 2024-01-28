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
import { signOut } from "@/auth";
import Link from "next/link";
import { currentUser } from "@/lib/auth";

async function AuthNav() {
  const user = await currentUser();

  if (!user) return;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="pr-4 rounded-none h-fit flex gap-x-2 focus-visible:ring-offset-0">
          <Avatar>
            <AvatarImage src={user.image ?? ""} />
            <AvatarFallback>
              <UserRound />
            </AvatarFallback>
          </Avatar>
          <p>{user.name}</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex flex-col gap-y-2 py-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.image ?? ""} />
              <AvatarFallback>
                <UserRound size={40} />
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm">{user.email}</p>
              <p className="text-sm">{user.role}</p>
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
          <DropdownMenuItem asChild>
            <Link href="/settings">
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </Link>
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
    <nav className="flex gap-x-4 items-center justify-between bg-gray-50 shadow-sm pl-4">
      <Link href="/">
        <h1 className="text-2xl font-semibold">Next Dashboard</h1>
      </Link>
      <AuthNav />
    </nav>
  );
}
