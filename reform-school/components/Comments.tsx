'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { TablesInsert } from '@/lib/database.types';

export type CommentRow = {
  id: string;
  user_id: string;
  parent_id: string | null;
  body: string;
  author_name: string | null;
  author_avatar: string | null;
  created_at: string;
};

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Avatar({ name, src }: { name: string | null; src: string | null }) {
  if (src) return <img className="cm-avatar" src={src} alt="" referrerPolicy="no-referrer" />;
  const initial = (name ?? 'M').trim().charAt(0).toUpperCase();
  return <span className="cm-avatar cm-avatar-fallback" aria-hidden="true">{initial}</span>;
}

export default function Comments({
  lessonId,
  signedIn,
  currentUserId,
  initial,
}: {
  lessonId: string;
  signedIn: boolean;
  currentUserId: string | null;
  initial: CommentRow[];
}) {
  const [supabase] = useState(() => createClient());
  const [comments, setComments] = useState<CommentRow[]>(initial);
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState('');
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    const { data } = await supabase
      .from('comments')
      .select('id, user_id, parent_id, body, author_name, author_avatar, created_at')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: true });
    setComments((data ?? []) as unknown as CommentRow[]);
  };

  const post = async (body: string, parentId: string | null) => {
    const text = body.trim();
    if (!text) return;
    setBusy(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const row: TablesInsert<'comments'> = { user_id: user.id, lesson_id: lessonId, body: text, parent_id: parentId };
      await supabase.from('comments').insert(row as never);
      await reload();
    }
    setBusy(false);
  };

  const remove = async (id: string) => {
    setBusy(true);
    await supabase.from('comments').delete().eq('id', id);
    await reload();
    setBusy(false);
  };

  const tops = comments.filter((c) => !c.parent_id);
  const repliesOf = (id: string) => comments.filter((c) => c.parent_id === id);

  const renderComment = (c: CommentRow, isReply = false) => (
    <div className={`cm${isReply ? ' cm-reply' : ''}`} key={c.id}>
      <Avatar name={c.author_name} src={c.author_avatar} />
      <div className="cm-main">
        <div className="cm-meta">
          <span className="cm-name">{c.author_name || 'Member'}</span>
          <span className="cm-time">{timeAgo(c.created_at)}</span>
        </div>
        <p className="cm-body">{c.body}</p>
        <div className="cm-actions">
          {signedIn && !isReply && (
            <button onClick={() => { setReplyTo(replyTo === c.id ? null : c.id); setReplyDraft(''); }}>Reply</button>
          )}
          {currentUserId === c.user_id && (
            <button onClick={() => remove(c.id)} disabled={busy}>Delete</button>
          )}
        </div>

        {replyTo === c.id && (
          <div className="cm-compose cm-compose-reply">
            <textarea value={replyDraft} onChange={(e) => setReplyDraft(e.target.value)} rows={2} placeholder="Write a reply…" />
            <div className="cm-compose-actions">
              <button className="btn btn-secondary" onClick={() => setReplyTo(null)}>Cancel</button>
              <button
                className="btn btn-primary"
                disabled={busy || !replyDraft.trim()}
                onClick={async () => { await post(replyDraft, c.id); setReplyDraft(''); setReplyTo(null); }}
              >Reply</button>
            </div>
          </div>
        )}

        {repliesOf(c.id).map((r) => renderComment(r, true))}
      </div>
    </div>
  );

  return (
    <div className="comments">
      {signedIn ? (
        <div className="cm-compose">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder="Share a reflection or ask a question…" />
          <div className="cm-compose-actions">
            <button
              className="btn btn-primary"
              disabled={busy || !draft.trim()}
              onClick={async () => { await post(draft, null); setDraft(''); }}
            >Post comment</button>
          </div>
        </div>
      ) : (
        <div className="panel-prompt">
          <p>Sign in to join the conversation on this lesson.</p>
          <Link href="/login" className="btn btn-secondary">Sign in</Link>
        </div>
      )}

      <div className="cm-list">
        {tops.length === 0 ? (
          <p className="cm-empty">No comments yet — be the first to share.</p>
        ) : (
          tops.map((c) => renderComment(c))
        )}
      </div>
    </div>
  );
}
