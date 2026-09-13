-- Admin replies on board posts (run in Supabase SQL Editor)

create table if not exists public.post_replies (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts(id) on delete cascade,
  content     text not null check (char_length(content) >= 1),
  is_admin    boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists post_replies_post_id_idx on public.post_replies (post_id);
create index if not exists post_replies_created_at_idx on public.post_replies (created_at asc);

alter table public.post_replies enable row level security;

drop policy if exists "Authenticated users can read replies" on public.post_replies;
create policy "Authenticated users can read replies"
  on public.post_replies for select
  to authenticated
  using (true);

-- Inserts/updates/deletes: admin app only (service role bypasses RLS)
