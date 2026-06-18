import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * OAuth / PKCE callback. Google redirects back here (via Supabase) with a
 * `code`, which we exchange for a session. Served at /school/auth/callback
 * because of basePath. `next` is a path relative to the /school zone.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const dest = next.startsWith('/') ? next : `/${next}`;
      return NextResponse.redirect(`${origin}/school${dest === '/' ? '' : dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/school/login?error=auth`);
}
