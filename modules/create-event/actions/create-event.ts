"use server";

import DOMPurify from "isomorphic-dompurify";
import { redirect } from "next/navigation";
import { createClient } from "@/core/supabase/server";
import type { CreateEventState } from "../types/create-event";
import {
  ALLOWED_DESCRIPTION_TAGS,
  combineDateAndTime,
  imageExtension,
  schema,
  validateCategorySelection,
  validateEventTiming,
  validateImage,
} from "../helpers/validation";

export async function createEvent(
  _state: CreateEventState,
  formData: FormData,
): Promise<CreateEventState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    category: formData.get("category"),
    subcategory: formData.get("subcategory") || undefined,
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

  const {
    name,
    description,
    category,
    subcategory,
    street,
    city,
    startDate,
    startTime,
    endDate,
    endTime,
    link,
  } = parsed.data;

  const categoryError = validateCategorySelection({ category, subcategory });

  if (categoryError) {
    return { error: categoryError };
  }

  const startsAt = combineDateAndTime(startDate, startTime);

  if (!startsAt) {
    return { error: "Podaj poprawną datę i godzinę rozpoczęcia." };
  }

  let endsAt: Date | null = null;

  if (endDate && endTime) {
    endsAt = combineDateAndTime(endDate, endTime);

    if (!endsAt) {
      return { error: "Podaj poprawną datę i godzinę zakończenia." };
    }
  }

  const timingError = validateEventTiming({ startsAt, endsAt }, new Date());

  if (timingError) {
    return { error: timingError };
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
    const extension = imageExtension(image.type);
    const imageError = validateImage({ type: image.type, size: image.size });

    if (imageError) {
      return { error: imageError };
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
    category,
    subcategory: subcategory || null,
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
