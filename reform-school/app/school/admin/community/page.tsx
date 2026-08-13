import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';
import { setForumPostHidden, deleteForumPost, setForumReplyHidden } from '../actions';

export const metadata = { title: 'Community — Admin' };

type PostRow = {
  id: string; user_id: string; type: string; title: string; body: string;
  author_name: string | null; created_at: string; is_hidden: boolean; is_pinned: boolean;
};
type ReplyRow = {
  id: string; user_id: string; post_id: string; body: string;
  author_name: string | null; created_at: string; is_hidden: boolean;
};

export default async function AdminCommunityPage() {
  const { supabase } = await requireAdmin();

  const { data: postsRaw } = await supabase
    .from('forum_posts')
    .select('id, user_id, type, title, body, author_name, created_at, is_hidden, is_pinned')
    .order('created_at', { ascending: false });

  const posts = (postsRaw ?? []) as unknown as PostRow[];

  const postIds = posts.map((p) => p.id);
  let replies: ReplyRow[] = [];
  if (postIds.length > 0) {
    const { data: repliesRaw } = await supabase
      .from('forum_replies')
      .select('id, user_id, post_id, body, author_name, created_at, is_hidden')
      .in('post_id', postIds)
      .order('created_at', { ascending: false });
    replies = (repliesRaw ?? []) as unknown as ReplyRow[];
  }

  const repliesByPost = replies.reduce<Record<string, ReplyRow[]>>((acc, r) => {
    (acc[r.post_id] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="admin-section">
      <div className="admin-page-head">
        <h1>Community moderation</h1>
        <p>{posts.filter((p) => !p.is_hidden).length} visible posts · {posts.filter((p) => p.is_hidden).length} hidden</p>
      </div>

      {posts.length === 0 && <div className="empty-state">No forum posts yet.</div>}

      <div className="req-list">
        {posts.map((post) => (
          <div key={post.id} className={`req-card${post.is_hidden ? ' admin-hidden-item' : ''}`}>
            <div className="req-head">
              <div>
                <span className="req-badge" style={{ marginBottom: 4 }}>
                  {post.type === 'question' ? 'Q&A' : 'Discussion'}
                </span>
                <strong style={{ display: 'block' }}>{post.title}</strong>
                <span style={{ fontSize: 'var(--caption)', color: 'var(--muted)' }}>
                  by {post.author_name || 'Member'} · {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {post.is_hidden && ' · hidden'}
                </span>
              </div>
              <Link href={`/school/community/post/${post.id}`} className="btn btn-secondary" style={{ flexShrink: 0 }}>
                View →
              </Link>
            </div>

            <p className="req-message" style={{ marginTop: 'var(--xs)' }}>
              {post.body.length > 200 ? post.body.slice(0, 200) + '…' : post.body}
            </p>

            <div className="req-actions">
              <form action={setForumPostHidden}>
                <input type="hidden" name="id" value={post.id} />
                <input type="hidden" name="hidden" value={post.is_hidden ? '0' : '1'} />
                <button className="btn btn-secondary" type="submit">
                  {post.is_hidden ? 'Unhide' : 'Hide'}
                </button>
              </form>
              <form action={deleteForumPost}>
                <input type="hidden" name="id" value={post.id} />
                <button
                  className="btn btn-secondary"
                  type="submit"
                  style={{ color: 'var(--coral)' }}
                  onClick={(e) => { if (!confirm('Delete this post and all its replies?')) e.preventDefault(); }}
                >
                  Delete
                </button>
              </form>
            </div>

            {(repliesByPost[post.id] ?? []).length > 0 && (
              <details className="admin-replies-detail">
                <summary className="admin-replies-summary">
                  {(repliesByPost[post.id] ?? []).length} {(repliesByPost[post.id] ?? []).length === 1 ? 'reply' : 'replies'}
                </summary>
                <div className="admin-replies-list">
                  {(repliesByPost[post.id] ?? []).map((r) => (
                    <div key={r.id} className={`admin-reply${r.is_hidden ? ' admin-hidden-item' : ''}`}>
                      <span className="admin-reply-author">{r.author_name || 'Member'}</span>
                      <span className="req-message" style={{ marginTop: 2 }}>{r.body}</span>
                      <form action={setForumReplyHidden} style={{ marginTop: 'var(--xs)' }}>
                        <input type="hidden" name="id" value={r.id} />
                        <input type="hidden" name="post_id" value={r.post_id} />
                        <input type="hidden" name="hidden" value={r.is_hidden ? '0' : '1'} />
                        <button className="btn btn-secondary" type="submit" style={{ fontSize: 'var(--caption)' }}>
                          {r.is_hidden ? 'Unhide reply' : 'Hide reply'}
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
