create table public.body_parts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  created_at timestamptz not null default now(),
  constraint body_parts_name_not_blank check (length(btrim(name)) > 0),
  constraint body_parts_user_name_unique unique (user_id, name)
);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  body_part_id uuid references public.body_parts(id) on delete set null,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint exercises_name_not_blank check (length(btrim(name)) > 0),
  constraint exercises_user_name_unique unique (user_id, name)
);

create index exercises_user_id_idx on public.exercises(user_id);
create index exercises_body_part_id_idx on public.exercises(body_part_id);
