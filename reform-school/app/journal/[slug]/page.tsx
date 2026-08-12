import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import postsData from '@/content/journal/index.json';
import { createClient } from '@/lib/supabase/server';
import Comments, { type CommentRow } from '@/components/Comments';

export const dynamic = 'force-dynamic';

type Post = {
  issue: string;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  image: string | null;
  badge: string | null;
};

const posts = postsData as Post[];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return post
    ? { title: post.title, description: post.excerpt }
    : { title: 'Reform Journal' };
}

function readBody(slug: string): string | null {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'content', 'journal', `${slug}.html`), 'utf8');
  } catch {
    return null;
  }
}

export default async function JournalPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  const body = readBody(slug);
  if (!post || !body) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: commentData } = await supabase
    .from('comments')
    .select('id, user_id, parent_id, body, author_name, author_avatar, created_at')
    .eq('post_slug' as never, slug)
    .order('created_at', { ascending: true });
  const comments = (commentData ?? []) as unknown as CommentRow[];

  const idx = posts.findIndex((p) => p.slug === slug);
  const newer = idx > 0 ? posts[idx - 1] : null;
  const older = idx < posts.length - 1 ? posts[idx + 1] : null;

  return (
    <main>
      <section className="post-hero">
        <div className="post-hero-in">
          <div className="pm">Reform Journal · Issue {post.issue} · {post.date}</div>
          <h1>{post.title}</h1>
          <p className="deck">{post.excerpt}</p>
        </div>
      </section>

      {post.image && (
        <div className="post-hero-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt="" />
        </div>
      )}

      <article className="post-prose" dangerouslySetInnerHTML={{ __html: body }} />

      <div className="post-foot">
        <hr className="admin-hr" />
        <div className="lesson-section-label">Discussion</div>
        <Comments
          postSlug={slug}
          signedIn={!!user}
          currentUserId={user?.id ?? null}
          initial={comments}
        />
        <hr className="admin-hr" style={{ marginTop: 'var(--xl)' }} />
        <div className="lesson-actions" style={{ border: 0, paddingTop: 0, marginTop: 0 }}>
          <Link href="/journal" className="btn btn-secondary">← All issues</Link>
          <div className="lesson-nav-links">
            {older && <Link href={`/journal/${older.slug}`} className="btn btn-secondary">Issue {older.issue}</Link>}
            {newer && <Link href={`/journal/${newer.slug}`} className="btn btn-primary">Issue {newer.issue} →</Link>}
          </div>
        </div>
      </div>
    </main>
  );
}
