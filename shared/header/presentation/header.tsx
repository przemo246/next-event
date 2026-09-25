import Link from "next/link";

import { UserMenu } from "@/shared/user-menu/presentation/user-menu";

export const Header = () => {
  return (
    <header className="border-b border-border">
      <div className="page-container flex items-center justify-between gap-10 px-6 py-4 sm:px-10">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center bg-accent font-display text-lg font-extrabold text-accent-foreground">
            A
          </span>
          <span className="font-display text-2xl font-extrabold tracking-tight">
            Afisz
          </span>
        </Link>

        <UserMenu />
      </div>
    </header>
  );
};
