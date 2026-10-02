import { z } from "zod";
export const RESERVED_USERNAMES = ["admin", "administrator", "root"];

export const isReservedUsername = (username: string) =>
  RESERVED_USERNAMES.includes(username);

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

export const MIN_PASSWORD_LENGTH = 6;

export const passwordsSchema = z
  .object({
    password: z
      .string()
      .min(
        MIN_PASSWORD_LENGTH,
        `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków.`,
      ),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Hasła nie są takie same.",
    path: ["confirmPassword"],
  });
