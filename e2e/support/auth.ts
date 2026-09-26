import { type Page } from "@playwright/test";

export const PASSWORD = "e2e-password-123";

export const uniqueEmail = () =>
  `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;

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
