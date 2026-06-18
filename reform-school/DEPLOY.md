# Deploying re:form School

The school is a Next.js app that serves under `/school`. The existing static
site (`../reform-site`) stays as-is; we route `/school/*` to this app using the
**Next.js Multi-Zones** pattern.

## 1. Push the code
`reform-school/` needs to be in the GitHub repo (it's currently untracked).
Commit it and push to `tmjmachete/reform`.

## 2. Create the Vercel project for the school
- New Vercel project → import the repo → set **Root Directory** to `reform-school`.
- Framework preset: **Next.js** (auto-detected).
- Add Environment Variables (Production + Preview):
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://cdrxcfasbolgrdlrsidb.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_I9dJCAHRLjFQ2EYJzcGIHA_3DH2cuzE`
- Deploy. Note the URL it gives you, e.g. `reform-school.vercel.app`.

## 3. Route /school from the main site
In the **main site** Vercel project (`reform-site`), add a rewrite so
`reformpod.vercel.app/school` serves this app. Add to `reform-site/vercel.json`:

```json
{
  "rewrites": [
    { "source": "/school", "destination": "https://reform-school.vercel.app/school" },
    { "source": "/school/:path*", "destination": "https://reform-school.vercel.app/school/:path*" }
  ]
}
```
(Merge with the existing `rewrites` array — keep the current `/posts` and `/notes` rules.)

## 4. Supabase auth URLs (Production)
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
