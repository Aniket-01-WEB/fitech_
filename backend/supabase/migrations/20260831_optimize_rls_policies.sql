-- ============================================================================
-- RLS performance fix-up.
-- The advisor flagged two well-known Supabase RLS gotchas from the initial
-- schema:
--   1. auth_rls_initplan — auth.uid() was being re-evaluated per row instead
--      of once per query. Fix: wrap in (select auth.uid()), and centralize
--      the "is this user staff" check in a STABLE SECURITY DEFINER function
--      so it isn't repeated inline (and doesn't recurse through RLS).
--   2. multiple_permissive_policies — "own row" and "staff" were two separate
--      permissive SELECT policies per table, so Postgres ran both on every
--      query. Fix: merge each pair into a single policy with OR.
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
