-- ============================================================================
-- MATRIX FinTech Club — core schema
-- profiles, events (with Super Admin approval workflow), event_registrations,
-- recordings, notes, student_activity.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. profiles — one row per auth.users, carries role + academic details
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'student' check (role in ('student', 'admin', 'superadmin')),
  name text,
  reg_number text,
  roll_number text,
  school text,
  department text,
  section text,
  current_year text,
  contact_number text,
  interested_domain text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_role_idx on public.profiles (role);

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (id = auth.uid());

create policy "profiles_select_staff" on public.profiles
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Auto-provision a profile row whenever someone signs up via Supabase Auth.
-- Role always starts as 'student' — admin/superadmin is granted manually,
-- never through self-service signup.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- A member can edit their own profile, but cannot promote themselves —
-- only an existing admin/superadmin request can change a role.
create function public.prevent_self_role_escalation()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.role <> old.role then
    if not exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    ) then
      raise exception 'Only an admin or super admin can change a member role.';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_guard_role
  before update on public.profiles
  for each row execute function public.prevent_self_role_escalation();


-- ----------------------------------------------------------------------------
-- 2. events — Admin-created, Super-Admin-approved before students see them
-- ----------------------------------------------------------------------------
create table public.events (
  id bigint generated always as identity primary key,
  title text not null,
  type text not null default 'Event',
  banner text,
  event_time timestamptz,
  event_time_label text, -- freeform display string, e.g. "Mar 15, 2026 • 10:00 AM"
  venue text,
  description text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_by uuid references public.profiles (id) on delete set null,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index events_created_by_idx on public.events (created_by);
create index events_reviewed_by_idx on public.events (reviewed_by);
create index events_status_idx on public.events (status);

alter table public.events enable row level security;
alter table public.events force row level security;

-- Public marketing pages (and logged-out visitors) can only ever see approved events.
create policy "events_select_public_approved" on public.events
  for select to anon, authenticated
  using (status = 'approved');

-- Admin/Super Admin can see everything, including pending/rejected requests.
create policy "events_select_staff_all" on public.events
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

create policy "events_insert_admin" on public.events
  for insert to authenticated
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

create policy "events_update_staff" on public.events
  for update to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

create policy "events_delete_staff" on public.events
  for delete to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

-- Every new event is force-set to 'pending' with the real creator stamped,
-- no matter what the client sends — this is what makes the approval
-- workflow tamper-proof rather than just a UI convention.
create function public.events_before_insert()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  new.created_by := auth.uid();
  new.status := 'pending';
  new.reviewed_by := null;
  new.reviewed_at := null;
  return new;
end;
$$;

create trigger events_force_pending
  before insert on public.events
  for each row execute function public.events_before_insert();

-- Only a super admin may flip an event's approval status; doing so stamps
-- who reviewed it and when.
create function public.events_guard_status_change()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.status <> old.status then
    if not exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'superadmin'
    ) then
      raise exception 'Only a super admin can approve or reject an event.';
    end if;
    new.reviewed_by := auth.uid();
    new.reviewed_at := now();
  end if;
  return new;
end;
$$;

create trigger events_guard_status
  before update on public.events
  for each row execute function public.events_guard_status_change();


-- ----------------------------------------------------------------------------
-- 3. event_registrations — a student joining an approved event
-- ----------------------------------------------------------------------------
create table public.event_registrations (
  id bigint generated always as identity primary key,
  event_id bigint not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  registered_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create index event_registrations_event_id_idx on public.event_registrations (event_id);
create index event_registrations_user_id_idx on public.event_registrations (user_id);

alter table public.event_registrations enable row level security;
alter table public.event_registrations force row level security;

create policy "registrations_select_own" on public.event_registrations
  for select to authenticated
  using (user_id = auth.uid());

create policy "registrations_select_staff" on public.event_registrations
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

-- A student may only register themselves, and only for an already-approved event.
create policy "registrations_insert_own_approved_event" on public.event_registrations
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.events e where e.id = event_id and e.status = 'approved')
  );

create policy "registrations_delete_own" on public.event_registrations
  for delete to authenticated
  using (user_id = auth.uid());


-- ----------------------------------------------------------------------------
-- 4. recordings — masterclass recording library
-- ----------------------------------------------------------------------------
create table public.recordings (
  id bigint generated always as identity primary key,
  title text not null,
  type text not null default 'Algo Workshop',
  speaker text,
  banner text,
  recording_date text,
  duration_label text,
  duration_seconds integer,
  video_url text,
  description text,
  takeaways text[] not null default '{}',
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index recordings_created_by_idx on public.recordings (created_by);

alter table public.recordings enable row level security;
alter table public.recordings force row level security;

create policy "recordings_select_authenticated" on public.recordings
  for select to authenticated
  using (true);

create policy "recordings_write_staff" on public.recordings
  for all to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );


-- ----------------------------------------------------------------------------
-- 5. notes — study material students can read, admins upload
-- ----------------------------------------------------------------------------
create table public.notes (
  id bigint generated always as identity primary key,
  title text not null,
  domain text,
  description text,
  file_url text,
  external_link text,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint notes_has_source check (file_url is not null or external_link is not null)
);

create index notes_uploaded_by_idx on public.notes (uploaded_by);

alter table public.notes enable row level security;
alter table public.notes force row level security;

create policy "notes_select_authenticated" on public.notes
  for select to authenticated
  using (true);

create policy "notes_write_staff" on public.notes
  for all to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );


-- ----------------------------------------------------------------------------
-- 6. student_activity — per-student portal/watch-time tracking
-- ----------------------------------------------------------------------------
create table public.student_activity (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  total_seconds integer not null default 0,
  website_seconds integer not null default 0,
  recording_seconds integer not null default 0,
  sessions_watched integer not null default 0,
  last_active timestamptz not null default now()
);

alter table public.student_activity enable row level security;
alter table public.student_activity force row level security;

create policy "activity_select_own" on public.student_activity
  for select to authenticated
  using (user_id = auth.uid());

create policy "activity_select_staff" on public.student_activity
  for select to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'superadmin')
    )
  );

create policy "activity_insert_own" on public.student_activity
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "activity_update_own" on public.student_activity
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
