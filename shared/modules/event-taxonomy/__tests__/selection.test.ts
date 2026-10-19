import { describe, expect, it } from "vitest";
import { resolveCategorySelection } from "../helpers/selection";
import type { EventCategory } from "../types/event-category";

// Stand-in for the taxonomy table: the point of these cases is the pairing
// rules, not the rows, so the ids are made-up but internally consistent.
const taxonomy: EventCategory[] = [
  {
    id: 1,
    name: "Koncerty",
    slug: "koncerty",
    subcategories: [
      { id: 10, name: "Rock", slug: "rock" },
      { id: 11, name: "Jazz", slug: "jazz" },
    ],
  },
  { id: 2, name: "Teatr", slug: "teatr", subcategories: [] },
];

describe("resolveCategorySelection", () => {
  it("resolves a category that has no subcategories", () => {
    expect(
      resolveCategorySelection(taxonomy, { category: "teatr" }),
    ).toEqual({ ok: true, categoryId: 2, subcategoryId: null });
  });

  it("resolves a category with one of its own subcategories", () => {
    expect(
      resolveCategorySelection(taxonomy, {
        category: "koncerty",
        subcategory: "jazz",
      }),
    ).toEqual({ ok: true, categoryId: 1, subcategoryId: 11 });
  });

  it.each([
    ["an empty category", ""],
    ["a category that is not in the taxonomy", "atlantis"],
  ])("blames the category for %s", (_case, category) => {
    expect(resolveCategorySelection(taxonomy, { category })).toEqual({
      ok: false,
      reason: "category",
    });
  });

  it("blames the subcategory when it belongs to a different category", () => {
    // The database rejects this pair too, through
    // `events_category_subcategory_fkey` — the reason is reported separately
    // so the form can point at the field instead of saying "wrong pair".
    expect(
      resolveCategorySelection(taxonomy, {
        category: "teatr",
        subcategory: "rock",
      }),
    ).toEqual({ ok: false, reason: "subcategory" });
  });

  it("blames the subcategory when no such subcategory exists", () => {
    expect(
      resolveCategorySelection(taxonomy, {
        category: "koncerty",
        subcategory: "dramat",
      }),
    ).toEqual({ ok: false, reason: "subcategory" });
  });
});
