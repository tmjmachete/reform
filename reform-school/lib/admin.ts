import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Guards admin-only server code. Redirects to /login if signed out, or to the
 * school home if signed in but not an admin. RLS is the real enforcement; this
 * is the UX layer. Returns the authenticated Supabase client + user.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  const role = (data as { role: string } | null)?.role;
  if (role !== 'admin') redirect('/');

  return { supabase, user };
}
