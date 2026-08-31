-- ============================================================================
-- RLS performance fix-up + activity increment RPC.
-- Combines what was applied to the remote project as two migrations:
--   1. optimize_rls_policies — fixes the auth_rls_initplan and
--      multiple_permissive_policies advisor warnings from the initial schema.
--   2. add_increment_activity_rpc — atomic upsert-and-increment for the
--      per-second activity tracker (avoids read-then-write races).
-- ============================================================================

create function public.is_staff(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid and p.role in ('admin', 'superadmin')
  );
$$;

revoke execute on function public.is_staff(uuid) from public;
grant execute on function public.is_staff(uuid) to anon, authenticated;

-- ---- profiles ---------------------------------------------------------
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_staff" on public.profiles;

create policy "profiles_select_own_or_staff" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_staff((select auth.uid())));

drop policy if exists "profiles_update_own" on public.profiles;

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---- events -------------------------------------------------------------
drop policy if exists "events_select_public_approved" on public.events;
drop policy if exists "events_select_staff_all" on public.events;

create policy "events_select_approved_or_staff" on public.events
  for select to anon, authenticated
  using (status = 'approved' or public.is_staff((select auth.uid())));

drop policy if exists "events_insert_admin" on public.events;

create policy "events_insert_admin" on public.events
  for insert to authenticated
  with check (public.is_staff((select auth.uid())));

drop policy if exists "events_update_staff" on public.events;

create policy "events_update_staff" on public.events
  for update to authenticated
  using (public.is_staff((select auth.uid())))
  with check (public.is_staff((select auth.uid())));

drop policy if exists "events_delete_staff" on public.events;

create policy "events_delete_staff" on public.events
  for delete to authenticated
  using (public.is_staff((select auth.uid())));

-- ---- event_registrations -------------------------------------------------
drop policy if exists "registrations_select_own" on public.event_registrations;
drop policy if exists "registrations_select_staff" on public.event_registrations;

create policy "registrations_select_own_or_staff" on public.event_registrations
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_staff((select auth.uid())));

drop policy if exists "registrations_insert_own_approved_event" on public.event_registrations;

create policy "registrations_insert_own_approved_event" on public.event_registrations
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.events e where e.id = event_id and e.status = 'approved')
  );

drop policy if exists "registrations_delete_own" on public.event_registrations;

create policy "registrations_delete_own" on public.event_registrations
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- ---- recordings -----------------------------------------------------------
drop policy if exists "recordings_select_authenticated" on public.recordings;
drop policy if exists "recordings_write_staff" on public.recordings;

create policy "recordings_select_authenticated" on public.recordings
  for select to authenticated
  using (true);

create policy "recordings_write_staff" on public.recordings
  for insert to authenticated
  with check (public.is_staff((select auth.uid())));

create policy "recordings_update_staff" on public.recordings
  for update to authenticated
  using (public.is_staff((select auth.uid())))
  with check (public.is_staff((select auth.uid())));

create policy "recordings_delete_staff" on public.recordings
  for delete to authenticated
  using (public.is_staff((select auth.uid())));

-- ---- notes ------------------------------------------------------------------
drop policy if exists "notes_select_authenticated" on public.notes;
drop policy if exists "notes_write_staff" on public.notes;

create policy "notes_select_authenticated" on public.notes
  for select to authenticated
  using (true);

create policy "notes_insert_staff" on public.notes
  for insert to authenticated
  with check (public.is_staff((select auth.uid())));

create policy "notes_update_staff" on public.notes
  for update to authenticated
  using (public.is_staff((select auth.uid())))
  with check (public.is_staff((select auth.uid())));

create policy "notes_delete_staff" on public.notes
  for delete to authenticated
  using (public.is_staff((select auth.uid())));

-- ---- student_activity ---------------------------------------------------------
drop policy if exists "activity_select_own" on public.student_activity;
drop policy if exists "activity_select_staff" on public.student_activity;

create policy "activity_select_own_or_staff" on public.student_activity
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_staff((select auth.uid())));

drop policy if exists "activity_insert_own" on public.student_activity;

create policy "activity_insert_own" on public.student_activity
  for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "activity_update_own" on public.student_activity;

create policy "activity_update_own" on public.student_activity
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));


-- ----------------------------------------------------------------------------
-- Atomic upsert-and-increment for the per-second activity tracker.
-- security invoker (the default) — runs as the calling user, so the RLS
-- policies above still gate it normally.
-- ----------------------------------------------------------------------------
create function public.increment_activity(
  delta_web integer default 0,
  delta_rec integer default 0,
  increment_session boolean default false
)
returns public.student_activity
language plpgsql
security invoker
set search_path = public
as $$
declare
  result public.student_activity;
begin
  insert into public.student_activity (user_id, total_seconds, website_seconds, recording_seconds, sessions_watched, last_active)
  values (
    (select auth.uid()),
    greatest(delta_web, 0) + greatest(delta_rec, 0),
    greatest(delta_web, 0),
    greatest(delta_rec, 0),
    case when increment_session then 1 else 0 end,
    now()
  )
  on conflict (user_id) do update set
    total_seconds = public.student_activity.total_seconds + greatest(delta_web, 0) + greatest(delta_rec, 0),
    website_seconds = public.student_activity.website_seconds + greatest(delta_web, 0),
    recording_seconds = public.student_activity.recording_seconds + greatest(delta_rec, 0),
    sessions_watched = public.student_activity.sessions_watched + (case when increment_session then 1 else 0 end),
    last_active = now()
  returning * into result;
  return result;
end;
$$;

revoke execute on function public.increment_activity(integer, integer, boolean) from public;
grant execute on function public.increment_activity(integer, integer, boolean) to authenticated;
