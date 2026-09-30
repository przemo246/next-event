"use client";

import { CircleUserRound } from "lucide-react";

import { Button } from "@/libs/ui/button";
import { Dropdown } from "@/libs/ui/dropdown-menu";
import { signOut } from "../actions/sign-out";

export const UserMenuDropdown = () => {
  return (
    <Dropdown.Root>
      <Button variant="secondary" aria-label="Menu użytkownika" className="p-2">
        <CircleUserRound className="size-6" strokeWidth={1.75} />
      </Button>
      <Dropdown.Menu>
        <Dropdown.Item id="profile" href="/profile">
          Profil
        </Dropdown.Item>
        <Dropdown.Item id="sign-out" onAction={() => signOut()}>
          Wyloguj
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown.Root>
  );
};
