create table public.workout_log_sets (
  id uuid primary key default gen_random_uuid(),
  workout_log_id uuid not null references public.workout_logs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  set_number integer not null,
  weight numeric(6, 2) not null,
  reps integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workout_log_sets_set_number_positive check (set_number > 0),
  constraint workout_log_sets_weight_positive check (weight > 0),
  constraint workout_log_sets_reps_positive check (reps > 0),
  constraint workout_log_sets_workout_log_set_number_key unique (workout_log_id, set_number)
);

create index workout_log_sets_workout_log_id_idx on public.workout_log_sets(workout_log_id);
create index workout_log_sets_user_workout_log_idx on public.workout_log_sets(user_id, workout_log_id);

insert into public.workout_log_sets (
  workout_log_id,
  user_id,
  set_number,
  weight,
  reps,
  created_at,
  updated_at
)
select
  workout_logs.id,
  workout_logs.user_id,
  generated_sets.set_number,
  workout_logs.weight,
  workout_logs.reps,
  workout_logs.created_at,
  workout_logs.updated_at
from public.workout_logs
cross join lateral generate_series(1, workout_logs.sets) as generated_sets(set_number);

alter table public.workout_log_sets enable row level security;

create policy "workout_log_sets_owner_access"
  on public.workout_log_sets
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create or replace function public.assert_workout_log_set_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.workout_logs
    where id = new.workout_log_id
      and user_id = new.user_id
  ) then
    raise exception 'workout_log_id must belong to the same user';
  end if;

  return new;
end;
$$;

create trigger workout_log_sets_owner_check
  before insert or update of user_id, workout_log_id
  on public.workout_log_sets
  for each row
  execute function public.assert_workout_log_set_owner();
