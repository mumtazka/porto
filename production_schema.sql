-- production_schema.sql

-- 1. Projects Table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  image_url text not null,
  tech_stack text[] default '{}',
  project_url text,
  github_url text,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Education Table
create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  field text not null,
  start_date text not null,
  end_date text not null,
  certificate_image text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Achievements Table
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  date text not null,
  description text,
  credential_url text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Messages Table
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Personal Context Table (for AI Brain)
create table if not exists public.personal_context (
  id bigint primary key generated always as identity,
  name text,
  role text,
  location text,
  bio text,
  email text,
  phone text,
  linkedin text,
  github text,
  instagram text,
  availability text,
  years_of_experience text,
  skills text,
  interests text,
  languages text,
  extra_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Chat Sessions Table (for AI chat history)
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_name text,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Note: To allow proper CRUD from your Admin panel as an Anonymous/Authenticated User, you will need to enable RLS and set policies below, or temporarily disable RLS for testing.

-- Disable RLS temporarily to allow unrestricted CRUD for all tables (Or write proper Authenticated policies)
alter table public.projects disable row level security;
alter table public.education disable row level security;
alter table public.achievements disable row level security;
alter table public.messages disable row level security;
alter table public.personal_context disable row level security;
alter table public.chat_sessions disable row level security;
