-- Richer note catalog fields — a display label ("PDF / Mathematical
-- Guide") and a tag list — used by the admin upload form and the
-- student/admin note cards.
alter table public.notes
  add column if not exists file_type text,
  add column if not exists topics text[] not null default '{}';
