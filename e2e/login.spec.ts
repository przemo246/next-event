import { expect, test } from "@playwright/test";
import {
  fillLoginForm,
  registerConfirmedUser,
  uniqueEmail,
} from "./support/auth";

// Requires a running local Supabase (`pnpm db:start`); e-mails are read from Mailpit.

const INVALID_CREDENTIALS = "Nieprawidłowy e-mail lub hasło.";

test("confirmed user logs in and sees their account in the header", async ({
  page,
  context,
}) => {
  const email = await registerConfirmedUser(page);
  await context.clearCookies();

  await fillLoginForm(page, email);

  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("link", { name: "Profil użytkownika" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Zaloguj się" })).toBeHidden();
});

test("shows an error for a wrong password", async ({ page, context }) => {
  const email = await registerConfirmedUser(page);
  await context.clearCookies();

  await fillLoginForm(page, email, "wrong-password");

  await expect(page).toHaveURL("/login");
  await expect(page.getByText(INVALID_CREDENTIALS)).toBeVisible();
});

test("shows the same error for an unknown e-mail", async ({ page }) => {
  await fillLoginForm(page, uniqueEmail());

  await expect(page).toHaveURL("/login");
  await expect(page.getByText(INVALID_CREDENTIALS)).toBeVisible();
});
