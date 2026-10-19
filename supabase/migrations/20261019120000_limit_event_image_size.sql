-- Event cover images are capped at 3MB (3 * 1024 * 1024), matching
-- `MAX_IMAGE_BYTES` in the create-event action. Enforcing it on the bucket as
-- well stops a direct upload from bypassing the form's server-side check.
--
-- The bucket is created in `20260929115912_create_events_table.sql` with a 5MB
-- limit. That migration has already run everywhere, so the change belongs in a
-- new one rather than an edit to it.
UPDATE storage.buckets
SET file_size_limit = 3145728
WHERE id = 'event-images';
