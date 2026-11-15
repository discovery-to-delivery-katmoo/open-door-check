-- Profiles: one row per person
create table public.profiles (
  id uuid primary key references auth.users (id),
  display_name text check (char_length(display_name) <= 80)
);
alter table public.profiles enable row level security;

create policy "Read own profile" on public.profiles
  for select using ((select auth.uid()) = id);

create policy "Update own profile" on public.profiles
  for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Roles live in their own table that only the server can change
create table public.user_roles (
  user_id uuid primary key references auth.users (id),
  role text not null check (role in ('member', 'teacher', 'admin'))
);
alter table public.user_roles enable row level security;

create policy "Read own role" on public.user_roles
  for select using ((select auth.uid()) = user_id);

-- Bookings: each person sees and changes only their own
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) default auth.uid(),
  class_id uuid not null,
  paid boolean not null default false
);
alter table public.bookings enable row level security;

create policy "Read own bookings" on public.bookings
  for select using ((select auth.uid()) = user_id);

create policy "Create own bookings" on public.bookings
  for insert with check ((select auth.uid()) = user_id and paid = false);

create policy "Cancel own bookings" on public.bookings
  for delete using ((select auth.uid()) = user_id);

-- Profile photos: private, one folder per person
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 2097152, array['image/png', 'image/jpeg']);

create policy "Read own avatar" on storage.objects
  for select using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Upload own avatar" on storage.objects
  for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
