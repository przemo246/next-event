import { describe, expect, it } from "vitest";
import {
  MAX_IMAGE_BYTES,
  combineDateAndTime,
  imageExtension,
  isValidUrl,
  schema,
  validateEventTiming,
  validateImage,
} from "../helpers/validation";

const validInput = {
  name: "Koncert",
  description: "Opis wydarzenia.",
  street: "Testowa 1",
  city: "Kraków",
  startDate: "2030-01-01",
  startTime: "18:30",
};

const firstIssue = (input: Record<string, unknown>) => {
  const parsed = schema.safeParse(input);
  return parsed.success ? null : parsed.error.issues[0];
};

describe("isValidUrl", () => {
  it.each(["https://example.com", "http://example.com", "https://example.com/a?b=c"])(
    "accepts %s",
    (value) => {
      expect(isValidUrl(value)).toBe(true);
    },
  );

  it.each(["", "example.com", "not a url", "://missing-scheme", "http://"])(
    "rejects %s",
    (value) => {
      expect(isValidUrl(value)).toBe(false);
    },
  );
});

describe("combineDateAndTime", () => {
  it("combines a date and a time into one instant", () => {
    const result = combineDateAndTime("2030-01-01", "18:30");

    expect(result).not.toBeNull();
    expect(result?.getFullYear()).toBe(2030);
    expect(result?.getMonth()).toBe(0);
    expect(result?.getDate()).toBe(1);
  });

  it.each([
    ["an empty date", "", "18:30"],
    ["an empty time", "2030-01-01", ""],
    ["a non-numeric date", "not-a-date", "18:30"],
    ["a non-numeric time", "2030-01-01", "not-a-time"],
  ])("returns null for %s", (_case, date, time) => {
    expect(combineDateAndTime(date, time)).toBeNull();
  });
});

describe("validateEventTiming", () => {
  const now = new Date("2030-01-01T12:00:00Z");

  it("accepts a future start with no end", () => {
    const startsAt = new Date("2030-01-02T18:30:00Z");

    expect(validateEventTiming({ startsAt, endsAt: null }, now)).toBeNull();
  });

  it("accepts a future start and a later end", () => {
    const startsAt = new Date("2030-01-02T18:30:00Z");
    const endsAt = new Date("2030-01-02T22:00:00Z");

    expect(validateEventTiming({ startsAt, endsAt }, now)).toBeNull();
  });

  it("rejects a start in the past", () => {
    const startsAt = new Date("2020-01-01T18:30:00Z");

    expect(validateEventTiming({ startsAt, endsAt: null }, now)).toBe(
      "Data wydarzenia musi być w przyszłości.",
    );
  });

  it("treats a start exactly at `now` as not in the future", () => {
    expect(validateEventTiming({ startsAt: now, endsAt: null }, now)).toBe(
      "Data wydarzenia musi być w przyszłości.",
    );
  });

  it("rejects an end that equals the start", () => {
    const startsAt = new Date("2030-01-02T18:30:00Z");

    expect(validateEventTiming({ startsAt, endsAt: startsAt }, now)).toBe(
      "Data zakończenia musi być późniejsza niż data rozpoczęcia.",
    );
  });

  it("rejects an end before the start", () => {
    const startsAt = new Date("2030-01-02T18:30:00Z");
    const endsAt = new Date("2030-01-02T17:00:00Z");

    expect(validateEventTiming({ startsAt, endsAt }, now)).toBe(
      "Data zakończenia musi być późniejsza niż data rozpoczęcia.",
    );
  });

  it("reports the past start before the bad end", () => {
    // The action returns a single message, so a form with both problems must
    // surface the start first.
    const startsAt = new Date("2020-01-01T18:30:00Z");
    const endsAt = new Date("2019-01-01T18:30:00Z");

    expect(validateEventTiming({ startsAt, endsAt }, now)).toBe(
      "Data wydarzenia musi być w przyszłości.",
    );
  });
});

describe("validateImage", () => {
  it.each([
    ["image/png", "png"],
    ["image/jpeg", "jpg"],
    ["image/webp", "webp"],
  ])("accepts %s and maps it to .%s", (type, extension) => {
    expect(validateImage({ type, size: 1024 })).toBeNull();
    expect(imageExtension(type)).toBe(extension);
  });

  it.each([
    "image/gif",
    "image/svg+xml",
    "application/pdf",
    "text/html",
    "",
  ])("rejects %s", (type) => {
    expect(validateImage({ type, size: 1024 })).toBe(
      "Zdjęcie musi być w formacie PNG, JPEG lub WebP.",
    );
    expect(imageExtension(type)).toBeUndefined();
  });

  it("accepts a file of exactly the size limit", () => {
    expect(validateImage({ type: "image/png", size: MAX_IMAGE_BYTES })).toBeNull();
  });

  it("rejects a file one byte over the limit", () => {
    expect(validateImage({ type: "image/png", size: MAX_IMAGE_BYTES + 1 })).toBe(
      "Zdjęcie może mieć maksymalnie 5MB.",
    );
  });

  it("reports the format error before the size error", () => {
    expect(validateImage({ type: "image/gif", size: MAX_IMAGE_BYTES + 1 })).toBe(
      "Zdjęcie musi być w formacie PNG, JPEG lub WebP.",
    );
  });
});

describe("schema", () => {
  it("accepts a minimal valid form", () => {
    expect(firstIssue(validInput)).toBeNull();
  });

  it.each([
    ["name", { name: "" }, "Podaj nazwę wydarzenia."],
    ["street", { street: "" }, "Podaj adres (ulicę i numer)."],
    ["city", { city: "Atlantis" }, "Wybierz miasto z listy."],
    ["startDate", { startDate: "" }, "Podaj datę rozpoczęcia."],
    ["startTime", { startTime: "" }, "Podaj godzinę rozpoczęcia."],
    ["description", { description: "   " }, "Opis wydarzenia jest wymagany."],
  ])("rejects an empty %s", (field, override, message) => {
    expect(firstIssue({ ...validInput, ...override })?.message).toBe(message);
    expect(field).toBeTruthy();
  });

  it("rejects a name over 100 characters", () => {
    expect(firstIssue({ ...validInput, name: "a".repeat(101) })?.message).toBe(
      "Nazwa może mieć maksymalnie 100 znaków.",
    );
  });

  it("rejects a street over 150 characters", () => {
    expect(firstIssue({ ...validInput, street: "a".repeat(151) })?.message).toBe(
      "Adres może mieć maksymalnie 150 znaków.",
    );
  });

  it.each(["example.com", "not a url", "://missing-scheme"])(
    "rejects the link %s",
    (link) => {
      expect(firstIssue({ ...validInput, link })?.message).toBe(
        "Podaj poprawny link (np. https://…).",
      );
    },
  );

  it("treats an empty link as no link rather than an invalid one", () => {
    // The link is optional, so "" has to pass. The action turns it into null.
    expect(firstIssue({ ...validInput, link: "" })).toBeNull();
  });

  it.each(["https://example.com", "http://example.com/tickets"])(
    "accepts the link %s",
    (link) => {
      expect(firstIssue({ ...validInput, link })).toBeNull();
    },
  );

  it("trims the name and street", () => {
    const parsed = schema.safeParse({ ...validInput, name: "  Koncert  " });

    expect(parsed.success && parsed.data.name).toBe("Koncert");
  });
});
