-- file_url was a leftover from the pre-R2 era (a client could set it to any
-- arbitrary URL, including a Supabase Storage link). Notes now have exactly
-- two legitimate sources: external_link (a URL the admin points to) or
-- r2_key (a file actually stored in this app's own R2 bucket). The table
-- is empty, so this is a clean schema simplification, not a migration of
-- real data.
alter table public.notes drop constraint if exists notes_has_source;
alter table public.notes drop column if exists file_url;
alter table public.notes add constraint notes_has_source
  check (external_link is not null or r2_key is not null);
