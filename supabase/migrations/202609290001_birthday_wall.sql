create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 60),
  message text not null check (char_length(btrim(message)) between 2 and 500),
  photo_path text check (
    photo_path is null or photo_path ~ '^messages/[0-9a-f-]{36}\.(jpg|png|webp)$'
  ),
  envelope_style text not null default 'sage'
    check (envelope_style in ('sage', 'rose', 'butter', 'blue', 'clay')),
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists messages_approved_created_at_idx
  on public.messages (created_at desc)
  where approved = true;

create index if not exists messages_approved_photos_idx
  on public.messages (created_at desc)
  where approved = true and photo_path is not null;

alter table public.messages enable row level security;

revoke all on public.messages from anon, authenticated;
grant select on public.messages to anon, authenticated;

drop policy if exists "Anyone can read approved birthday messages" on public.messages;
create policy "Anyone can read approved birthday messages"
  on public.messages for select
  to anon, authenticated
  using (approved = true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('birthday', 'birthday', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can view birthday photos" on storage.objects;
create policy "Anyone can view birthday photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'birthday');

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end
$$;