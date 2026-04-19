-- ============================================================
-- Cat Health Tracker — Supabase schema
-- Run this in your Supabase project: SQL Editor → New query
-- ============================================================

-- cats
create table if not exists cats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  birthday date not null,
  initial_weight numeric not null,
  weight_unit text not null check (weight_unit in ('kg', 'lbs')),
  profile_picture text,
  created_at timestamptz default now() not null
);

-- weight_logs
create table if not exists weight_logs (
  id uuid primary key default gen_random_uuid(),
  cat_id uuid references cats(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  weight numeric not null,
  unit text not null check (unit in ('kg', 'lbs')),
  date date not null,
  notes text,
  created_at timestamptz default now() not null
);

-- nutrition_logs
create table if not exists nutrition_logs (
  id uuid primary key default gen_random_uuid(),
  cat_id uuid references cats(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  food_type text not null check (food_type in ('dry', 'wet', 'raw', 'mixed')),
  brand text,
  daily_amount numeric,
  frequency text,
  notes text,
  date date not null,
  created_at timestamptz default now() not null
);

-- medical_records
create table if not exists medical_records (
  id uuid primary key default gen_random_uuid(),
  cat_id uuid references cats(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('vet_visit', 'vaccination')),
  vet_name text,
  clinic text,
  notes text,
  date date not null,
  next_due_date date,
  created_at timestamptz default now() not null
);

-- incidents
create table if not exists incidents (
  id uuid primary key default gen_random_uuid(),
  cat_id uuid references cats(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  type text not null check (type in ('vomiting', 'symptom', 'illness')),
  description text not null,
  severity text not null check (severity in ('low', 'medium', 'high')),
  date date not null,
  created_at timestamptz default now() not null
);

-- breathing_logs
create table if not exists breathing_logs (
  id uuid primary key default gen_random_uuid(),
  cat_id uuid references cats(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  breaths_per_minute integer not null check (breaths_per_minute > 0),
  date date not null,
  notes text,
  created_at timestamptz default now() not null
);

-- ============================================================
-- Row Level Security
-- Each user can only access their own rows
-- ============================================================

alter table cats enable row level security;
alter table weight_logs enable row level security;
alter table nutrition_logs enable row level security;
alter table medical_records enable row level security;
alter table incidents enable row level security;
alter table breathing_logs enable row level security;

-- cats policies
create policy "users manage own cats"
  on cats for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- weight_logs policies
create policy "users manage own weight logs"
  on weight_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- nutrition_logs policies
create policy "users manage own nutrition logs"
  on nutrition_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- medical_records policies
create policy "users manage own medical records"
  on medical_records for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- breathing_logs policies
create policy "users manage own breathing logs"
  on breathing_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Storage bucket for cat profile pictures
-- ============================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Allow authenticated users to upload their own files
create policy "authenticated users upload avatars"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Allow authenticated users to update/delete their own files
create policy "authenticated users manage own avatars"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[2]);

-- Allow public read access to all avatars
create policy "public read avatars"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

-- ============================================================
-- Migration: vet visit title + status
-- Run this against an existing database to add the new columns
-- ============================================================

alter table medical_records
  add column if not exists title text,
  add column if not exists status text
    check (status in ('upcoming', 'completed', 'cancelled'))
    default 'completed';

-- ============================================================
-- medication_logs
-- ============================================================

create table if not exists medication_logs (
  id uuid primary key default gen_random_uuid(),
  cat_id uuid references cats(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  dose text not null,
  start_date date not null,
  end_date date,
  notes text,
  created_at timestamptz default now() not null
);

alter table medication_logs enable row level security;

create policy "users manage own medication logs"
  on medication_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
