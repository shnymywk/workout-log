create table public.exercise_body_parts (
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  body_part_id uuid not null references public.body_parts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  created_at timestamptz not null default now(),
  constraint exercise_body_parts_pkey primary key (exercise_id, body_part_id),
  constraint exercise_body_parts_exercise_body_part_unique unique (exercise_id, body_part_id)
);

create index exercise_body_parts_user_id_idx on public.exercise_body_parts(user_id);
create index exercise_body_parts_body_part_id_idx on public.exercise_body_parts(body_part_id);

insert into public.exercise_body_parts (exercise_id, body_part_id, user_id, created_at)
select id, body_part_id, user_id, created_at
from public.exercises
where body_part_id is not null
on conflict (exercise_id, body_part_id) do nothing;

alter table public.exercise_body_parts enable row level security;

create policy "exercise_body_parts_owner_access"
  on public.exercise_body_parts
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create or replace function public.assert_exercise_body_part_link_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.exercises
    where id = new.exercise_id
      and user_id = new.user_id
  ) then
    raise exception 'exercise_id must belong to the same user';
  end if;

  if not exists (
    select 1
    from public.body_parts
    where id = new.body_part_id
      and user_id = new.user_id
  ) then
    raise exception 'body_part_id must belong to the same user';
  end if;

  return new;
end;
$$;

create trigger exercise_body_parts_owner_check
  before insert or update of user_id, exercise_id, body_part_id
  on public.exercise_body_parts
  for each row
  execute function public.assert_exercise_body_part_link_owner();
