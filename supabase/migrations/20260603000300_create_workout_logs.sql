create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  exercise_id uuid not null references public.exercises(id) on delete cascade,
  trained_at date not null,
  weight numeric(6, 2) not null,
  sets integer not null,
  reps integer not null,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workout_logs_weight_positive check (weight > 0),
  constraint workout_logs_sets_positive check (sets > 0),
  constraint workout_logs_reps_positive check (reps > 0)
);

create index workout_logs_user_trained_at_idx on public.workout_logs(user_id, trained_at desc);
create index workout_logs_exercise_id_idx on public.workout_logs(exercise_id);
