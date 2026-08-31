-- Speeds up the public homepage/events page query pattern: approved
-- events ordered by newest first. The existing events_status_idx (plain
-- btree on status) doesn't help with the created_at ordering; this partial
-- index covers both in one pass and stays small since it only indexes
-- approved rows.
CREATE INDEX IF NOT EXISTS idx_events_approved_created
  ON public.events (created_at DESC)
  WHERE status = 'approved';
