import { requireAdmin } from '@/lib/admin';
import MessageThread, { type DirectMessage } from '@/components/MessageThread';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Messages — Admin' };

type MsgRow = {
  id: string; sender_id: string; recipient_id: string; body: string; is_read: boolean; created_at: string;
};
type Profile = { id: string; full_name: string | null; email: string | null };

export default async function AdminMessagesPage() {
  const { supabase, user: adminUser } = await requireAdmin();

  const { data: msgsRaw } = await supabase
    .from('direct_messages')
    .select('id, sender_id, recipient_id, body, is_read, created_at')
    .or(`sender_id.eq.${adminUser.id},recipient_id.eq.${adminUser.id}`)
    .order('created_at', { ascending: true });

  const msgs = (msgsRaw ?? []) as unknown as MsgRow[];

  const studentIds = [...new Set(
    msgs.map((m) => m.sender_id === adminUser.id ? m.recipient_id : m.sender_id)
  )];

  if (studentIds.length === 0) {
    return (
      <div className="admin-section">
        <div className="admin-page-head"><h1>Messages</h1></div>
        <div className="empty-state">No messages yet.</div>
      </div>
    );
  }

  const { data: profilesRaw } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .in('id', studentIds);

  const profiles = (profilesRaw ?? []) as unknown as Profile[];
  const profileById = Object.fromEntries(profiles.map((p) => [p.id, p]));

  const conversations = studentIds.map((sid) => ({
    student: profileById[sid] ?? { id: sid, full_name: null, email: null },
    messages: msgs.filter(
      (m) =>
        (m.sender_id === sid && m.recipient_id === adminUser.id) ||
        (m.sender_id === adminUser.id && m.recipient_id === sid)
    ) as unknown as DirectMessage[],
  }));

  const lastMsg = (c: typeof conversations[0]) =>
    c.messages[c.messages.length - 1];

  conversations.sort(
    (a, b) =>
      new Date(lastMsg(b)?.created_at ?? 0).getTime() -
      new Date(lastMsg(a)?.created_at ?? 0).getTime()
  );

  return (
    <div className="admin-section">
      <div className="admin-page-head">
        <h1>Messages</h1>
        <p>{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="dm-admin-list">
        {conversations.map(({ student, messages }) => (
          <details key={student.id} className="dm-admin-convo">
            <summary className="dm-admin-summary">
              <span className="dm-admin-name">
                {student.full_name || student.email || 'Unknown student'}
              </span>
              {messages.length > 0 && (
                <span className="dm-admin-preview">
                  {messages[messages.length - 1].body.slice(0, 80)}
                  {messages[messages.length - 1].body.length > 80 ? '…' : ''}
                </span>
              )}
              <span className="dm-admin-count">{messages.length} msg{messages.length !== 1 ? 's' : ''}</span>
            </summary>
            <div className="dm-admin-thread">
              <MessageThread
                initial={messages}
                currentUserId={adminUser.id}
                otherUserId={student.id}
                otherName={student.full_name ?? student.email ?? 'Student'}
              />
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
