import { expect, test, type Page } from "@playwright/test";
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

const CITY = "Kraków";
const STREET = "Testowa 1";
const DESCRIPTION = "Opis testowego wydarzenia.";

const loginAndOpenCreateEventForm = async (page: Page) => {
  await fillLoginForm(page, E2E_LOGIN_USER.email, E2E_LOGIN_USER.password);
  await expect(page).toHaveURL("/");

  await page.goto("/create-event");
};

// Every field of the form is required, so both tests below submit the same
// thing and differ only in the start date. Filling it in one place means a new
// required field breaks one call site instead of two.
const fillCreateEventForm = async (
  page: Page,
  start = futureDateAndTime(),
) => {
  const name = uniqueEventName();
  // Registered before submitting, so the test that expects a rejection still
  // cleans up should the server ever create the row anyway.
  createdEventNames.add(name);

  await page.getByLabel("Nazwa wydarzenia").fill(name);

  await page.getByTestId("description-editor").click();
  await page.keyboard.type(DESCRIPTION);

  await page.getByLabel("Adres (ulica i numer)").fill(STREET);

  // The combobox only commits a city picked from the listbox, so typing it and
  // moving on leaves the field empty.
  const cityInput = page.getByRole("combobox", { name: "Miasto" });
  await cityInput.pressSequentially(CITY, { delay: 20 });
  await page.getByRole("option", { name: CITY }).waitFor();
  await cityInput.press("ArrowDown");
  await cityInput.press("Enter");

  await page.getByLabel("Data rozpoczęcia").fill(start.date);
  await page.getByLabel("Godzina rozpoczęcia").fill(start.time);

  await page.getByRole("button", { name: "Dodaj wydarzenie" }).click();

  return name;
};

test("logged-out visitor is redirected to login", async ({ page }) => {
  await page.goto("/create-event");

  await expect(page).toHaveURL("/login");
});

test("logged-in user creates an event", async ({ page }) => {
  await loginAndOpenCreateEventForm(page);

  const name = await fillCreateEventForm(page);

  await expect(page).toHaveURL("/");

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select("name, city, street, starts_at, description")
    .eq("name", name)
    .maybeSingle();

  expect(error).toBeNull();
  expect(data?.city).toBe(CITY);
  expect(data?.street).toBe(STREET);
  expect(data?.description).toContain(DESCRIPTION);
});

test("shows an error when the event date is in the past", async ({ page }) => {
  await loginAndOpenCreateEventForm(page);

  await fillCreateEventForm(page, { date: "2020-01-01", time: "18:30" });

  await expect(
    page.getByText("Data wydarzenia musi być w przyszłości."),
  ).toBeVisible();
});
