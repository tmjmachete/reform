import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/admin';
import { setUserRole } from '../actions';

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  created_at: string;
};

export default async function AdminUsersPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, email, role, created_at')
    .order('created_at', { ascending: false });

  const users = (data ?? []) as unknown as ProfileRow[];

  return (
    <div className="admin-page">
      <div className="admin-head">
        <h1>Users</h1>
        <span className="admin-muted">{users.length} registered</span>
      </div>

      {users.length === 0 ? (
        <p className="admin-muted">No users yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.full_name ?? '—'}</td>
                <td>{u.email ?? '—'}</td>
                <td>
                  <span className={`admin-pill ${u.role === 'admin' ? 'pub' : 'draft'}`}>
                    {u.role}
                  </span>
                </td>
                <td>
                  {new Date(u.created_at).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </td>
                <td>
                  <form action={setUserRole}>
                    <input type="hidden" name="user_id" value={u.id} />
                    <input type="hidden" name="role" value={u.role === 'admin' ? 'student' : 'admin'} />
                    <button type="submit" className="btn btn-secondary" style={{ fontSize: 'var(--caption)', padding: '4px 10px' }}>
                      {u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
