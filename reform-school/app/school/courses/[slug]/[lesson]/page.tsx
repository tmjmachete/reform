import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { youTubeId, youTubeEmbedUrl } from '@/lib/youtube';
import ProgressButton from '@/components/ProgressButton';
import PersonalNotes from '@/components/PersonalNotes';
import Comments, { type CommentRow } from '@/components/Comments';

type Course = { id: string; slug: string; title: string; access: string };
type LessonNav = { id: string; slug: string; title: string; sort_order: number };
type LessonFull = LessonNav & { notes: string | null; video_url: string | null };
type ResourceRow = { id: string; title: string; file_url: string };

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lesson: string }> }) {
  const { slug, lesson } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('lessons')
    .select('title, courses(title)')
    .eq('slug', lesson)
    .maybeSingle();
  const row = data as { title: string; courses: { title: string } | null } | null;
  return { title: row ? `${row.title} — ${row.courses?.title ?? 're:form School'}` : 'Lesson — re:form School' };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lesson: string }> }) {
  const { slug, lesson } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: courseData } = await supabase
    .from('courses')
    .select('id, slug, title, access')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  const course = courseData as Course | null;
  if (!course) notFound();

  const { data: lessonsData } = await supabase
    .from('lessons')
    .select('id, slug, title, sort_order')
    .eq('course_id', course.id)
    .eq('is_published', true)
    .order('sort_order');
  const lessons = (lessonsData ?? []) as unknown as LessonNav[];

  const { data: currentData } = await supabase
    .from('lessons')
    .select('id, slug, title, notes, video_url, sort_order')
    .eq('course_id', course.id)
    .eq('slug', lesson)
    .eq('is_published', true)
    .maybeSingle();
  const current = currentData as LessonFull | null;

  // RLS returns null for a gated lesson when signed out — show a sign-in gate.
  if (!current) {
    if (course.access === 'auth' && !user) return <LockedGate title={course.title} />;
    notFound();
  }

  const { data: resData } = await supabase
    .from('resources')
    .select('id, title, file_url')
    .eq('lesson_id', current.id)
    .order('sort_order');
  const resources = (resData ?? []) as unknown as ResourceRow[];

  let completed = false;
  let completedIds = new Set<string>();
  if (user) {
    const { data: prog } = await supabase.from('progress').select('lesson_id, completed').eq('completed', true);
    const rows = (prog ?? []) as unknown as { lesson_id: string; completed: boolean }[];
    completedIds = new Set(rows.map((r) => r.lesson_id));
    completed = completedIds.has(current.id);
  }

  let initialNote = '';
  if (user) {
    const { data: noteData } = await supabase
      .from('notes')
      .select('content')
      .eq('user_id', user.id)
      .eq('lesson_id', current.id)
      .maybeSingle();
    initialNote = (noteData as { content: string } | null)?.content ?? '';
  }

  const { data: commentData } = await supabase
    .from('comments')
    .select('id, user_id, parent_id, body, author_name, author_avatar, created_at')
    .eq('lesson_id', current.id)
    .order('created_at', { ascending: true });
  const comments = (commentData ?? []) as unknown as CommentRow[];

  const idx = lessons.findIndex((l) => l.id === current.id);
  const prev = idx > 0 ? lessons[idx - 1] : null;
  const next = idx >= 0 && idx < lessons.length - 1 ? lessons[idx + 1] : null;
  const videoId = youTubeId(current.video_url);
  const paragraphs = (current.notes ?? '').split(/\n{2,}/).filter(Boolean);

  return (
    <div className="lesson-shell">
      <article className="lesson-main">
        <div className="lesson-crumb">
          <Link href="/school/courses">Courses</Link> &nbsp;/&nbsp; <Link href={`/school/courses/${course.slug}`}>{course.title}</Link>
        </div>

        {videoId ? (
          <div className="lesson-video">
            <iframe
              src={youTubeEmbedUrl(videoId)}
              title={current.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="lesson-video-empty">
            <span className="vi">▶</span>
            <span>Video coming soon</span>
          </div>
        )}

        <h1>{current.title}</h1>

        {paragraphs.length > 0 && (
          <>
            <div className="lesson-section-label">Study notes</div>
            <div className="lesson-notes">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </>
        )}

        {resources.length > 0 && (
          <>
            <div className="lesson-section-label">Downloads</div>
            <div className="downloads">
              {resources.map((r) => (
                <a className="download-row" key={r.id} href={r.file_url} target="_blank" rel="noopener">
                  <span aria-hidden="true">⬇</span> {r.title}
                </a>
              ))}
            </div>
          </>
        )}

        <div className="lesson-actions">
          <ProgressButton lessonId={current.id} initialCompleted={completed} signedIn={!!user} />
          <div className="lesson-nav-links">
            {prev && (
              <Link href={`/school/courses/${course.slug}/${prev.slug}`} className="btn btn-secondary">
                ← Previous
              </Link>
            )}
            {next && (
              <Link href={`/school/courses/${course.slug}/${next.slug}`} className="btn btn-primary">
                Next →
              </Link>
            )}
          </div>
        </div>

        <div className="lesson-section-label">My notes</div>
        <PersonalNotes lessonId={current.id} signedIn={!!user} initialContent={initialNote} />

        <div className="lesson-section-label">Discussion</div>
        <Comments
          lessonId={current.id}
          signedIn={!!user}
          currentUserId={user?.id ?? null}
          initial={comments}
        />
      </article>

      <aside className="lesson-aside">
        <div className="ah">{course.title}</div>
        {lessons.map((l, i) => (
          <Link
            key={l.id}
            href={`/school/courses/${course.slug}/${l.slug}`}
            className={`li${l.id === current.id ? ' cur' : ''}`}
          >
            <span className="n">{String(i + 1).padStart(2, '0')}</span>
            <span>{l.title}</span>
            {completedIds.has(l.id) && <span className="ck" aria-label="completed">✓</span>}
          </Link>
        ))}
      </aside>
    </div>
  );
}

function LockedGate({ title }: { title: string }) {
  return (
    <div className="locked-gate">
      <span className="label" style={{ marginBottom: 'var(--md)' }}>Members only</span>
      <h1>This lesson is for members</h1>
      <p>“{title}” is a members-only course. Sign in with a free account to continue.</p>
      <Link href="/school/login" className="btn btn-primary">Sign in with Google</Link>
    </div>
  );
}
