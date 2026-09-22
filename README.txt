LASITHA LEARNERS - SUPABASE CONNECTED VERSION

Files:
index.html       Main premium website + registration + student login
student.html     Student dashboard
admin.html       Admin login/panel
config.js        Supabase URL + publishable key
script.js        Registration + login logic
student.js       Student dashboard logic
admin.js         Admin panel logic
style.css        Full website design
supabase-setup.sql  SQL needed if user_id is missing / policies need updating

NEW: LIVE PHOTO UPLOAD
- The registration form now has a round photo picker with an instant live
  preview (updates the moment a photo is chosen, before submitting).
- On submit, the photo is uploaded to a Supabase Storage bucket named
  "student-photos" and its public URL is saved as registrations.photo_url.
- The photo is shown on the student dashboard and as a thumbnail in the
  admin table.
- You MUST run the updated supabase-setup.sql once in the Supabase SQL
  Editor — it adds the photo_url column, creates the student-photos
  storage bucket, and sets the upload/view policies.

IMPORTANT:
1. Open index.html through a local server (VS Code Live Server) or GitHub Pages.
2. Do not put a Supabase secret/service_role key in the website.
3. If email confirmation is enabled, a new student may need to confirm email before login.
4. The student registration code expects a registrations.user_id column.
5. Admin SELECT/DELETE must be protected by an appropriate admin policy; do not make
   registrations public.
6. Run supabase-setup.sql once so the photo_url column and student-photos
   storage bucket/policies exist, or photo uploads will fail.

The publishable key is safe to include in frontend code; security comes from RLS.
