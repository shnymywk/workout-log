create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  target_weight numeric(6, 2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goals_target_weight_positive check (target_weight > 0),
  constraint goals_user_exercise_unique unique (user_id, exercise_id)
);

create index goals_user_id_idx on public.goals(user_id);
create index goals_exercise_id_idx on public.goals(exercise_id);
