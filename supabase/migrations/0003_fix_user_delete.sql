-- Fix: User-Löschung über Supabase Dashboard scheiterte an
--   1. clubs.created_by ist NOT NULL ohne ON DELETE
--   2. invitations.created_by ist NOT NULL ohne ON DELETE
--   3. Trigger prevent_last_admin_removal blockiert Cascade-Delete des letzten Admins,
--      auch wenn der Verein danach ohnehin leer wäre

-- 1. clubs.created_by → nullable + on delete set null
alter table public.clubs alter column created_by drop not null;
alter table public.clubs drop constraint if exists clubs_created_by_fkey;
alter table public.clubs
  add constraint clubs_created_by_fkey
  foreign key (created_by) references auth.users(id) on delete set null;

-- 2. invitations.created_by → nullable + on delete set null
alter table public.invitations alter column created_by drop not null;
alter table public.invitations drop constraint if exists invitations_created_by_fkey;
alter table public.invitations
  add constraint invitations_created_by_fkey
  foreign key (created_by) references auth.users(id) on delete set null;

-- 3. Trigger lockern: wenn nach dem Löschen ohnehin niemand mehr im Verein ist,
--    darf der letzte Admin entfernt werden (Verein bleibt verwaist und kann
--    später per Soft-Delete bereinigt werden).
create or replace function public.prevent_last_admin_removal()
returns trigger
language plpgsql
as $$
declare
  v_remaining_members int;
  v_remaining_admins int;
begin
  if (tg_op = 'DELETE' and old.role = 'admin')
     or (tg_op = 'UPDATE' and old.role = 'admin' and new.role <> 'admin') then

    select count(*) into v_remaining_members
      from public.club_members
      where club_id = old.club_id and user_id <> old.user_id;

    -- Verein wird komplett leer → erlaubt
    if v_remaining_members = 0 then
      return coalesce(new, old);
    end if;

    select count(*) into v_remaining_admins
      from public.club_members
      where club_id = old.club_id and role = 'admin' and user_id <> old.user_id;

    if v_remaining_admins = 0 then
      raise exception 'Letzter Admin kann nicht entfernt werden';
    end if;
  end if;
  return coalesce(new, old);
end;
$$;
