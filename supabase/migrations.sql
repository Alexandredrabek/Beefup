-- ============================================================
-- beefup database schema
-- Run this in your Supabase SQL editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- plans
-- ─────────────────────────────────────────
create table if not exists public.plans (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  goal          text not null,
  split         text not null,
  diet          text[] not null default '{}',
  meals_per_day integer not null default 3,
  days          jsonb not null default '[]',
  is_public     boolean not null default false,
  share_uuid    uuid not null default uuid_generate_v4(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index for fast user lookups
create index if not exists plans_user_id_idx on public.plans(user_id);
-- Index for share link lookups
create index if not exists plans_share_uuid_idx on public.plans(share_uuid);

-- Row-level security
alter table public.plans enable row level security;

-- Users can read their own plans
create policy "Users read own plans"
  on public.plans for select
  using (auth.uid() = user_id);

-- Anyone can read public plans (for share links)
create policy "Anyone reads public plans"
  on public.plans for select
  using (is_public = true);

-- Users can insert their own plans
create policy "Users insert own plans"
  on public.plans for insert
  with check (auth.uid() = user_id);

-- Users can update their own plans
create policy "Users update own plans"
  on public.plans for update
  using (auth.uid() = user_id);

-- Users can delete their own plans
create policy "Users delete own plans"
  on public.plans for delete
  using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger plans_updated_at
  before update on public.plans
  for each row execute function public.handle_updated_at();


-- ─────────────────────────────────────────
-- progress_logs
-- ─────────────────────────────────────────
create table if not exists public.progress_logs (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  plan_id             uuid references public.plans(id) on delete set null,
  week                integer not null check (week >= 1 and week <= 52),
  weight_kg           numeric(5,2),
  notes               text,
  workouts_completed  integer not null default 0 check (workouts_completed >= 0 and workouts_completed <= 7),
  created_at          timestamptz not null default now()
);

create index if not exists progress_logs_user_id_idx on public.progress_logs(user_id);
create index if not exists progress_logs_plan_id_idx on public.progress_logs(plan_id);

alter table public.progress_logs enable row level security;

create policy "Users read own logs"
  on public.progress_logs for select
  using (auth.uid() = user_id);

create policy "Users insert own logs"
  on public.progress_logs for insert
  with check (auth.uid() = user_id);

create policy "Users delete own logs"
  on public.progress_logs for delete
  using (auth.uid() = user_id);
