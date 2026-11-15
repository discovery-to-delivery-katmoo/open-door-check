-- Profiles: one row per person
create table public.profiles (
  id uuid primary key references auth.users (id),
  display_name text,
  role text not null default 'member'
);
alter table public.profiles enable row level security;

create policy "Read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Bookings: names and emails of people who booked
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  guest_name text,
  guest_email text,
  starts_at timestamptz
);

-- Private notes each person writes about their bookings
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  body text
);
alter table public.notes enable row level security;

create policy "Notes are readable" on public.notes
  for select using (true);

create policy "Write own notes" on public.notes
  for insert with check (auth.uid() = user_id);

-- Passport scans uploaded at check-in
insert into storage.buckets (id, name, public)
values ('passport-scans', 'passport-scans', true);

-- Cancels a booking
create function public.cancel_booking(booking_id uuid)
returns void
language sql
security definer
as $$
  delete from public.bookings where id = booking_id;
$$;
