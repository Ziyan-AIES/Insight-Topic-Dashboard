-- Quick-start schema for a shared editable monthly insights dashboard

create extension if not exists "pgcrypto";

create table if not exists public.monthly_topics (
  id uuid primary key default gen_random_uuid(),
  month_label text not null,
  month_order int not null,
  topic_title text not null,
  category text not null check (category in (
    'interaction',
    'ai_software',
    'ai_hardware',
    'ecosystem',
    'ai_capability',
    'industry_events'
  )),
  notes text not null default '',
  updated_by text not null default '',
  updated_at timestamptz not null default now()
);

create index if not exists idx_monthly_topics_month_order
  on public.monthly_topics(month_order asc, updated_at asc);

create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_monthly_topics_touch_updated_at on public.monthly_topics;
create trigger trg_monthly_topics_touch_updated_at
before update on public.monthly_topics
for each row execute function public.touch_updated_at();

alter table public.monthly_topics replica identity full;
alter publication supabase_realtime add table public.monthly_topics;

-- Quick MVP mode: open read/write (no auth required).
-- For production, switch to RLS with authenticated policies.
alter table public.monthly_topics disable row level security;
