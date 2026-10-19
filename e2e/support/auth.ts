import { type Page } from "@playwright/test";
import { E2E_EMAIL_PREFIX } from "./test-user";

export const PASSWORD = "e2e-password-123";

export const uniqueEmail = () =>
  `${E2E_EMAIL_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

// Same collision resistance as uniqueEmail, but shaped to pass the
// public.profiles CHECK: lowercase, digits and underscores, 3–30 characters.
export const uniqueUsername = () =>
  `${E2E_EMAIL_PREFIX}${Date.now()}${Math.random().toString(36).slice(2, 6)}`.replaceAll(
    "-",
    "_",
  );

export const fillLoginForm = async (
  page: Page,
  email: string,
  password = PASSWORD,
) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill(email);
  // Scoped to the field rather than the label text: the reveal button sits
  // inside the same <label> and carries its own aria-label, so `getByLabel`
  // matches both.
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Zaloguj się" }).click();
};
