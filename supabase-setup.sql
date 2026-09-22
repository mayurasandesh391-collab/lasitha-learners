-- Run this in Supabase SQL Editor if your registrations table does not
-- already contain user_id. The website uses user_id to connect a registration
-- to the logged-in student.
alter table public.registrations
add column if not exists user_id uuid references auth.users(id);

-- Student policies. Remove/adjust older conflicting policies if needed.
alter table public.registrations enable row level security;

drop policy if exists "Students can submit own registration" on public.registrations;
drop policy if exists "Students can view own registration" on public.registrations;

create policy "Students can submit own registration"
on public.registrations for insert to authenticated
with check (auth.uid() = user_id);

create policy "Students can view own registration"
on public.registrations for select to authenticated
using (auth.uid() = user_id);

-- Photo upload feature: registrations now store a photo_url.
alter table public.registrations
add column if not exists photo_url text;

-- Storage bucket for student photos (public read, so photos display on the
-- student dashboard and admin panel).
insert into storage.buckets (id, name, public)
values ('student-photos', 'student-photos', true)
on conflict (id) do nothing;

drop policy if exists "Students can upload own photo" on storage.objects;
drop policy if exists "Students can update own photo" on storage.objects;
drop policy if exists "Anyone can view student photos" on storage.objects;

-- Students may only upload into a folder named after their own user id
-- (the website uploads to `${user.id}/...`).
create policy "Students can upload own photo"
on storage.objects for insert to authenticated
with check (bucket_id = 'student-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Students can update own photo"
on storage.objects for update to authenticated
using (bucket_id = 'student-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Photos are publicly viewable (needed so <img> tags load without auth).
create policy "Anyone can view student photos"
on storage.objects for select
using (bucket_id = 'student-photos');

-- IMPORTANT:
-- Admin access should be restricted to your chosen admin account(s).
-- Do NOT make the table publicly readable just to make the admin page work.
-- If your current admin policy already permits authenticated SELECT/DELETE,
-- the included admin.html can use it.
