CREATE TABLE "public"."events" (
  "id"          bigint                   GENERATED ALWAYS AS IDENTITY NOT NULL,
  "user_id"     uuid                     NOT NULL,
  "name"        text                     NOT NULL,
  "description" text                     NOT NULL,
  "street"      text                     NOT NULL,
  "city"        text                     NOT NULL,
  "starts_at"   timestamp with time zone NOT NULL,
  "ends_at"     timestamp with time zone,
  "image_path"  text,
  "link"        text,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "events_name_check" CHECK ((char_length(name) <= 100)),
  CONSTRAINT "events_pkey" PRIMARY KEY (id),
  CONSTRAINT "events_street_check" CHECK ((char_length(street) <= 150))
);

ALTER TABLE "public"."events"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."events"
  FORCE ROW LEVEL SECURITY;

ALTER TABLE "public"."events"
  ADD CONSTRAINT "events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX events_starts_at_idx ON public.events USING btree (starts_at);

CREATE INDEX events_user_id_idx ON public.events USING btree (user_id);

CREATE POLICY "events_delete_policy" ON "public"."events"
  FOR DELETE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "events_insert_policy" ON "public"."events"
  FOR INSERT
  TO "authenticated"
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

CREATE POLICY "events_select_policy" ON "public"."events"
  FOR SELECT
  TO "anon", "authenticated"
  USING (true);

CREATE POLICY "events_update_policy" ON "public"."events"
  FOR UPDATE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = user_id));

-- Bucket for event cover images. Not picked up by schema diffing (it's a data
-- row, not a schema object), so it's added here by hand.
INSERT INTO "storage"."buckets" (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-images',
  'event-images',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "event_images_delete_policy" ON "storage"."objects"
  FOR DELETE
  TO "authenticated"
  USING (((bucket_id = 'event-images'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));

CREATE POLICY "event_images_insert_policy" ON "storage"."objects"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (((bucket_id = 'event-images'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));

CREATE POLICY "event_images_select_policy" ON "storage"."objects"
  FOR SELECT
  TO "anon", "authenticated"
  USING ((bucket_id = 'event-images'::text));

CREATE POLICY "event_images_update_policy" ON "storage"."objects"
  FOR UPDATE
  TO "authenticated"
  USING (((bucket_id = 'event-images'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)))
  WITH CHECK (((bucket_id = 'event-images'::text) AND ((storage.foldername(name))[1] = (( SELECT auth.uid() AS uid))::text)));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."events" TO "anon", "authenticated", "postgres", "service_role";
