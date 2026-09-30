-- One profile row per auth user, created by the trigger at the bottom of this
-- file.
--
-- username is nullable on purpose. The register form requires it, but
-- auth.users rows can also be created by the admin API (the e2e fixtures) and by
-- any future sign-up path, and PostgreSQL allows any number of NULLs in a
-- UNIQUE column. NULL means "no handle picked yet", which is the state the
-- onboarding gate will look for.
--
-- The CHECK holds the format rules in one place: 3–30 characters, lowercase
-- ASCII letters, digits and underscore. The register action normalises the input
-- to lowercase before it ever reaches the database, so the CHECK only has to
-- reject what the admin API might write.
CREATE TABLE "public"."profiles" (
  "id"         uuid                     NOT NULL,
  "username"   text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id),
  CONSTRAINT "profiles_username_check" CHECK (username ~ '^[a-z0-9_]{3,30}$'),
  CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles"
  FORCE ROW LEVEL SECURITY;

-- Case-insensitive uniqueness: "Jan" and "jan" are the same handle. Plain
-- `UNIQUE` on the column would let both through.
--
-- This index is what actually decides who wins, but it cannot be the only
-- check: a unique violation aborts the sign-up with HTTP 500, and @supabase/
-- auth-js turns any 5xx into a retryable AuthRetryableFetchError before it
-- reads the Postgres code out of the response body. The register action
-- therefore asks username_is_taken first and keeps this index as a backstop.
CREATE UNIQUE INDEX profiles_username_lower_key ON public.profiles USING btree (lower(username));

CREATE POLICY "profiles_select_policy" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = id));

CREATE POLICY "profiles_update_policy" ON "public"."profiles"
  FOR UPDATE
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = id));

-- Availability check for the register form, asked before sign-up. It has to be
-- a definer function because profiles are readable only by their owner and the
-- person picking a handle is not logged in yet. It reveals whether a handle
-- exists and nothing else, which is the same thing any "is this name free?"
-- field has to reveal.
CREATE OR REPLACE FUNCTION public.username_is_taken(candidate text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE lower(username) = lower(candidate)
  );
$$;

REVOKE ALL ON FUNCTION public.username_is_taken(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.username_is_taken(text) TO "anon", "authenticated";

-- The profile is written during signup, before the browser ever holds a session,
-- so the trigger is the only thing that can create it. It reads the handle from
-- sign-up user metadata, which is where `register` puts it.
--
-- SECURITY DEFINER because auth.users rows are inserted by supabase_auth_admin,
-- which the profiles policies above would reject. The owner is postgres, which
-- has BYPASSRLS and therefore still inserts despite FORCE ROW LEVEL SECURITY.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, nullif(btrim(new.raw_user_meta_data ->> 'username'), ''));

  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

GRANT SELECT, UPDATE ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";
