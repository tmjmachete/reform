import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import postsData from '@/content/journal/index.json';
import NewPostForm from './NewPostForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Community — re:form School' };

type Post = { slug: string; title: string };
const posts = postsData as Post[];
const postBySlug = Object.fromEntries(posts.map((p) => [p.slug, p]));

type LessonComment = {
  id: string; body: string; author_name: string | null; author_avatar: string | null; created_at: string;
  lessons: { slug: string; title: string; courses: { slug: string; title: string } } | null;
};
type JournalComment = {
  id: string; body: string; author_name: string | null; author_avatar: string | null; created_at: string; post_slug: string;
};
type ForumPost = {
  id: string; title: string; body: string; author_name: string | null; author_avatar: string | null; created_at: string; type: string;
};

type FeedItem =
  | { kind: 'lesson'; data: LessonComment }
  | { kind: 'journal'; data: JournalComment }
  | { kind: 'forum'; data: ForumPost };

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

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: lcRaw }, { data: jcRaw }, { data: fpRaw }] = await Promise.all([
    supabase
      .from('comments')
      .select('id, body, author_name, author_avatar, created_at, lessons:lesson_id(slug, title, courses:course_id(slug, title))')
      .not('lesson_id', 'is', null)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('comments')
      .select('id, body, author_name, author_avatar, created_at, post_slug')
      .not('post_slug', 'is', null)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('forum_posts')
      .select('id, title, body, author_name, author_avatar, created_at, type')
      .eq('is_hidden', false)
      .eq('type', 'discussion')
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const lessonComments = (lcRaw ?? []) as unknown as LessonComment[];
  const journalComments = (jcRaw ?? []) as unknown as JournalComment[];
  const forumPosts = (fpRaw ?? []) as unknown as ForumPost[];

  const feed: FeedItem[] = [
    ...lessonComments.map((d) => ({ kind: 'lesson' as const, data: d })),
    ...journalComments.map((d) => ({ kind: 'journal' as const, data: d })),
    ...forumPosts.map((d) => ({ kind: 'forum' as const, data: d })),
  ].sort((a, b) => new Date(b.data.created_at).getTime() - new Date(a.data.created_at).getTime())
   .slice(0, 40);

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <span className="label">re:form School</span>
          <h1>Community</h1>
          <p className="hero-lead">
            Reflections, questions, and discussions from students across every lesson and journal issue.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="community-bar">
          <nav className="community-tabs">
            <Link href="/school/community" className="ctab active">All activity</Link>
            <Link href="/school/community/ask" className="ctab">Ask the teacher</Link>
          </nav>
          {user && <NewPostForm />}
        </div>

        {feed.length === 0 ? (
          <div className="empty-state">No activity yet — be the first to post.</div>
        ) : (
          <div className="feed">
            {feed.map((item) => {
              if (item.kind === 'lesson') {
                const d = item.data;
                const lesson = d.lessons;
                if (!lesson) return null;
                return (
                  <Link
                    key={`lc-${d.id}`}
                    href={`/school/courses/${lesson.courses.slug}/${lesson.slug}`}
                    className="feed-card"
                  >
                    <div className="feed-meta">
                      <Avatar name={d.author_name} src={d.author_avatar} />
                      <span className="feed-author">{d.author_name || 'Member'}</span>
                      <span className="feed-time">{timeAgo(d.created_at)}</span>
                    </div>
                    <p className="feed-context">
                      in <strong>{lesson.title}</strong>
                      <span className="feed-course"> — {lesson.courses.title}</span>
                    </p>
                    <p className="feed-body">{d.body.length > 200 ? d.body.slice(0, 200) + '…' : d.body}</p>
                  </Link>
                );
              }
              if (item.kind === 'journal') {
                const d = item.data;
                const post = postBySlug[d.post_slug];
                return (
                  <Link key={`jc-${d.id}`} href={`/journal/${d.post_slug}`} className="feed-card">
                    <div className="feed-meta">
                      <Avatar name={d.author_name} src={d.author_avatar} />
                      <span className="feed-author">{d.author_name || 'Member'}</span>
                      <span className="feed-time">{timeAgo(d.created_at)}</span>
                    </div>
                    <p className="feed-context">
                      on <strong>{post?.title ?? d.post_slug}</strong>
                    </p>
                    <p className="feed-body">{d.body.length > 200 ? d.body.slice(0, 200) + '…' : d.body}</p>
                  </Link>
                );
              }
              const d = item.data;
              return (
                <Link key={`fp-${d.id}`} href={`/school/community/post/${d.id}`} className="feed-card feed-card-post">
                  <div className="feed-meta">
                    <Avatar name={d.author_name} src={d.author_avatar} />
                    <span className="feed-author">{d.author_name || 'Member'}</span>
                    <span className="feed-time">{timeAgo(d.created_at)}</span>
                    <span className="feed-tag">Discussion</span>
                  </div>
                  <p className="feed-title">{d.title}</p>
                  <p className="feed-body">{d.body.length > 200 ? d.body.slice(0, 200) + '…' : d.body}</p>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
