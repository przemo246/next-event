-- Featured flag: `is_featured = true` puts an event in the "Polecane wydarzenia"
-- row on the landing page. It is flipped by hand in the database (Supabase
-- dashboard / SQL editor), never from the app, so the guard function below
-- rejects any client write to the column.
ALTER TABLE "public"."events"
  ADD COLUMN "is_featured" boolean NOT NULL DEFAULT false;

-- Featured events are listed as "is_featured = true order by starts_at", so the
-- index only holds the (small) featured subset.
CREATE INDEX events_featured_starts_at_idx ON public.events USING btree (starts_at)
  WHERE is_featured;

-- A column-level REVOKE is not enough here: Postgres falls back to the
-- table-level GRANT when a column ACL does not grant the privilege, and
-- `authenticated` holds table-level UPDATE. A trigger is what actually stops
-- `is_featured` from being set over PostgREST.
CREATE OR REPLACE FUNCTION public.events_keep_is_featured_manual()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF current_user NOT IN ('postgres', 'supabase_admin', 'service_role') THEN
    IF TG_OP = 'INSERT' AND NEW.is_featured
      OR TG_OP = 'UPDATE' AND NEW.is_featured IS DISTINCT FROM OLD.is_featured
    THEN
      RAISE EXCEPTION 'is_featured is set by hand in the database, not from the app'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER events_keep_is_featured_manual_trigger
  BEFORE INSERT OR UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.events_keep_is_featured_manual();
