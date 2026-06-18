import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Tables } from '@/lib/database.types';

export const metadata = { title: 'Your account — re:form School' };

type ProfileSummary = Pick<Tables<'profiles'>, 'full_name' | 'email' | 'role' | 'created_at'>;

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/school/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role, created_at')
    .eq('id', user.id)
    .single<ProfileSummary>();

  const name = profile?.full_name ?? (user.user_metadata?.full_name as string | undefined);
  const joined = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <main className="section">
      <div className="section-head">
        <span className="label">Your account</span>
        <span className="rule" />
        <h2>{name ?? 'Welcome'}</h2>
        <p>Signed in with Google. Your progress and notes are saved to this account.</p>
      </div>

      <div className="account-card">
        <dl className="account-dl">
          <div>
            <dt>Name</dt>
            <dd>{name ?? '—'}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{profile?.email ?? user.email ?? '—'}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{profile?.role ?? 'student'}</dd>
          </div>
          {joined && (
            <div>
              <dt>Member since</dt>
              <dd>{joined}</dd>
            </div>
          )}
        </dl>
      </div>

      {profile?.role === 'admin' && (
        <div style={{ maxWidth: 'var(--maxw)', margin: 'var(--lg) auto 0' }}>
          <Link href="/school/admin" className="btn btn-secondary">Open admin panel</Link>
        </div>
      )}
    </main>
  );
}
