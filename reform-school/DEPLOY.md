# Deploying re:form

`reform-school/` is now the **whole site** — brand pages at the root and the
Bible school under `/school`. It replaces the old static `reform-site/`.

## 1. Push the code
Commit `reform-school/` and push to `tmjmachete/reform` (then open a PR /
merge `feat/reform-school` to `main`).

## 2. Point the Vercel project at this app
In the Vercel project that serves `reformpod.vercel.app`:
- Set **Root Directory** to `reform-school` (Framework preset: Next.js).
- Add Environment Variables (Production + Preview):
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://cdrxcfasbolgrdlrsidb.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_I9dJCAHRLjFQ2EYJzcGIHA_3DH2cuzE`
- Remove the old static-site config (the `reform-site/vercel.json` rewrites are
  no longer needed — Next handles routing).
- Deploy. The whole site (/, /learn, /journal, /school) is served by this app.

## 3. Supabase auth URLs (Production)
Authentication → URL Configuration → **Redirect URLs**, add:
- `https://reformpod.vercel.app/school/auth/callback`
- (keep the localhost one for dev)

Set **Site URL** to `https://reformpod.vercel.app/school`.

## 5. First admin
After you sign in once with Google in production (creates your profile row),
grant yourself admin (Supabase SQL editor):
```sql
update public.profiles set role = 'admin' where email = 'tmjmachete@gmail.com';
```
Then "Open admin panel" appears on your account page.

## Adding your videos
In the admin panel, open a lesson and paste the YouTube link into the
**YouTube link** field. Members-only courses → set those YouTube videos to
**Unlisted**. Free courses → Public.
