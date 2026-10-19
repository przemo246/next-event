"use client";

import { useActionState, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/libs/ui/button";
import { SelectField } from "@/libs/ui/select-field";
import { Text } from "@/libs/ui/text";
import { TextField } from "@/libs/ui/text-field";
import { CityField } from "@/shared/modules/city-field/presentation/city-field";
import { findCategoryBySlug } from "@/shared/modules/event-taxonomy/helpers/selection";
import type { EventCategory } from "@/shared/modules/event-taxonomy/types/event-category";
import { createEvent } from "../actions/create-event";
import { IMAGE_SIZE_ERROR, MAX_IMAGE_BYTES, MAX_IMAGE_LABEL } from "../helpers/image";
import { RichTextEditor } from "./rich-text-editor";

type CreateEventFormProps = {
  categories: readonly EventCategory[];
};

export const CreateEventForm = ({ categories }: CreateEventFormProps) => {
  const [state, formAction, pending] = useActionState(createEvent, undefined);
  const [showEnd, setShowEnd] = useState(false);
  const [category, setCategory] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const selectedCategory = findCategoryBySlug(categories, category);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <TextField label="Nazwa wydarzenia" name="name" required maxLength={100} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          label="Kategoria"
          name="category"
          required
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="" disabled>
            Wybierz kategorię
          </option>
          {categories.map((candidate) => (
            <option key={candidate.slug} value={candidate.slug}>
              {candidate.name}
            </option>
          ))}
        </SelectField>

        {selectedCategory && selectedCategory.subcategories.length > 0 && (
          <SelectField label="Podkategoria (opcjonalnie)" name="subcategory" defaultValue="">
            <option value="">Wybierz podkategorię</option>
            {selectedCategory.subcategories.map((subcategory) => (
              <option key={subcategory.slug} value={subcategory.slug}>
                {subcategory.name}
              </option>
            ))}
          </SelectField>
        )}
      </div>

      <RichTextEditor name="description" label="Opis wydarzenia" />

      <TextField label="Adres (ulica i numer)" name="street" required maxLength={150} />

      <label className="flex flex-col gap-1.5">
        <Text.Eyebrow>Miasto</Text.Eyebrow>
        <div className="border border-border-strong bg-canvas px-4 py-3 focus-within:border-accent">
          <CityField />
        </div>
      </label>

      <div className="grid grid-cols-2 gap-4">
        <TextField label="Data rozpoczęcia" type="date" name="startDate" required />
        <TextField label="Godzina rozpoczęcia" type="time" name="startTime" required />
      </div>

      {showEnd ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Text.Eyebrow>Zakończenie wydarzenia</Text.Eyebrow>
            <button
              type="button"
              aria-label="Usuń datę i godzinę zakończenia"
              onClick={() => setShowEnd(false)}
              className="cursor-pointer text-foreground-muted outline-none hover:text-accent"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Data zakończenia" type="date" name="endDate" />
            <TextField label="Godzina zakończenia" type="time" name="endTime" />
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="link-accent"
          className="self-start"
          onPress={() => setShowEnd(true)}
        >
          + Data i godzina zakończenia
        </Button>
      )}

      <label className="flex flex-col gap-1.5">
        <Text.Eyebrow>Zdjęcie (opcjonalnie, maks. {MAX_IMAGE_LABEL})</Text.Eyebrow>
        <input
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp"
          aria-invalid={imageError ? true : undefined}
          aria-describedby={imageError ? "image-error" : undefined}
          onChange={(event) => {
            const file = event.target.files?.[0];
            setImageError(
              file && file.size > MAX_IMAGE_BYTES ? IMAGE_SIZE_ERROR : null,
            );
          }}
          className="cursor-pointer border border-border-strong bg-canvas px-4 py-3 text-[15px] text-foreground outline-none file:mr-4 file:cursor-pointer file:border-0 file:bg-canvas-inset file:px-3 file:py-1.5 file:text-foreground focus:border-accent"
        />
        {imageError && <Text.Error id="image-error">{imageError}</Text.Error>}
      </label>

      <TextField label="Link (opcjonalnie)" type="url" name="link" placeholder="https://…" />

      {state?.error && <Text.Error>{state.error}</Text.Error>}

      <Button type="submit" isDisabled={pending || imageError !== null}>
        {pending ? "Zapisywanie…" : "Dodaj wydarzenie"}
      </Button>
    </form>
  );
};
