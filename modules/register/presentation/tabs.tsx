import Link from "next/link";

export const Tabs = () => (
  <div className="flex border-b border-border">
    <Link
      href="/login"
      className="border-b-2 border-transparent px-1 pb-3 font-display text-sm font-bold text-foreground-muted transition-colors hover:text-foreground"
    >
      Zaloguj się
    </Link>
    <span className="ml-6 border-b-2 border-accent px-1 pb-3 font-display text-sm font-bold text-foreground">
      Zarejestruj się
    </span>
  </div>
);
