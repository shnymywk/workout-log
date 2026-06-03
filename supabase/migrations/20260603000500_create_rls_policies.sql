alter table public.profiles enable row level security;
alter table public.body_parts enable row level security;
alter table public.exercises enable row level security;
alter table public.workout_logs enable row level security;
alter table public.goals enable row level security;

create policy "profiles_owner_access"
  on public.profiles
  for all
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "body_parts_owner_access"
  on public.body_parts
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "exercises_owner_access"
  on public.exercises
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "workout_logs_owner_access"
  on public.workout_logs
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "goals_owner_access"
  on public.goals
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create or replace function public.assert_exercise_body_part_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.body_part_id is not null and not exists (
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

create trigger exercises_body_part_owner_check
  before insert or update of user_id, body_part_id
  on public.exercises
  for each row
  execute function public.assert_exercise_body_part_owner();

create or replace function public.assert_workout_log_exercise_owner()
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

  return new;
end;
$$;

create trigger workout_logs_exercise_owner_check
  before insert or update of user_id, exercise_id
  on public.workout_logs
  for each row
  execute function public.assert_workout_log_exercise_owner();

create or replace function public.assert_goal_exercise_owner()
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

  return new;
end;
$$;

create trigger goals_exercise_owner_check
  before insert or update of user_id, exercise_id
  on public.goals
  for each row
  execute function public.assert_goal_exercise_owner();
