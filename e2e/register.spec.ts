import { expect, test, type Page } from "@playwright/test";
import { PASSWORD, uniqueEmail } from "./support/auth";
import { extractConfirmLink, waitForEmail } from "./support/mailpit";
import { deleteUserByEmail } from "./support/test-user";

// Requires a running local Supabase (`pnpm db:start`); e-mails are read from Mailpit.

const createdEmails = new Set<string>();

const fillRegisterForm = async (
  page: Page,
  email: string,
  confirmPassword = PASSWORD,
) => {
  createdEmails.add(email);

  await page.goto("/register");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Hasło", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Powtórz hasło").fill(confirmPassword);
  await page.getByRole("button", { name: "Zarejestruj się" }).click();
};

test.afterEach(async () => {
  const emails = [...createdEmails];
  createdEmails.clear();

  await Promise.all(emails.map((email) => deleteUserByEmail(email)));
});

test("new user signs up and confirms their e-mail", async ({
  page,
  context,
}) => {
  const email = uniqueEmail();

  await fillRegisterForm(page, email);

  await expect(
    page.getByRole("heading", { name: "Potwierdź adres e-mail" }),
  ).toBeVisible();
  await expect(page.getByText(email)).toBeVisible();

  const message = await waitForEmail(email);
  await page.goto(extractConfirmLink(message.HTML));

  // Must stay on the same host, or the session cookie won't apply to the page.
  await expect(page).toHaveURL("/");
  const cookies = await context.cookies(page.url());
  expect(cookies.some((c) => /^sb-.+-auth-token/.test(c.name))).toBe(true);

  // The confirmed account can also log in with its password.
  await context.clearCookies();
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Hasło").fill(PASSWORD);
  await page.getByRole("button", { name: "Zaloguj się" }).click();
  await expect(page).toHaveURL("/");
});

test("shows an error when passwords do not match", async ({ page }) => {
  await fillRegisterForm(page, uniqueEmail(), "different-password");

  await expect(page.getByText("Hasła nie są takie same.")).toBeVisible();
});

test("unconfirmed user cannot log in", async ({ page }) => {
  const email = uniqueEmail();

  await fillRegisterForm(page, email);
  await expect(
    page.getByRole("heading", { name: "Potwierdź adres e-mail" }),
  ).toBeVisible();

  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Hasło").fill(PASSWORD);
  await page.getByRole("button", { name: "Zaloguj się" }).click();

  await expect(
    page.getByText("Najpierw potwierdź adres e-mail", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Wyślij link ponownie" }),
  ).toBeVisible();
});

test("invalid confirmation link redirects to login with an error", async ({
  page,
}) => {
  await page.goto("/auth/confirm?token_hash=invalid&type=email");

  await expect(page).toHaveURL("/login?error=confirm");
  await expect(
    page.getByText("Link aktywacyjny wygasł", { exact: false }),
  ).toBeVisible();
});
