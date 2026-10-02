"use client";

import { useActionState, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/libs/ui/button";
import { SelectField } from "@/libs/ui/select-field";
import { Text } from "@/libs/ui/text";
import { TextField } from "@/libs/ui/text-field";
import { CityField } from "@/shared/modules/city-field/presentation/city-field";
import { EVENT_CATEGORIES, subcategoriesFor } from "@/shared/data/event-categories";
import { createEvent } from "../actions/create-event";
import { RichTextEditor } from "./rich-text-editor";

export const CreateEventForm = () => {
  const [state, formAction, pending] = useActionState(createEvent, undefined);
  const [showEnd, setShowEnd] = useState(false);
  const [category, setCategory] = useState("");
  const subcategories = subcategoriesFor(category);

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
          {EVENT_CATEGORIES.map((eventCategory) => (
            <option key={eventCategory.name} value={eventCategory.name}>
              {eventCategory.name}
            </option>
          ))}
        </SelectField>

        {subcategories && (
          <SelectField label="Podkategoria (opcjonalnie)" name="subcategory" defaultValue="">
            <option value="">Wybierz podkategorię</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>
                {subcategory}
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
        <Text.Eyebrow>Zdjęcie (opcjonalnie)</Text.Eyebrow>
        <input
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/webp"
          className="cursor-pointer border border-border-strong bg-canvas px-4 py-3 text-[15px] text-foreground outline-none file:mr-4 file:cursor-pointer file:border-0 file:bg-canvas-inset file:px-3 file:py-1.5 file:text-foreground focus:border-accent"
        />
      </label>

      <TextField label="Link (opcjonalnie)" type="url" name="link" placeholder="https://…" />

      {state?.error && <Text.Error>{state.error}</Text.Error>}

      <Button type="submit" isDisabled={pending}>
        {pending ? "Zapisywanie…" : "Dodaj wydarzenie"}
      </Button>
    </form>
  );
};
