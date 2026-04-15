-- PROJ-1: Auth & Vereinsprofil
-- Tables: profiles, federations, clubs, club_members, federation_admins, invitations

create extension if not exists "pgcrypto";

-- ---------- profiles ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role_label text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile on auth signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- federations ----------
create table public.federations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text,
  slug text unique not null,
  contact_email text,
  created_at timestamptz not null default now()
);

alter table public.federations enable row level security;

create policy "federations_select_all_authenticated"
  on public.federations for select
  to authenticated
  using (true);

-- ---------- clubs ----------
create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  postal_code text,
  sports text[] not null default '{}',
  federation_id uuid references public.federations(id) on delete set null,
  created_by uuid not null references auth.users(id),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_clubs_federation on public.clubs(federation_id);
create index idx_clubs_deleted_at on public.clubs(deleted_at);

alter table public.clubs enable row level security;

-- ---------- club_members ----------
create table public.club_members (
  user_id uuid not null references auth.users(id) on delete cascade,
  club_id uuid not null references public.clubs(id) on delete cascade,
  role text not null check (role in ('admin','member')),
  joined_at timestamptz not null default now(),
  primary key (user_id)
);

create index idx_club_members_club on public.club_members(club_id);

alter table public.club_members enable row level security;

-- Helper: check membership without recursion
create or replace function public.is_club_member(target_club uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.club_members
    where user_id = auth.uid() and club_id = target_club
  );
$$;

create or replace function public.is_club_admin(target_club uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.club_members
    where user_id = auth.uid() and club_id = target_club and role = 'admin'
  );
$$;

create or replace function public.current_club_id()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select club_id from public.club_members where user_id = auth.uid();
$$;

-- club_members policies
create policy "club_members_select_same_club"
  on public.club_members for select
  using (club_id = public.current_club_id());

-- clubs policies
create policy "clubs_select_own"
  on public.clubs for select
  using (id = public.current_club_id() and deleted_at is null);

create policy "clubs_insert_authenticated"
  on public.clubs for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "clubs_update_admin"
  on public.clubs for update
  using (public.is_club_admin(id))
  with check (public.is_club_admin(id));

-- ---------- federation_admins ----------
create table public.federation_admins (
  user_id uuid not null references auth.users(id) on delete cascade,
  federation_id uuid not null references public.federations(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, federation_id)
);

alter table public.federation_admins enable row level security;

create policy "federation_admins_select_own"
  on public.federation_admins for select
  using (user_id = auth.uid());

create or replace function public.is_federation_admin(target_fed uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.federation_admins
    where user_id = auth.uid() and federation_id = target_fed
  );
$$;

-- ---------- invitations ----------
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  club_id uuid not null references public.clubs(id) on delete cascade,
  role text not null check (role in ('admin','member')),
  created_by uuid not null references auth.users(id),
  expires_at timestamptz not null,
  used_at timestamptz,
  used_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index idx_invitations_club on public.invitations(club_id);
create index idx_invitations_token on public.invitations(token);

alter table public.invitations enable row level security;

create policy "invitations_select_admin"
  on public.invitations for select
  using (public.is_club_admin(club_id));

create policy "invitations_insert_admin"
  on public.invitations for insert
  to authenticated
  with check (public.is_club_admin(club_id) and created_by = auth.uid());

-- ---------- Protect: at least one admin per club ----------
create or replace function public.prevent_last_admin_removal()
returns trigger
language plpgsql
as $$
declare
  remaining_admins int;
begin
  if (tg_op = 'DELETE' and old.role = 'admin')
     or (tg_op = 'UPDATE' and old.role = 'admin' and new.role <> 'admin') then
    select count(*) into remaining_admins
      from public.club_members
      where club_id = old.club_id and role = 'admin' and user_id <> old.user_id;
    if remaining_admins = 0 then
      raise exception 'Letzter Admin kann nicht entfernt werden';
    end if;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger trg_prevent_last_admin
  before update or delete on public.club_members
  for each row execute function public.prevent_last_admin_removal();

-- ---------- RPC: create club + admin membership atomically ----------
create or replace function public.create_club_with_admin(
  p_name text,
  p_postal_code text,
  p_sports text[],
  p_federation_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_club uuid;
begin
  if v_user is null then
    raise exception 'Nicht angemeldet';
  end if;

  if exists (select 1 from public.club_members where user_id = v_user) then
    raise exception 'Bereits Mitglied eines Vereins';
  end if;

  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'Vereinsname erforderlich';
  end if;

  insert into public.clubs (name, postal_code, sports, federation_id, created_by)
  values (trim(p_name), p_postal_code, coalesce(p_sports, '{}'), p_federation_id, v_user)
  returning id into v_club;

  insert into public.club_members (user_id, club_id, role)
  values (v_user, v_club, 'admin');

  return v_club;
end;
$$;

-- ---------- RPC: redeem invitation atomically ----------
create or replace function public.redeem_invitation(p_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_inv public.invitations%rowtype;
begin
  if v_user is null then
    raise exception 'Nicht angemeldet';
  end if;

  if exists (select 1 from public.club_members where user_id = v_user) then
    raise exception 'Bereits Mitglied eines Vereins';
  end if;

  select * into v_inv from public.invitations where token = p_token for update;

  if not found then
    raise exception 'Einladung nicht gefunden';
  end if;

  if v_inv.used_at is not null then
    raise exception 'Einladung bereits eingelöst';
  end if;

  if v_inv.expires_at < now() then
    raise exception 'Einladung abgelaufen';
  end if;

  insert into public.club_members (user_id, club_id, role)
  values (v_user, v_inv.club_id, v_inv.role);

  update public.invitations
     set used_at = now(), used_by = v_user
   where id = v_inv.id;

  return v_inv.club_id;
end;
$$;
