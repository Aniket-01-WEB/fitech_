-- ----------------------------------------------------------------------------
-- Security hardening pass.
--
-- 1) CRITICAL: prevent_self_role_escalation() checked `is_staff` (admin OR
--    superadmin) instead of specifically 'superadmin'. Combined with the
--    profiles_update_staff RLS policy (which gives ANY staff row-reach to
--    ANY profile), a plain admin could call
--      supabase.from('profiles').update({role:'superadmin'}).eq('id', self)
--    directly against the Supabase REST API (bypassing the Express backend
--    entirely, since RLS/triggers are the real enforcement layer) and the
--    trigger would let it through, because the caller IS staff. Restricting
--    this to superadmin-only closes that privilege-escalation path — the
--    only legitimate way to become admin stays the admin_requests approval
--    flow (already superadmin-gated), and superadmin is only ever granted
--    by the project owner via direct SQL.
--
-- 2) URL scheme validation at the database layer: notes.external_link and
--    recordings.video_url are staff-supplied but rendered as <a href>/
--    window.open targets for every student who views them. Express-layer
--    validation alone isn't sufficient — anyone with a valid staff access
--    token can call the Supabase REST API directly, bypassing the backend.
--    A CHECK constraint closes this for every access path, not just ours.
--
-- 3) increment_activity(): bound the per-call delta so a direct RPC call
--    can't inflate a student's tracked time arbitrarily (e.g.
--    {deltaWebSec: 999999999}). The UI only ever sends ~1 per tick, so a
--    generous 120s ceiling comfortably covers real usage/network jitter
--    while making the attack pointless.
-- ----------------------------------------------------------------------------

create or replace function public.prevent_self_role_escalation()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  if new.role <> old.role then
    if (select auth.uid()) is not null and not exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'superadmin'
    ) then
      raise exception 'Only a super admin can change a member role.';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

alter table public.notes drop constraint if exists notes_external_link_scheme;
alter table public.notes add constraint notes_external_link_scheme
  check (external_link is null or external_link ~ '^https?://');

alter table public.recordings drop constraint if exists recordings_video_url_scheme;
alter table public.recordings add constraint recordings_video_url_scheme
  check (video_url is null or video_url ~ '^https?://');

create or replace function public.increment_activity(delta_web integer default 0, delta_rec integer default 0, increment_session boolean default false)
returns student_activity
language plpgsql
set search_path to 'public'
as $$
declare
  result public.student_activity;
  safe_web integer := least(greatest(delta_web, 0), 120);
  safe_rec integer := least(greatest(delta_rec, 0), 120);
begin
  insert into public.student_activity (user_id, total_seconds, website_seconds, recording_seconds, sessions_watched, last_active)
  values (
    (select auth.uid()),
    safe_web + safe_rec,
    safe_web,
    safe_rec,
    case when increment_session then 1 else 0 end,
    now()
  )
  on conflict (user_id) do update set
    total_seconds = public.student_activity.total_seconds + safe_web + safe_rec,
    website_seconds = public.student_activity.website_seconds + safe_web,
    recording_seconds = public.student_activity.recording_seconds + safe_rec,
    sessions_watched = public.student_activity.sessions_watched + (case when increment_session then 1 else 0 end),
    last_active = now()
  returning * into result;
  return result;
end;
$$;
