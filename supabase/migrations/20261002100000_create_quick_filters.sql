-- Quick filters on the landing page (Halloween, Mikołajki, Sylwester, ...)
-- used to be a hardcoded array of `{ label, href }` with the `/search` URL
-- baked into the href. That couples editorial content (which occasions to
-- show, this season's dates) to the app's routing. This table holds only the
-- data — `name` + the date range — and the app builds the `/search` link
-- from it (see `modules/landing/helpers/url.ts`), so a routing change only
-- touches one function instead of every row.
--
-- Rows are curated by hand (Supabase dashboard / SQL editor), same as
-- `events.is_featured` — there is no write path from the app.
CREATE TABLE "public"."quick_filters" (
  "id"        bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  "name"      text NOT NULL,
  "date_from" date NOT NULL,
  "date_to"   date NOT NULL,
  CONSTRAINT "quick_filters_pkey" PRIMARY KEY (id),
  CONSTRAINT "quick_filters_name_check" CHECK (char_length(name) <= 60),
  CONSTRAINT "quick_filters_date_range_check" CHECK (date_to >= date_from)
);

ALTER TABLE "public"."quick_filters"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."quick_filters"
  FORCE ROW LEVEL SECURITY;

-- Public, read-only: no insert/update/delete policy exists, so those stay
-- blocked for "anon"/"authenticated" regardless of the table grants below.
CREATE POLICY "quick_filters_select_policy" ON "public"."quick_filters"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

GRANT SELECT ON TABLE "public"."quick_filters" TO "anon", "authenticated";
GRANT ALL ON TABLE "public"."quick_filters" TO "service_role";

-- Seed with the occasions the landing page already linked to by hand.
INSERT INTO "public"."quick_filters" ("name", "date_from", "date_to")
VALUES
  ('Halloween', '2026-10-31', '2026-10-31'),
  ('Święto Niepodległości', '2026-11-11', '2026-11-11'),
  ('Mikołajki', '2026-12-06', '2026-12-06'),
  ('Sylwester 26/27', '2026-12-31', '2027-01-01');
