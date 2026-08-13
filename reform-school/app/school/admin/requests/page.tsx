import { requireAdmin } from '@/lib/admin';
import { updateRequestStatus, saveAdminNotes } from '../actions';

export const metadata = { title: 'Session requests — Admin' };

type RequestRow = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

export default async function AdminRequestsPage() {
  const { supabase } = await requireAdmin();

  const { data } = await supabase
    .from('session_requests')
    .select('id, name, email, topic, message, status, admin_notes, created_at')
    .order('created_at', { ascending: false });

  const requests = (data ?? []) as unknown as RequestRow[];

  const pending = requests.filter((r) => r.status === 'pending');
  const rest = requests.filter((r) => r.status !== 'pending');

  function statusBadge(status: string) {
    const map: Record<string, string> = { pending: 'req-pending', approved: 'req-approved', declined: 'req-declined' };
    return <span className={`req-badge ${map[status] ?? ''}`}>{status}</span>;
  }

  function RequestCard({ r }: { r: RequestRow }) {
    return (
      <div className="req-card">
        <div className="req-head">
          <div>
            <strong>{r.name}</strong>
            <a href={`mailto:${r.email}`} className="req-email">{r.email}</a>
          </div>
          <div className="req-meta">
            {statusBadge(r.status)}
            <span className="req-date">
              {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <p className="req-topic"><strong>Topic:</strong> {r.topic}</p>
        {r.message && <p className="req-message">{r.message}</p>}

        {r.admin_notes && (
          <p className="req-notes-view"><em>Notes:</em> {r.admin_notes}</p>
        )}

        <div className="req-actions">
          {r.status === 'pending' && (
            <>
              <form action={updateRequestStatus}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="status" value="approved" />
                <button className="btn btn-primary" type="submit">Approve</button>
              </form>
              <form action={updateRequestStatus}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="status" value="declined" />
                <button className="btn btn-secondary" type="submit">Decline</button>
              </form>
            </>
          )}
          {r.status !== 'pending' && (
            <form action={updateRequestStatus}>
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="status" value="pending" />
              <button className="btn btn-secondary" type="submit">Reset to pending</button>
            </form>
          )}

          <form action={saveAdminNotes} className="req-notes-form">
            <input type="hidden" name="id" value={r.id} />
            <input
              type="text"
              name="admin_notes"
              defaultValue={r.admin_notes ?? ''}
              placeholder="Internal notes…"
              className="req-notes-input"
            />
            <button className="btn btn-secondary" type="submit">Save note</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="admin-page-head">
        <h1>Session requests</h1>
        <p>{pending.length} pending · {requests.length} total</p>
      </div>

      {pending.length === 0 && rest.length === 0 && (
        <div className="empty-state">No session requests yet.</div>
      )}

      {pending.length > 0 && (
        <>
          <h2 className="admin-sub-head">Pending</h2>
          <div className="req-list">
            {pending.map((r) => <RequestCard key={r.id} r={r} />)}
          </div>
        </>
      )}

      {rest.length > 0 && (
        <>
          <h2 className="admin-sub-head" style={{ marginTop: 'var(--xl)' }}>Reviewed</h2>
          <div className="req-list">
            {rest.map((r) => <RequestCard key={r.id} r={r} />)}
          </div>
        </>
      )}
    </div>
  );
}
