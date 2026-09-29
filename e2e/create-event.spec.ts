import { expect, test } from "@playwright/test";
import { fillLoginForm } from "./support/auth";
import { createSupabaseAdminClient } from "./support/supabase-admin";
import { E2E_LOGIN_USER } from "./support/test-user";

// Requires a running local Supabase (`pnpm db:start`).

const createdEventNames = new Set<string>();

test.afterEach(async () => {
  const names = [...createdEventNames];
  createdEventNames.clear();

  if (names.length === 0) return;

  const supabase = createSupabaseAdminClient();
  await supabase.from("events").delete().in("name", names);
});

const uniqueEventName = () => `E2E Event ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const futureDateAndTime = () => {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const isoDate = date.toISOString().slice(0, 10);

  return { date: isoDate, time: "18:30" };
};

test("logged-out visitor is redirected to login", async ({ page }) => {
  await page.goto("/create-event");

  await expect(page).toHaveURL("/login");
});

test("logged-in user creates an event", async ({ page }) => {
  await fillLoginForm(page, E2E_LOGIN_USER.email, E2E_LOGIN_USER.password);
  await expect(page).toHaveURL("/");

  await page.goto("/create-event");

  const name = uniqueEventName();
  createdEventNames.add(name);
  const { date, time } = futureDateAndTime();

  await page.getByLabel("Nazwa wydarzenia").fill(name);

  await page.getByTestId("description-editor").click();
  await page.keyboard.type("Opis testowego wydarzenia.");

  await page.getByLabel("Adres (ulica i numer)").fill("Testowa 1");

  const cityInput = page.getByRole("combobox", { name: "Miasto" });
  await cityInput.pressSequentially("Kraków", { delay: 20 });
  await page.getByRole("option", { name: "Kraków" }).waitFor();
  await cityInput.press("ArrowDown");
  await cityInput.press("Enter");

  await page.getByLabel("Data rozpoczęcia").fill(date);
  await page.getByLabel("Godzina rozpoczęcia").fill(time);

  await page.getByRole("button", { name: "Dodaj wydarzenie" }).click();

  await expect(page).toHaveURL("/");

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("name, city, street, starts_at, description")
    .eq("name", name)
    .maybeSingle();

  expect(error).toBeNull();
  expect(data?.city).toBe("Kraków");
  expect(data?.street).toBe("Testowa 1");
  expect(data?.description).toContain("Opis testowego wydarzenia.");
});

test("shows an error when the event date is in the past", async ({ page }) => {
  await fillLoginForm(page, E2E_LOGIN_USER.email, E2E_LOGIN_USER.password);
  await expect(page).toHaveURL("/");

  await page.goto("/create-event");

  const name = uniqueEventName();
  createdEventNames.add(name);

  await page.getByLabel("Nazwa wydarzenia").fill(name);
  await page.getByTestId("description-editor").click();
  await page.keyboard.type("Opis testowego wydarzenia.");
  await page.getByLabel("Adres (ulica i numer)").fill("Testowa 1");

  const cityInput = page.getByRole("combobox", { name: "Miasto" });
  await cityInput.pressSequentially("Kraków", { delay: 20 });
  await page.getByRole("option", { name: "Kraków" }).waitFor();
  await cityInput.press("ArrowDown");
  await cityInput.press("Enter");

  await page.getByLabel("Data rozpoczęcia").fill("2020-01-01");
  await page.getByLabel("Godzina rozpoczęcia").fill("18:30");

  await page.getByRole("button", { name: "Dodaj wydarzenie" }).click();

  await expect(
    page.getByText("Data wydarzenia musi być w przyszłości."),
  ).toBeVisible();
});
