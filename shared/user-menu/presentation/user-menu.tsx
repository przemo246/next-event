import { CircleUserRound } from "lucide-react";

import { createClient } from "@/core/supabase/server";
import { Button } from "@/libs/ui/button";

export const UserMenu = async () => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return (
      <Button href="/login" className="px-5.5 py-2.75">
        Zaloguj się
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Button className="px-5.5 py-2.75">Dodaj wydarzenie</Button>
      <Button
        href="/profile"
        variant="secondary"
        aria-label="Profil użytkownika"
        className="p-2"
      >
        <CircleUserRound className="size-6" strokeWidth={1.75} />
      </Button>
    </div>
  );
};
