import type { EventCategory, EventSubcategory } from "../types/event-category";

// Slugs are what the app puts in URLs and form values, ids are what the
// columns store, so every hand-off between the two goes through these two
// lookups rather than an ad-hoc `find` at the call site.
export const findCategoryBySlug = (
  taxonomy: readonly EventCategory[],
  slug: string,
): EventCategory | undefined =>
  taxonomy.find((category) => category.slug === slug);

// Takes the resolved category rather than the taxonomy so a subcategory
// borrowed from another category cannot be found by accident — the same rule
// the composite foreign key on `events` enforces in the database.
export const findSubcategoryBySlug = (
  category: EventCategory,
  slug: string,
): EventSubcategory | undefined =>
  category.subcategories.find((subcategory) => subcategory.slug === slug);

export type CategorySelection = { category: string; subcategory?: string };

export type ResolvedCategorySelection = {
  categoryId: number;
  subcategoryId: number | null;
};

// `reason` tells the two rejections apart so the form can name the field at
// fault instead of showing one vague message for both.
export type CategorySelectionResult =
  | ({ ok: true } & ResolvedCategorySelection)
  | { ok: false; reason: "category" | "subcategory" };

// Pure, so the create-event form's cross-field rules stay unit testable
// without a database. `events_category_subcategory_fkey` rejects the same pairs
// this function refuses; this one exists to say which field was wrong.
export const resolveCategorySelection = (
  taxonomy: readonly EventCategory[],
  { category, subcategory }: CategorySelection,
): CategorySelectionResult => {
  const selectedCategory = findCategoryBySlug(taxonomy, category);

  if (!selectedCategory) {
    return { ok: false, reason: "category" };
  }

  if (!subcategory) {
    return {
      ok: true,
      categoryId: selectedCategory.id,
      subcategoryId: null,
    };
  }

  const selectedSubcategory = findSubcategoryBySlug(selectedCategory, subcategory);

  if (!selectedSubcategory) {
    return { ok: false, reason: "subcategory" };
  }

  return {
    ok: true,
    categoryId: selectedCategory.id,
    subcategoryId: selectedSubcategory.id,
  };
};
