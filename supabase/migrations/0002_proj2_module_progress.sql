-- PROJ-2: Modul-Framework & Fortschritts-Tracking
-- Tables: module_progress, module_progress_log
-- RPC:    toggle_check(check_id, done) – atomar, schreibt log

create table public.module_progress (
  club_id uuid not null references public.clubs(id) on delete cascade,
  check_id text not null,
  done boolean not null default false,
  done_at timestamptz,
  done_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (club_id, check_id)
);

create index idx_module_progress_club on public.module_progress(club_id);

alter table public.module_progress enable row level security;

create policy "module_progress_select_own_club"
  on public.module_progress for select
  using (club_id = public.current_club_id());

create policy "module_progress_upsert_own_club"
  on public.module_progress for insert
  to authenticated
  with check (club_id = public.current_club_id());

create policy "module_progress_update_own_club"
  on public.module_progress for update
  using (club_id = public.current_club_id())
  with check (club_id = public.current_club_id());

-- ---------- Audit log (append-only) ----------
create table public.module_progress_log (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs(id) on delete cascade,
  check_id text not null,
  done boolean not null,
  changed_by uuid references auth.users(id) on delete set null,
  changed_at timestamptz not null default now()
);

create index idx_module_progress_log_club_check
  on public.module_progress_log(club_id, check_id, changed_at desc);

alter table public.module_progress_log enable row level security;

create policy "module_progress_log_select_own_club"
  on public.module_progress_log for select
  using (club_id = public.current_club_id());

-- ---------- RPC: toggle_check (atomic upsert + log) ----------
create or replace function public.toggle_check(
  p_check_id text,
  p_done boolean
)
returns void
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

  select club_id into v_club
    from public.club_members
    where user_id = v_user;

  if v_club is null then
    raise exception 'Kein Verein zugeordnet';
  end if;

  if p_check_id is null or length(p_check_id) = 0 then
    raise exception 'check_id erforderlich';
  end if;

  insert into public.module_progress (club_id, check_id, done, done_at, done_by, updated_at)
  values (
    v_club,
    p_check_id,
    p_done,
    case when p_done then now() else null end,
    case when p_done then v_user else null end,
    now()
  )
  on conflict (club_id, check_id) do update
    set done = excluded.done,
        done_at = excluded.done_at,
        done_by = excluded.done_by,
        updated_at = now();

  insert into public.module_progress_log (club_id, check_id, done, changed_by)
  values (v_club, p_check_id, p_done, v_user);
end;
$$;
