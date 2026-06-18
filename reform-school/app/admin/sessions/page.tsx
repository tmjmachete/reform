import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import LocalTime from '@/components/LocalTime';

type SessionRow = { id: string; title: string; starts_at: string; is_published: boolean };

export default async function AdminSessions() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('live_sessions')
    .select('id, title, starts_at, is_published')
    .order('starts_at', { ascending: false });
  const sessions = (data ?? []) as unknown as SessionRow[];

  return (
    <div className="admin-page">
      <div className="admin-head">
        <h1>Live sessions</h1>
        <Link href="/admin/sessions/new" className="btn btn-primary">New session</Link>
      </div>
      {sessions.length === 0 ? (
        <p className="admin-muted">No sessions yet.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>When</th><th>Title</th><th>Status</th></tr></thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <td><LocalTime iso={s.starts_at} /></td>
                <td><Link href={`/admin/sessions/${s.id}`} className="admin-link">{s.title}</Link></td>
                <td><span className={`admin-pill ${s.is_published ? 'pub' : 'draft'}`}>{s.is_published ? 'Published' : 'Draft'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
