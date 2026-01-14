import Link from "next/link";
import { UserDropdownMenu } from "./user-dropdown";
import { getServerSession } from "@/lib/auth-server";
import { ToggleTheme } from "./toggle-theme";
import { Button } from "./ui/button";

export default async function Navbar() {
  const user = await getServerSession();

  return (
    <header className="max-w-4xl mx-auto p-6 flex justify-between items-center">
      <Link href={"/testimonial"} className="text-xl font-bold">
        KudosFlow
      </Link>
      <div className="flex items-center gap-5">
        <ToggleTheme />
        {user ? (
          <UserDropdownMenu user={user.user} />
        ) : (
          <Link href={"/auth"}>
            <Button className="rounded-full">Sign in</Button>
          </Link>
        )}
      </div>
    </header>
  );
}
