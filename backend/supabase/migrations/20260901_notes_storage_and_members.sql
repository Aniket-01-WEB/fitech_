-- Public-read bucket for uploaded note files. Public so a signed-in
-- member's browser can render/download a note without an extra signed-URL
-- round trip — RLS on storage.objects still gates who may add/remove files.
insert into storage.buckets (id, name, public)
values ('notes', 'notes', true)
on conflict (id) do nothing;

create policy "notes_bucket_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'notes');

create policy "notes_bucket_write_staff" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'notes' and public.is_staff((select auth.uid())));

create policy "notes_bucket_delete_staff" on storage.objects
  for delete to authenticated
  using (bucket_id = 'notes' and public.is_staff((select auth.uid())));

-- Note: the corresponding GET /api/members backend route (full member
-- directory, admin/superadmin only) needed no new RLS — it reuses the
-- existing profiles_select_own_or_staff policy.
