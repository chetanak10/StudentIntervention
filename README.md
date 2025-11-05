# Student Intervention — Static Frontend (GitHub Pages ready)

This is a static dashboard that mirrors your screenshot and **includes the Override feature**. It can run in two modes:

1) **Demo mode (no backend):** uses built‑in sample data so it works instantly on GitHub Pages.
2) **Supabase mode:** connects to your Postgres/Supabase project (with RLS) using the provided `db.sql` and email magic‑link login.

## Quick Start (Demo Mode)
1. Open `index.html` locally or publish this folder to GitHub Pages.
2. Click **Demo mode** in the footer to load sample cards.

## Connect to Supabase
1. Create a free Supabase project.
2. Open the SQL editor and run **`db.sql`** from this repo (paste and execute).
3. In Supabase → **Authentication → URL Configuration**, add your GitHub Pages URL (e.g., `https://USERNAME.github.io/StudentIntervention`) as an **Authorized redirect**.
4. Create a teacher user (Auth → Users). Or sign up using magic link from the app.
5. Assign roles by inserting into `public.user_roles`:
   ```sql
   insert into public.user_roles (user_id, role) values ('<auth.users.id>', 'teacher');
   -- or admin if needed
   ```
6. Create a teacher row connected to that user in `public.teachers`.
7. Add some `students` rows with the teacher's `teacher_id`.
8. Copy `config.example.js` → **`config.js`** and fill in:
   ```js
   window.APP_CONFIG = {
     SUPABASE_URL: "https://YOUR-PROJECT-ref.supabase.co",
     SUPABASE_ANON_KEY: "YOUR_PUBLIC_ANON_KEY"
   };
   ```

## Override Feature
Each student card has **Open** and **Override**. Click **Override** to choose a different strategy.  
In **Demo mode**, the UI updates in place.  
In **Supabase mode**, it updates the `students.intervention_suggestion` field (RLS ensures teachers can edit only their students).

## Publish to GitHub Pages
- Push these files to a public repo.
- In GitHub → Settings → Pages → Build from **main / root** (or from `/docs` if you prefer).
- Wait for the green check and open the URL it shows.
- If assets 404 on a custom path, add a base tag in `index.html` or use a `docs/` folder setting.

## Notes
- If the page is blank on GH Pages, make sure `config.js` exists and is valid or click **Demo mode**.
- For sign‑in to return to your site, set **Authorized redirect URLs** to your GH Pages domain in Supabase.
- RLS policies in `db.sql` limit teachers to their own students and let admins see everything.

