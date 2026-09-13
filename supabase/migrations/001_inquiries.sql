-- VELLUNE inquiries table
-- Run in Supabase Dashboard → SQL Editor

create table if not exists public.inquiries (
  id            uuid primary key default gen_random_uuid(),
  display_id    text unique not null,
  created_at    timestamptz not null default now(),
  type          text not null,
  company       text default '',
  name          text not null,
  email         text not null,
  phone         text default '',
  message       text not null,
  privacy       boolean not null default true,
  status        text not null default 'NEW'
                check (status in ('NEW', 'CHECKED', 'REPLIED', 'COMPLETED')),
  notes         text default ''
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_display_id_idx on public.inquiries (display_id);

create sequence if not exists public.inquiry_seq start 1;

create or replace function public.generate_display_id()
returns trigger
language plpgsql
as $$
begin
  if new.display_id is null or new.display_id = '' then
    new.display_id := 'VL-' || lpad(nextval('public.inquiry_seq')::text, 3, '0');
  end if;
  return new;
end;
$$;

drop trigger if exists set_display_id on public.inquiries;

create trigger set_display_id
  before insert on public.inquiries
  for each row
  execute function public.generate_display_id();

alter table public.inquiries enable row level security;
