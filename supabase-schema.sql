-- TRUELOVE Platform V1
-- Run this in Supabase SQL Editor in Phase 2.

create extension if not exists "pgcrypto";

create table if not exists templates (
  id text primary key,
  name text not null,
  slug text unique not null,
  category text not null,
  description text,
  preview_image text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists packages (
  id text primary key,
  name text not null,
  slug text unique not null,
  price integer not null,
  allow_text boolean default false,
  allow_music boolean default false,
  allow_custom_theme boolean default false,
  allow_custom_layout boolean default false,
  description text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists websites (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  template_id text references templates(id),
  package_id text references packages(id),
  sender_name text not null,
  receiver_name text not null,
  title text,
  message text,
  event_date date,
  music_url text,
  content jsonb default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft','preview','published','expired','archived')),
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz
);

create table if not exists website_media (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references websites(id) on delete cascade,
  type text not null check (type in ('image','video','audio')),
  url text not null,
  caption text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_whatsapp text not null,
  occasion text,
  template_id text references templates(id),
  package_id text references packages(id),
  website_id uuid references websites(id),
  price integer,
  payment_status text default 'unpaid',
  order_status text default 'new',
  notes text,
  created_at timestamptz default now()
);

create index if not exists websites_slug_idx on websites(slug);
create index if not exists websites_status_idx on websites(status);
create index if not exists website_media_website_id_idx on website_media(website_id);
