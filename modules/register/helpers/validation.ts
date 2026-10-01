import { z } from "zod";

// Pure validation for the register form. Kept out of the "use server" action so
// it can be unit tested without booting a server or a Supabase client.

// Reserved because each of these is, or reads like, a route of the site.
export const RESERVED_USERNAMES = [
  "admin",
  "administrator",
  "api",
  "auth",
  "create-event",
  "help",
  "login",
  "logout",
  "profil",
  "profile",
  "register",
  "root",
  "support",
  "wydarzenia",
];

export const isReservedUsername = (username: string) =>
  RESERVED_USERNAMES.includes(username);

// Handles end up in the site's URLs, so the charset is ASCII-only and the regex
// matches the CHECK constraint on public.profiles exactly. Polish diacritics are
// rejected rather than transliterated, so "zażółć" has to be typed without them.
export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki.")
  .max(30, "Nazwa użytkownika może mieć maksymalnie 30 znaków.")
  .regex(/^[a-z0-9_]+$/, "Użyj tylko małych liter, cyfr i podkreśleń.")
  .refine(
    (value) => !isReservedUsername(value),
    "Ta nazwa jest zarezerwowana.",
  );

// Mirrors the minLength on both password TextFields, which the browser enforces
// and a direct POST does not. Supabase's own minimum_password_length rejects a
// short password too, but only as a failed sign-up, which the action reports as
// a generic "could not create the account" -- wrong message for a field error.
export const MIN_PASSWORD_LENGTH = 6;

export const passwordsSchema = z
  .object({
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.`,
      ),
    // Only the password carries the length rule: the repeat is a copy of it,
    // and an empty repeat has to stay a mismatch rather than become a length
    // error, since that reads as though the password itself were too short.
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Hasła nie są takie same.",
    path: ["confirmPassword"],
  });
