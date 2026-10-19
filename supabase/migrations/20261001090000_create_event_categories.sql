-- The event taxonomy gets its own tables instead of free-text columns on
-- `events`. Adding a genre or renaming a label is then a row edit, not a
-- migration, and a subcategory cannot be paired with a category it does not
-- belong to because the composite foreign key below rejects it.
--
-- `slug` is what the app puts in `/search` URLs, so a label can be reworded
-- without breaking a link somebody shared; `name` is the display text.
--
-- Rows are curated by hand (Supabase dashboard / SQL editor), same as
-- `quick_filters` — the app only reads them, there is no write path.
CREATE TABLE "public"."event_categories" (
  "id"       bigint  GENERATED ALWAYS AS IDENTITY NOT NULL,
  "name"     text    NOT NULL,
  "slug"     text    NOT NULL,
  "position" smallint NOT NULL DEFAULT 0,
  CONSTRAINT "event_categories_pkey" PRIMARY KEY (id),
  CONSTRAINT "event_categories_name_key" UNIQUE (name),
  CONSTRAINT "event_categories_slug_key" UNIQUE (slug),
  CONSTRAINT "event_categories_name_check" CHECK (char_length(name) <= 60),
  CONSTRAINT "event_categories_slug_check" CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

CREATE TABLE "public"."event_subcategories" (
  "id"          bigint  GENERATED ALWAYS AS IDENTITY NOT NULL,
  "category_id" bigint  NOT NULL,
  "name"        text    NOT NULL,
  "slug"        text    NOT NULL,
  "position"    smallint NOT NULL DEFAULT 0,
  CONSTRAINT "event_subcategories_pkey" PRIMARY KEY (id),
  -- The pair is the target of `events_category_subcategory_fkey`, so a
  -- subcategory id on its own would not identify the row.
  CONSTRAINT "event_subcategories_category_id_id_key" UNIQUE (category_id, id),
  -- Two subcategories of one category cannot differ by display text either —
  -- the search filter and the create-event select both key off `slug`.
  CONSTRAINT "event_subcategories_category_id_slug_key" UNIQUE (category_id, slug),
  CONSTRAINT "event_subcategories_category_id_name_key" UNIQUE (category_id, name),
  CONSTRAINT "event_subcategories_name_check" CHECK (char_length(name) <= 60),
  CONSTRAINT "event_subcategories_slug_check" CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

ALTER TABLE "public"."event_subcategories"
  ADD CONSTRAINT "event_subcategories_category_id_fkey" FOREIGN KEY (category_id) REFERENCES "public"."event_categories"(id) ON DELETE CASCADE;

ALTER TABLE "public"."event_categories"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."event_categories"
  FORCE ROW LEVEL SECURITY;

-- Public, read-only: no insert/update/delete policy exists, so those stay
-- blocked for "anon"/"authenticated" regardless of the table grants below.
CREATE POLICY "event_categories_select_policy" ON "public"."event_categories"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

GRANT SELECT ON TABLE "public"."event_categories" TO "anon", "authenticated";
GRANT ALL ON TABLE "public"."event_categories" TO "service_role";

ALTER TABLE "public"."event_subcategories"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."event_subcategories"
  FORCE ROW LEVEL SECURITY;

CREATE POLICY "event_subcategories_select_policy" ON "public"."event_subcategories"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

GRANT SELECT ON TABLE "public"."event_subcategories" TO "anon", "authenticated";
GRANT ALL ON TABLE "public"."event_subcategories" TO "service_role";

ALTER TABLE "public"."events"
  ADD COLUMN "category_id" bigint,
  ADD COLUMN "subcategory_id" bigint;

-- Anything that predates the taxonomy lands in the catch-all category, which is
-- what lets `category_id` be NOT NULL without leaving a default behind that
-- would silently pick a category for future inserts.
UPDATE "public"."events"
  SET "category_id" = (SELECT id FROM "public"."event_categories" WHERE slug = 'inne');

ALTER TABLE "public"."events"
  ALTER COLUMN "category_id" SET NOT NULL;

ALTER TABLE "public"."events"
  ADD CONSTRAINT "events_category_id_fkey" FOREIGN KEY (category_id) REFERENCES "public"."event_categories"(id);

-- MATCH SIMPLE is what lets an event with no subcategory pass this constraint
-- (the nullable column makes the whole check vacuously true), while an event
-- that names one still has to name it under its own category.
ALTER TABLE "public"."events"
  ADD CONSTRAINT "events_category_subcategory_fkey" FOREIGN KEY (category_id, subcategory_id) REFERENCES "public"."event_subcategories"(category_id, id);

CREATE INDEX events_category_id_starts_at_idx ON public.events USING btree (category_id, starts_at);

CREATE INDEX events_subcategory_id_starts_at_idx ON public.events USING btree (subcategory_id, starts_at);

INSERT INTO "public"."event_categories" ("name", "slug", "position")
VALUES
  ('Koncerty', 'koncerty', 0),
  ('Teatr', 'teatr', 1),
  ('Kino', 'kino', 2),
  ('Kluby', 'kluby', 3),
  ('Festiwale', 'festiwale', 4),
  ('Sport', 'sport', 5),
  ('Inne', 'inne', 6);

INSERT INTO "public"."event_subcategories" ("category_id", "name", "slug", "position")
SELECT c.id, s.name, s.slug, s.position
FROM (VALUES
  ('koncerty', 'Pop', 'pop', 0),
  ('koncerty', 'Rock', 'rock', 1),
  ('koncerty', 'Hip-Hop/Rap', 'hip-hop-rap', 2),
  ('koncerty', 'Elektronika', 'elektronika', 3),
  ('koncerty', 'Jazz', 'jazz', 4),
  ('koncerty', 'Muzyka taneczna', 'muzyka-taneczna', 5),
  ('koncerty', 'Muzyka klasyczna', 'muzyka-klasyczna', 6),
  ('koncerty', 'Folk', 'folk', 7),
  ('koncerty', 'Metal', 'metal', 8)
) AS s(category_slug, name, slug, position)
JOIN "public"."event_categories" c ON c.slug = s.category_slug;
