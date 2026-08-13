import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ForumThread, { type ForumReplyRow } from '@/components/ForumThread';
import { deleteOwnForumPost } from '../../actions';

export const dynamic = 'force-dynamic';

type ForumPostFull = {
  id: string; user_id: string; title: string; body: string;
  author_name: string | null; author_avatar: string | null; created_at: string; type: string;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('forum_posts').select('title').eq('id', id).maybeSingle();
  return { title: (data as { title: string } | null)?.title ?? 'Discussion — re:form School' };
}

export default async function ForumPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: postData } = await supabase
    .from('forum_posts')
    .select('id, user_id, title, body, author_name, author_avatar, created_at, type')
    .eq('id', id)
    .eq('is_hidden', false)
    .maybeSingle();

  const post = postData as ForumPostFull | null;
  if (!post) notFound();

  const { data: repliesData } = await supabase
    .from('forum_replies')
    .select('id, user_id, body, author_name, author_avatar, created_at')
    .eq('post_id', id)
    .eq('is_hidden', false)
    .order('created_at', { ascending: true });

  const replies = (repliesData ?? []) as unknown as ForumReplyRow[];

  function timeAgo(iso: string): string {
    const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return 'just now';
    const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24); if (d < 30) return `${d}d ago`;
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function Avatar({ name, src }: { name: string | null; src: string | null }) {
    if (src) return <img className="cm-avatar" src={src} alt="" referrerPolicy="no-referrer" />;
    const initial = (name ?? 'M').trim().charAt(0).toUpperCase();
    return <span className="cm-avatar cm-avatar-fallback" aria-hidden="true">{initial}</span>;
  }

  const backHref = post.type === 'question' ? '/school/community/ask' : '/school/community';

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <Link href={backHref} className="post-back">
            ← {post.type === 'question' ? 'Ask the teacher' : 'Community'}
          </Link>
          <span className="label" style={{ marginTop: 'var(--sm)' }}>
            {post.type === 'question' ? 'Question' : 'Discussion'}
          </span>
          <h1>{post.title}</h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, maxWidth: 720, margin: '0 auto' }}>
        <div className="forum-post-body">
          <div className="cm-meta" style={{ marginBottom: 'var(--md)' }}>
            <Avatar name={post.author_name} src={post.author_avatar} />
            <span className="cm-name">{post.author_name || 'Member'}</span>
            <span className="cm-time">{timeAgo(post.created_at)}</span>
          </div>
          <div className="post-prose" style={{ fontSize: 'var(--body-lg)' }}>
            {post.body.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {user?.id === post.user_id && (
            <form action={deleteOwnForumPost} style={{ marginTop: 'var(--md)' }}>
              <input type="hidden" name="id" value={post.id} />
              <button className="btn btn-secondary" type="submit"
                onClick={(e) => { if (!confirm('Delete this post?')) e.preventDefault(); }}>
                Delete post
              </button>
            </form>
          )}
        </div>

        <div className="lesson-section-label" style={{ marginTop: 'var(--xl)' }}>
          {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
        </div>

        <ForumThread
          postId={post.id}
          initial={replies}
          signedIn={!!user}
          currentUserId={user?.id ?? null}
        />
      </section>
    </main>
  );
}
