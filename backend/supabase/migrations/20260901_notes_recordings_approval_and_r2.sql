-- ----------------------------------------------------------------------------
-- Notes and recordings get the same approval workflow events already has
-- (force-pending on insert, superadmin-only approve/reject, uploader can
-- resubmit a rejection), plus an r2_key column: the object key of a file
-- an admin uploaded to Cloudflare R2. R2 access itself is never done from
-- Postgres/RLS — the backend is the only thing holding R2 credentials and
-- mints short-lived presigned PUT/GET URLs per request, exactly the same
-- trust boundary this project already keeps around Supabase's service key.
-- ----------------------------------------------------------------------------

alter table public.notes
  add column if not exists status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  add column if not exists reviewed_by uuid references public.profiles (id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists r2_key text;

alter table public.recordings
  add column if not exists status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  add column if not exists reviewed_by uuid references public.profiles (id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists r2_key text;

-- Backfill: anything uploaded before this workflow existed stays visible.
update public.notes set status = 'approved' where status = 'pending';
update public.recordings set status = 'approved' where status = 'pending';

create index if not exists notes_status_idx on public.notes (status);
create index if not exists recordings_status_idx on public.recordings (status);

-- r2_key is now a valid "source" for a note alongside file_url/external_link.
alter table public.notes drop constraint if exists notes_has_source;
alter table public.notes add constraint notes_has_source
  check (file_url is not null or external_link is not null or r2_key is not null);

-- ---- notes: force-pending on insert ----
create function public.notes_before_insert()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.uploaded_by := (select auth.uid());
  new.status := 'pending';
  new.reviewed_by := null;
  new.reviewed_at := null;
  return new;
end;
$$;

create trigger notes_force_pending
  before insert on public.notes
  for each row execute function public.notes_before_insert();

-- ---- notes: superadmin-only status changes, uploader may resubmit a rejection ----
create function public.notes_guard_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status <> old.status then
    if (select auth.uid()) is null then
      null;
    elsif exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'superadmin') then
      new.reviewed_by := (select auth.uid());
      new.reviewed_at := now();
    elsif old.status = 'rejected' and new.status = 'pending' and old.uploaded_by = (select auth.uid()) then
      new.reviewed_by := null;
      new.reviewed_at := null;
    else
      raise exception 'Only a super admin can approve or reject a note (the uploader may resubmit a rejected one).';
    end if;
  end if;
  return new;
end;
$$;

create trigger notes_guard_status
  before update on public.notes
  for each row execute function public.notes_guard_status_change();

revoke execute on function public.notes_before_insert() from public, anon, authenticated;
revoke execute on function public.notes_guard_status_change() from public, anon, authenticated;

-- ---- recordings: same pattern, keyed on created_by ----
create function public.recordings_before_insert()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.created_by := (select auth.uid());
  new.status := 'pending';
  new.reviewed_by := null;
  new.reviewed_at := null;
  return new;
end;
$$;

create trigger recordings_force_pending
  before insert on public.recordings
  for each row execute function public.recordings_before_insert();

create function public.recordings_guard_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status <> old.status then
    if (select auth.uid()) is null then
      null;
    elsif exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'superadmin') then
      new.reviewed_by := (select auth.uid());
      new.reviewed_at := now();
    elsif old.status = 'rejected' and new.status = 'pending' and old.created_by = (select auth.uid()) then
      new.reviewed_by := null;
      new.reviewed_at := null;
    else
      raise exception 'Only a super admin can approve or reject a recording (the uploader may resubmit a rejected one).';
    end if;
  end if;
  return new;
end;
$$;

create trigger recordings_guard_status
  before update on public.recordings
  for each row execute function public.recordings_guard_status_change();

revoke execute on function public.recordings_before_insert() from public, anon, authenticated;
revoke execute on function public.recordings_guard_status_change() from public, anon, authenticated;

-- ---- select policies: students only see approved; staff see everything ----
drop policy if exists "notes_select_authenticated" on public.notes;
create policy "notes_select_approved_or_staff" on public.notes
  for select to authenticated
  using (status = 'approved' or public.is_staff((select auth.uid())));

drop policy if exists "recordings_select_authenticated" on public.recordings;
create policy "recordings_select_approved_or_staff" on public.recordings
  for select to authenticated
  using (status = 'approved' or public.is_staff((select auth.uid())));
