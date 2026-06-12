create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('owner', 'admin', 'member');
  end if;

  if not exists (select 1 from pg_type where typname = 'match_status') then
    create type public.match_status as enum ('scheduled', 'live', 'completed');
  end if;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  bio text,
  favorite_team text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table if exists public.profiles
  add column if not exists username text,
  add column if not exists bio text,
  add column if not exists favorite_team text;

create unique index if not exists profiles_username_key
  on public.profiles(lower(username))
  where username is not null;

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) >= 3),
  invite_code text not null unique,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.league_members (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.user_role not null default 'member',
  joined_at timestamptz not null default now(),
  unique (league_id, user_id)
);

create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  match_number integer unique,
  tournament text not null,
  stage text not null,
  group_name text,
  team_a text not null,
  team_b text not null,
  kickoff_time timestamptz not null,
  venue text,
  team_a_score integer check (team_a_score >= 0),
  team_b_score integer check (team_b_score >= 0),
  status public.match_status not null default 'scheduled',
  created_at timestamptz not null default now(),
  unique (team_a, team_b, kickoff_time)
);

alter table if exists public.matches
  add column if not exists match_number integer;

create unique index if not exists matches_match_number_key
  on public.matches(match_number)
  where match_number is not null;

create unique index if not exists matches_match_number_unique
  on public.matches(match_number);

create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  pred_team_a_score integer not null check (pred_team_a_score >= 0),
  pred_team_b_score integer not null check (pred_team_b_score >= 0),
  stake_text text check (stake_text is null or char_length(stake_text) <= 80),
  points_awarded integer check (points_awarded between 0 and 5),
  submitted_at timestamptz not null default now(),
  unique (league_id, match_id, user_id)
);

create table if not exists public.stake_settlements (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues(id) on delete cascade,
  match_id uuid not null references public.matches(id) on delete cascade,
  owed_by uuid not null references public.profiles(id) on delete cascade,
  owed_to uuid not null references public.profiles(id) on delete cascade,
  stake_text text not null,
  settled boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.is_league_member(target_league_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.league_members
    where league_id = target_league_id
      and user_id = target_user_id
  );
$$;

create or replace function public.is_league_admin(target_league_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.league_members
    where league_id = target_league_id
      and user_id = target_user_id
      and role in ('owner', 'admin')
  );
$$;

create or replace function public.is_any_league_admin(target_user_id uuid default auth.uid())
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.league_members
    where user_id = target_user_id
      and role in ('owner', 'admin')
  );
$$;

create or replace function public.join_league_by_invite(invite_code_input text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_league_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select id
  into target_league_id
  from public.leagues
  where invite_code = upper(trim(invite_code_input));

  if target_league_id is null then
    raise exception 'Invite code not found';
  end if;

  insert into public.league_members (league_id, user_id, role)
  values (target_league_id, auth.uid(), 'member')
  on conflict (league_id, user_id) do nothing;

  return target_league_id;
end;
$$;

create or replace function public.create_league_for_current_user(league_name text, invite_code_input text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  created_league_id uuid;
  clean_name text := trim(league_name);
  clean_invite_code text := upper(trim(invite_code_input));
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if clean_name is null or char_length(clean_name) < 3 then
    raise exception 'League name must be at least 3 characters.';
  end if;

  if clean_invite_code is null or char_length(clean_invite_code) < 4 then
    raise exception 'Invite code must be at least 4 characters.';
  end if;

  insert into public.profiles (id)
  values (auth.uid())
  on conflict (id) do nothing;

  insert into public.leagues (name, invite_code, created_by)
  values (clean_name, clean_invite_code, auth.uid())
  returning id into created_league_id;

  insert into public.league_members (league_id, user_id, role)
  values (created_league_id, auth.uid(), 'owner')
  on conflict (league_id, user_id) do update
  set role = 'owner';

  return created_league_id;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
  set full_name = excluded.full_name,
      avatar_url = excluded.avatar_url;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.leagues enable row level security;
alter table public.league_members enable row level security;
alter table public.matches enable row level security;
alter table public.predictions enable row level security;
alter table public.stake_settlements enable row level security;

drop policy if exists "profiles are visible to authenticated users" on public.profiles;
create policy "profiles are visible to authenticated users"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "users can insert their own profile" on public.profiles;
create policy "users can insert their own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "members can see their leagues" on public.leagues;
create policy "members can see their leagues"
on public.leagues for select
to authenticated
using (public.is_league_member(id));

drop policy if exists "authenticated users can create leagues" on public.leagues;
create policy "authenticated users can create leagues"
on public.leagues for insert
to authenticated
with check (created_by = auth.uid());

drop policy if exists "league admins can update leagues" on public.leagues;
create policy "league admins can update leagues"
on public.leagues for update
to authenticated
using (public.is_league_admin(id))
with check (public.is_league_admin(id));

drop policy if exists "members can see league members" on public.league_members;
create policy "members can see league members"
on public.league_members for select
to authenticated
using (public.is_league_member(league_id));

drop policy if exists "users can add themselves as owner on newly created leagues" on public.league_members;
create policy "users can add themselves as owner on newly created leagues"
on public.league_members for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "league admins can update member roles" on public.league_members;
create policy "league admins can update member roles"
on public.league_members for update
to authenticated
using (public.is_league_admin(league_id))
with check (public.is_league_admin(league_id));

drop policy if exists "authenticated users can view matches" on public.matches;
drop policy if exists "everyone can view matches" on public.matches;
create policy "everyone can view matches"
on public.matches for select
to anon, authenticated
using (true);

drop policy if exists "league admins can seed matches" on public.matches;
create policy "league admins can seed matches"
on public.matches for insert
to authenticated
with check (public.is_any_league_admin());

drop policy if exists "league admins can update match results" on public.matches;
create policy "league admins can update match results"
on public.matches for update
to authenticated
using (public.is_any_league_admin())
with check (public.is_any_league_admin());

drop policy if exists "members can see league predictions" on public.predictions;
create policy "members can see league predictions"
on public.predictions for select
to authenticated
using (public.is_league_member(league_id));

drop policy if exists "users can predict before kickoff" on public.predictions;
create policy "users can predict before kickoff"
on public.predictions for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.is_league_member(league_id)
  and exists (
    select 1
    from public.matches
    where matches.id = match_id
      and matches.status = 'scheduled'
      and matches.kickoff_time > now()
  )
);

drop policy if exists "users can update own prediction before kickoff" on public.predictions;
create policy "users can update own prediction before kickoff"
on public.predictions for update
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1
    from public.matches
    where matches.id = match_id
      and matches.status = 'scheduled'
      and matches.kickoff_time > now()
  )
)
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.matches
    where matches.id = match_id
      and matches.status = 'scheduled'
      and matches.kickoff_time > now()
  )
);

drop policy if exists "league admins can score predictions" on public.predictions;
create policy "league admins can score predictions"
on public.predictions for update
to authenticated
using (public.is_league_admin(league_id))
with check (public.is_league_admin(league_id));

drop policy if exists "members can see settlements" on public.stake_settlements;
create policy "members can see settlements"
on public.stake_settlements for select
to authenticated
using (public.is_league_member(league_id));

drop policy if exists "league admins can insert settlements" on public.stake_settlements;
create policy "league admins can insert settlements"
on public.stake_settlements for insert
to authenticated
with check (public.is_league_admin(league_id));

drop policy if exists "league admins can update settlements" on public.stake_settlements;
create policy "league admins can update settlements"
on public.stake_settlements for update
to authenticated
using (public.is_league_admin(league_id))
with check (public.is_league_admin(league_id));

drop policy if exists "league admins can delete settlements" on public.stake_settlements;
create policy "league admins can delete settlements"
on public.stake_settlements for delete
to authenticated
using (public.is_league_admin(league_id));

grant execute on function public.join_league_by_invite(text) to authenticated;
grant execute on function public.create_league_for_current_user(text, text) to authenticated;
