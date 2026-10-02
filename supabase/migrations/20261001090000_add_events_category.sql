-- Event category/subcategory. The taxonomy is not finalized yet, so it is
-- validated against a plain constant in the app (shared/data/event-categories.ts)
-- rather than a DB enum or a `categories` table — the same approach already
-- used for `city` vs. POLISH_CITIES. This keeps the list editable without a
-- migration while the categories are still being worked out.
--
-- `category` is added with a backfill default so the column can be NOT NULL
-- even if rows already exist, then the default is dropped so every future
-- insert must supply one explicitly (the create-event form always does).
ALTER TABLE "public"."events"
  ADD COLUMN "category" text NOT NULL DEFAULT 'Inne',
  ADD COLUMN "subcategory" text;

ALTER TABLE "public"."events"
  ALTER COLUMN "category" DROP DEFAULT;

CREATE INDEX events_category_starts_at_idx ON public.events USING btree (category, starts_at);
