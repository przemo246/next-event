import { expect, test } from "@playwright/test";
import { fillLoginForm, uniqueEmail } from "./support/auth";
import { E2E_LOGIN_USER } from "./support/test-user";

// Requires a running local Supabase (`pnpm db:start`).

const INVALID_CREDENTIALS = "Nieprawidłowy e-mail lub hasło.";

test("confirmed user logs in and sees their account in the header", async ({
  page,
  context,
}) => {
  await context.clearCookies();

  await fillLoginForm(page, E2E_LOGIN_USER.email, E2E_LOGIN_USER.password);

  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("link", { name: "Profil użytkownika" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Zaloguj się" })).toBeHidden();
});

test("shows an error for a wrong password", async ({ page, context }) => {
  await context.clearCookies();

  await fillLoginForm(page, E2E_LOGIN_USER.email, "wrong-password");

  await expect(page).toHaveURL("/login");
  await expect(page.getByText(INVALID_CREDENTIALS)).toBeVisible();
});

test("shows the same error for an unknown e-mail", async ({ page }) => {
  await fillLoginForm(page, uniqueEmail());

  await expect(page).toHaveURL("/login");
  await expect(page.getByText(INVALID_CREDENTIALS)).toBeVisible();
});
