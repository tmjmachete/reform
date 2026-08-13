import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import NewPostForm from '../NewPostForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Ask the teacher — re:form School' };

type QAPost = {
  id: string; title: string; body: string; author_name: string | null;
  author_avatar: string | null; created_at: string; reply_count: number;
};

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function AskPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: postsRaw } = await supabase
    .from('forum_posts')
    .select('id, title, body, author_name, author_avatar, created_at')
    .eq('type', 'question')
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });

  const rawPosts = (postsRaw ?? []) as unknown as Omit<QAPost, 'reply_count'>[];

  const posts: QAPost[] = await Promise.all(
    rawPosts.map(async (p) => {
      const { count } = await supabase
        .from('forum_replies')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', p.id)
        .eq('is_hidden', false);
      return { ...p, reply_count: count ?? 0 };
    })
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <span className="label">re:form School</span>
          <h1>Ask the teacher</h1>
          <p className="hero-lead">
            Post a question — public answers benefit everyone in the school. For private matters,
            use{' '}
            <Link href="/school/messages" style={{ color: 'inherit', textDecoration: 'underline' }}>
              direct messages
            </Link>.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="community-bar">
          <nav className="community-tabs">
            <Link href="/school/community" className="ctab">All activity</Link>
            <Link href="/school/community/ask" className="ctab active">Ask the teacher</Link>
          </nav>
          {user && <NewPostForm type="question" />}
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">No questions yet — ask the first one.</div>
        ) : (
          <div className="qa-list">
            {posts.map((p) => (
              <Link key={p.id} href={`/school/community/post/${p.id}`} className="qa-card">
                <div className="qa-head">
                  <h3 className="qa-title">{p.title}</h3>
                  <span className="qa-replies">{p.reply_count} {p.reply_count === 1 ? 'answer' : 'answers'}</span>
                </div>
                <p className="qa-body">{p.body.length > 180 ? p.body.slice(0, 180) + '…' : p.body}</p>
                <div className="qa-foot">
                  <span className="qa-author">{p.author_name || 'Member'}</span>
                  <span className="qa-time">{timeAgo(p.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
