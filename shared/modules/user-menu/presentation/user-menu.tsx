import { Button } from "@/libs/ui/button";
import { UserMenuDropdown } from "./user-menu-dropdown";
import { getJWTClaims } from "@/libs/supabase/claims";

export const UserMenu = async () => {
  const claims = await getJWTClaims();

  if (!claims) {
    return (
      <Button href="/login" className="px-5.5 py-2.75">
        Zaloguj się
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button href="/create-event" className="px-5.5 py-2.75">
        Dodaj wydarzenie
      </Button>
      <UserMenuDropdown />
    </div>
  );
};
