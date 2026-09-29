"use server";

import DOMPurify from "isomorphic-dompurify";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/core/supabase/server";
import { POLISH_CITIES } from "@/shared/data/polish-cities";
import type { CreateEventState } from "../types/create-event";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const ALLOWED_DESCRIPTION_TAGS = ["p", "br", "b", "strong", "i", "em", "ul", "ol", "li", "a"];

const isValidUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

const combineDateAndTime = (date: string, time: string) => {
  const combined = new Date(`${date}T${time}`);

  return Number.isNaN(combined.getTime()) ? null : combined;
};

const schema = z.object({
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
    .refine((value) => POLISH_CITIES.includes(value), "Wybierz miasto z listy."),
  startDate: z.string().min(1, "Podaj datę rozpoczęcia."),
  startTime: z.string().min(1, "Podaj godzinę rozpoczęcia."),
  endDate: z.string().optional(),
  endTime: z.string().optional(),
  link: z
    .string()
    .trim()
    .refine((value) => value === "" || isValidUrl(value), "Podaj poprawny link (np. https://…).")
    .optional(),
});

export async function createEvent(
  _state: CreateEventState,
  formData: FormData,
): Promise<CreateEventState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    street: formData.get("street"),
    city: formData.get("city"),
    startDate: formData.get("startDate"),
    startTime: formData.get("startTime"),
    endDate: formData.get("endDate") || undefined,
    endTime: formData.get("endTime") || undefined,
    link: formData.get("link") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Sprawdź poprawność formularza." };
  }

  const { name, description, street, city, startDate, startTime, endDate, endTime, link } =
    parsed.data;

  const startsAt = combineDateAndTime(startDate, startTime);

  if (!startsAt) {
    return { error: "Podaj poprawną datę i godzinę rozpoczęcia." };
  }

  if (startsAt.getTime() <= Date.now()) {
    return { error: "Data wydarzenia musi być w przyszłości." };
  }

  let endsAt: Date | null = null;

  if (endDate && endTime) {
    endsAt = combineDateAndTime(endDate, endTime);

    if (!endsAt) {
      return { error: "Podaj poprawną datę i godzinę zakończenia." };
    }

    if (endsAt.getTime() <= startsAt.getTime()) {
      return { error: "Data zakończenia musi być późniejsza niż data rozpoczęcia." };
    }
  }

  const descriptionHtml = DOMPurify.sanitize(description, {
    ALLOWED_TAGS: ALLOWED_DESCRIPTION_TAGS,
    ALLOWED_ATTR: ["href"],
  }).replace(/<a /g, '<a target="_blank" rel="noopener noreferrer nofollow" ');

  if (!descriptionHtml.replace(/<[^>]*>/g, "").trim()) {
    return { error: "Opis wydarzenia jest wymagany." };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    redirect("/login");
  }

  const userId = userData.user.id;

  const image = formData.get("image");
  let imagePath: string | null = null;

  if (image instanceof File && image.size > 0) {
    const extension = ALLOWED_IMAGE_TYPES[image.type];

    if (!extension) {
      return { error: "Zdjęcie musi być w formacie PNG, JPEG lub WebP." };
    }

    if (image.size > MAX_IMAGE_BYTES) {
      return { error: "Zdjęcie może mieć maksymalnie 5MB." };
    }

    const path = `${userId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("event-images")
      .upload(path, image, { contentType: image.type });

    if (uploadError) {
      return { error: "Nie udało się wgrać zdjęcia. Spróbuj ponownie." };
    }

    imagePath = path;
  }

  const { error: insertError } = await supabase.from("events").insert({
    user_id: userId,
    name,
    description: descriptionHtml,
    street,
    city,
    starts_at: startsAt.toISOString(),
    ends_at: endsAt ? endsAt.toISOString() : null,
    image_path: imagePath,
    link: link || null,
  });

  if (insertError) {
    return { error: "Nie udało się zapisać wydarzenia. Spróbuj ponownie." };
  }

  redirect("/");
}
