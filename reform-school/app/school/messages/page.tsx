import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import MessageThread, { type DirectMessage } from '@/components/MessageThread';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Messages — re:form School' };

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/school/login');

  const { data: adminData } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'admin')
    .maybeSingle();
  const admin = adminData as { id: string; full_name: string | null } | null;

  if (!admin) {
    return (
      <main>
        <section className="hero">
          <div className="hero-in">
            <span className="label">re:form School</span>
            <h1>Messages</h1>
          </div>
        </section>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="empty-state">No administrator is available right now. Check back soon.</div>
        </section>
      </main>
    );
  }

  const { data: msgsData } = await supabase
    .from('direct_messages')
    .select('id, sender_id, body, is_read, created_at')
    .or(
      `and(sender_id.eq.${user.id},recipient_id.eq.${admin.id}),and(sender_id.eq.${admin.id},recipient_id.eq.${user.id})`
    )
    .order('created_at', { ascending: true });

  const messages = (msgsData ?? []) as unknown as DirectMessage[];

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <span className="label">re:form School</span>
          <h1>Messages</h1>
          <p className="hero-lead">
            Private messages with the re:form team. For questions visible to other students, use{' '}
            <Link href="/school/community/ask" style={{ color: 'inherit', textDecoration: 'underline' }}>
              Ask the teacher
            </Link>.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, maxWidth: 680, margin: '0 auto' }}>
        <MessageThread
          initial={messages}
          currentUserId={user.id}
          otherUserId={admin.id}
          otherName={admin.full_name ?? 're:form'}
        />
      </section>
    </main>
  );
}
