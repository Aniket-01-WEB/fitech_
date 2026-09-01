-- ----------------------------------------------------------------------------
-- Correction: membership approval was mis-scoped onto STUDENT signups.
-- Students go back to being immediately usable on signup, with no
-- superadmin gate. In its place: a self-service "request admin access"
-- flow — any signed-in member can apply, a superadmin approves/rejects,
-- and approval actually grants the admin role.
-- ----------------------------------------------------------------------------

-- ---- revert: students are immediately usable again, no approval gate ----
drop trigger if exists profiles_guard_membership_status on public.profiles;
drop function if exists public.guard_membership_status_change();
drop function if exists public.is_member_approved(uuid) cascade;
drop index if exists profiles_membership_status_idx;

alter table public.profiles
  drop column if exists membership_status,
  drop column if exists membership_reviewed_by,
  drop column if exists membership_reviewed_at;

drop policy if exists "registrations_insert_own_approved_event" on public.event_registrations;
create policy "registrations_insert_own_approved_event" on public.event_registrations
  for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (select 1 from public.events e where e.id = event_id and e.status = 'approved')
  );

drop policy if exists "recordings_select_approved_members" on public.recordings;
create policy "recordings_select_authenticated" on public.recordings
  for select to authenticated
  using (true);

drop policy if exists "notes_select_approved_members" on public.notes;
create policy "notes_select_authenticated" on public.notes
  for select to authenticated
  using (true);

-- ---- new: self-service admin access requests, superadmin-approved ----
create table public.admin_requests (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  requested_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  unique (user_id)
);

create index admin_requests_user_id_idx on public.admin_requests (user_id);
create index admin_requests_status_idx on public.admin_requests (status);

alter table public.admin_requests enable row level security;
alter table public.admin_requests force row level security;

create policy "admin_requests_select_own_or_staff" on public.admin_requests
  for select to authenticated
  using (user_id = (select auth.uid()) or public.is_staff((select auth.uid())));

create policy "admin_requests_insert_own" on public.admin_requests
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "admin_requests_update_owner_or_staff" on public.admin_requests
  for update to authenticated
  using (user_id = (select auth.uid()) or public.is_staff((select auth.uid())))
  with check (user_id = (select auth.uid()) or public.is_staff((select auth.uid())));

-- Only a superadmin may approve/reject; approving actually grants the
-- admin role (a nested update on profiles, still gated by
-- prevent_self_role_escalation since auth.uid() there is still the
-- approving superadmin). The request's own owner may resubmit a
-- rejected request back to pending, same resubmit pattern as events.
create function public.handle_admin_request_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status <> old.status then
    if (select auth.uid()) is null then
      null; -- direct SQL/service context — unrestricted, same as other guards
    elsif exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'superadmin') then
      new.reviewed_by := (select auth.uid());
      new.reviewed_at := now();
    elsif old.status = 'rejected' and new.status = 'pending' and old.user_id = (select auth.uid()) then
      new.reviewed_by := null;
      new.reviewed_at := null;
    else
      raise exception 'Only a super admin can approve or reject an admin access request.';
    end if;

    if new.status = 'approved' then
      update public.profiles set role = 'admin' where id = new.user_id;
    end if;
  end if;
  return new;
end;
$$;

revoke execute on function public.handle_admin_request_status_change() from public, anon, authenticated;

create trigger admin_requests_guard_status
  before update on public.admin_requests
  for each row execute function public.handle_admin_request_status_change();
