-- ----------------------------------------------------------------------------
-- Membership approval: a new student signup starts 'pending' and only a
-- superadmin can approve/reject it — same shape as the existing events
-- approval workflow. Staff (admin/superadmin) accounts are provisioned by
-- SQL, not the public join form, so they're always treated as approved
-- regardless of this column (see is_member_approved() below).
-- ----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists membership_status text not null default 'pending'
    check (membership_status in ('pending', 'approved', 'rejected')),
  add column if not exists membership_reviewed_by uuid references public.profiles (id) on delete set null,
  add column if not exists membership_reviewed_at timestamptz;

-- Backfill every existing account so nobody already working gets locked
-- out by this new gate.
update public.profiles set membership_status = 'approved' where membership_status = 'pending';

create index if not exists profiles_membership_status_idx on public.profiles (membership_status);

-- True for staff always, or for a student whose membership is approved.
-- Used to gate event registration and reading recordings/notes — a
-- pending applicant can see their own profile (to know their status) but
-- can't otherwise use the portal yet.
create or replace function public.is_member_approved(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid
      and (p.role in ('admin', 'superadmin') or p.membership_status = 'approved')
  );
$$;

revoke execute on function public.is_member_approved(uuid) from public;
grant execute on function public.is_member_approved(uuid) to anon, authenticated;

-- Only a superadmin may change membership_status through the API (the
-- project owner running SQL directly, auth.uid() = null, is unaffected —
-- same pattern as prevent_self_role_escalation).
create or replace function public.guard_membership_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.membership_status <> old.membership_status then
    if (select auth.uid()) is not null and not exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'superadmin'
    ) then
      raise exception 'Only a super admin can approve or reject a membership application.';
    end if;
    if (select auth.uid()) is not null then
      new.membership_reviewed_by := (select auth.uid());
      new.membership_reviewed_at := now();
    end if;
  end if;
  return new;
end;
$$;

revoke execute on function public.guard_membership_status_change() from public, anon, authenticated;

create trigger profiles_guard_membership_status
  before update on public.profiles
  for each row execute function public.guard_membership_status_change();

-- ---- tighten existing policies: pending members can't use the portal yet ----

drop policy if exists "registrations_insert_own_approved_event" on public.event_registrations;

create policy "registrations_insert_own_approved_event" on public.event_registrations
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and public.is_member_approved((select auth.uid()))
    and exists (select 1 from public.events e where e.id = event_id and e.status = 'approved')
  );

drop policy if exists "recordings_select_authenticated" on public.recordings;

create policy "recordings_select_approved_members" on public.recordings
  for select to authenticated
  using (public.is_member_approved((select auth.uid())));

drop policy if exists "notes_select_authenticated" on public.notes;

create policy "notes_select_approved_members" on public.notes
  for select to authenticated
  using (public.is_member_approved((select auth.uid())));

-- ---- allow staff to actually update someone else's profile row ----
-- profiles_update_own only ever let someone edit their own row, so a
-- superadmin's approve/reject call would update zero rows (RLS filters it
-- out before the trigger even runs). The triggers above (and
-- prevent_self_role_escalation) are what actually restrict which sensitive
-- columns can change and by whom — this policy only grants row-level
-- reach, not column-level trust, matching the same pattern already used
-- for events/recordings/notes.
create policy "profiles_update_staff" on public.profiles
  for update to authenticated
  using (public.is_staff((select auth.uid())))
  with check (public.is_staff((select auth.uid())));
