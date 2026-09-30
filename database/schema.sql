create table if not exists public.client_profiles (
  id uuid primary key default gen_random_uuid(),
  client_id text not null unique,
  first_name text,
  onboarding jsonb not null default '{}'::jsonb,
  insights jsonb not null default '{}'::jsonb,
  plan_summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_events (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists client_events_client_id_created_at_idx
  on public.client_events (client_id, created_at desc);

alter table public.client_profiles enable row level security;
alter table public.client_events enable row level security;

-- No public policies are added here.
-- The app writes through Next.js API routes using the server-only Supabase service role key.
