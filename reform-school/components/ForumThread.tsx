'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export type ForumReplyRow = {
  id: string;
  user_id: string;
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

export default function ForumThread({
  postId,
  initial,
  signedIn,
  currentUserId,
}: {
  postId: string;
  initial: ForumReplyRow[];
  signedIn: boolean;
  currentUserId: string | null;
}) {
  const [supabase] = useState(() => createClient());
  const [replies, setReplies] = useState(initial);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    const { data } = await supabase
      .from('forum_replies')
      .select('id, user_id, body, author_name, author_avatar, created_at')
      .eq('post_id', postId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: true });
    setReplies((data ?? []) as unknown as ForumReplyRow[]);
  };

  const post = async () => {
    const text = draft.trim();
    if (!text) return;
    setBusy(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).maybeSingle();
      const p = profile as { full_name: string | null; avatar_url: string | null } | null;
      await supabase.from('forum_replies').insert({
        post_id: postId,
        user_id: user.id,
        body: text,
        author_name: p?.full_name ?? null,
        author_avatar: p?.avatar_url ?? null,
      } as never);
      await reload();
      setDraft('');
    }
    setBusy(false);
  };

  const remove = async (id: string) => {
    setBusy(true);
    await supabase.from('forum_replies').delete().eq('id', id).eq('user_id', currentUserId ?? '');
    await reload();
    setBusy(false);
  };

  return (
    <div className="comments">
      <div className="cm-list">
        {replies.length === 0 ? (
          <p className="cm-empty">No replies yet — be the first to respond.</p>
        ) : (
          replies.map((r) => (
            <div className="cm" key={r.id}>
              <Avatar name={r.author_name} src={r.author_avatar} />
              <div className="cm-main">
                <div className="cm-meta">
                  <span className="cm-name">{r.author_name || 'Member'}</span>
                  <span className="cm-time">{timeAgo(r.created_at)}</span>
                </div>
                <p className="cm-body">{r.body}</p>
                {currentUserId === r.user_id && (
                  <div className="cm-actions">
                    <button onClick={() => remove(r.id)} disabled={busy}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {signedIn ? (
        <div className="cm-compose" style={{ marginTop: 'var(--lg)' }}>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={3}
            placeholder="Write a reply…"
          />
          <div className="cm-compose-actions">
            <button
              className="btn btn-primary"
              disabled={busy || !draft.trim()}
              onClick={post}
            >
              Reply
            </button>
          </div>
        </div>
      ) : (
        <div className="panel-prompt">
          <p>Sign in to join this discussion.</p>
          <Link href="/school/login" className="btn btn-secondary">Sign in</Link>
        </div>
      )}
    </div>
  );
}
