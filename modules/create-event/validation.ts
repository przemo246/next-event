import { z } from "zod";
import { POLISH_CITIES } from "@/shared/data/polish-cities";

// Pure validation for the create-event form. Kept out of the "use server"
// action so it can be unit tested without booting a server or a Supabase client.

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

export const ALLOWED_DESCRIPTION_TAGS = [
  "p",
  "br",
  "b",
  "strong",
  "i",
  "em",
  "ul",
  "ol",
  "li",
  "a",
];

export const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// Returns null for input the Date constructor cannot parse, so callers can tell
// "malformed" apart from a valid instant.
export const combineDateAndTime = (date: string, time: string) => {
  const combined = new Date(`${date}T${time}`);

  return Number.isNaN(combined.getTime()) ? null : combined;
};

export const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Podaj nazwę wydarzenia.")
    .max(100, "Nazwa może mieć maksymalnie 100 znaków."),
  description: z.string().trim().min(1, "Opis wydarzenia jest wymagany."),
  street: z
    .string()
    .trim()
    .min(1, "Podaj adres (ulicę i numer).")
    .max(150, "Adres może mieć maksymalnie 150 znaków."),
  city: z
    .string()
    .refine(
      (value) => POLISH_CITIES.includes(value),
      "Wybierz miasto z listy.",
    ),
  startDate: z.string().min(1, "Podaj datę rozpoczęcia."),
  startTime: z.string().min(1, "Podaj godzinę rozpoczęcia."),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  link: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || isValidUrl(value),
      "Podaj poprawny link (np. https://…).",
    )
    .optional(),
});

// The cross-field rules, which the object schema cannot express because they
// compare two fields. `now` is injected so the tests are not time-dependent.
export type EventTiming = { startsAt: Date; endsAt: Date | null };

export const validateEventTiming = (
  { startsAt, endsAt }: EventTiming,
  now: Date,
): string | null => {
  if (startsAt.getTime() <= now.getTime()) {
    return "Data wydarzenia musi być w przyszłości.";
  }

  if (endsAt && endsAt.getTime() <= startsAt.getTime()) {
    return "Data zakończenia musi być późniejsza niż data rozpoczęcia.";
  }

  return null;
};

export type ImageCheck = { type: string; size: number };

export const validateImage = ({ type, size }: ImageCheck): string | null => {
  if (!ALLOWED_IMAGE_TYPES[type]) {
    return "Zdjęcie musi być w formacie PNG, JPEG lub WebP.";
  }

  if (size > MAX_IMAGE_BYTES) {
    return "Zdjęcie może mieć maksymalnie 5MB.";
  }

  return null;
};

export const imageExtension = (type: string) => ALLOWED_IMAGE_TYPES[type];
