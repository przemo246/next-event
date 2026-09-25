import { expect, type Page } from "@playwright/test";
import { extractConfirmLink, waitForEmail } from "./mailpit";

export const PASSWORD = "e2e-password-123";

export const uniqueEmail = () =>
  `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

// Registers through the UI and opens the confirmation link, leaving the page
// logged in as a confirmed user.
export const registerConfirmedUser = async (page: Page): Promise<string> => {
  const email = uniqueEmail();

  await page.goto("/register");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Hasło", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Powtórz hasło").fill(PASSWORD);
  await page.getByRole("button", { name: "Zarejestruj się" }).click();
  await expect(
    page.getByRole("heading", { name: "Potwierdź adres e-mail" }),
  ).toBeVisible();

  const message = await waitForEmail(email);
  await page.goto(extractConfirmLink(message.HTML));
  await expect(page).toHaveURL("/");

  return email;
};

export const fillLoginForm = async (
  page: Page,
  email: string,
  password = PASSWORD,
) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  await page.getByLabel("Hasło").fill(password);
  await page.getByRole("button", { name: "Zaloguj się" }).click();
};
