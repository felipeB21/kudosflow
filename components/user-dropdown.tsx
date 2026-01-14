"use client";
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
import { CreditCard, LogOutIcon, Settings2, User2Icon } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import UserAvatar from "./user-avatar";

export function UserDropdownMenu({
  user,
}: {
  user: {
    name?: string | null;
    username?: string | null;
    image?: string | null;
  };
}) {
  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.reload();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full py-0 ps-0">
          <div className="me-0.5 flex aspect-square h-full p-1.5">
            <UserAvatar user={user} width={32} height={32} />
          </div>
          {`@${user.username}`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              Profile
              <DropdownMenuShortcut>
                <User2Icon />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/billing">
              Billing
              <DropdownMenuShortcut>
                <CreditCard />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile/settings">
              Settings
              <DropdownMenuShortcut>
                <Settings2 />
              </DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button onClick={handleSignOut} className="w-full">
            Log out
            <DropdownMenuShortcut>
              <LogOutIcon />
            </DropdownMenuShortcut>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
