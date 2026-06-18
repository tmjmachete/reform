import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  access: string;
};

type LessonRow = {
  id: string;
  slug: string;
  title: string;
  notes: string | null;
  duration_minutes: number | null;
  sort_order: number;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('courses').select('title, summary').eq('slug', slug).maybeSingle();
  const course = data as { title: string; summary: string | null } | null;
  return {
    title: course ? `${course.title} — re:form School` : 'Course — re:form School',
    description: course?.summary ?? undefined,
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: courseData } = await supabase
    .from('courses')
    .select('id, slug, title, summary, description, access')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  const course = courseData as CourseRow | null;

  if (!course) notFound();

  const { data: lessonData } = await supabase
    .from('lessons')
    .select('id, slug, title, notes, duration_minutes, sort_order')
    .eq('course_id', course.id)
    .eq('is_published', true)
    .order('sort_order');
  const lessons = (lessonData ?? []) as unknown as LessonRow[];

  return (
    <main>
      <section className="course-header">
        <div className="course-header-in">
          <span className="label">Course</span>
          <h1>{course.title}</h1>
          {course.description && <p className="summary">{course.description}</p>}
          <div className="meta">
            <span className={`badge ${course.access === 'free' ? 'badge-free' : 'badge-gated'}`}>
              {course.access === 'free' ? 'Free' : 'Members'}
            </span>
            <span className="dot">·</span>
            <span>{lessons.length} lessons</span>
          </div>
          {lessons.length > 0 && (
            <div className="hero-actions" style={{ marginTop: 'var(--lg)' }}>
              <Link href={`/school/courses/${course.slug}/${lessons[0].slug}`} className="btn btn-primary">
                Start lesson 1
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        {lessons.length === 0 ? (
          <div className="empty-state">Lessons are being added to this course.</div>
        ) : (
          <div className="lesson-list">
            {lessons.map((l, i) => (
              <Link href={`/school/courses/${course.slug}/${l.slug}`} className="lesson-row" key={l.id}>
                <span className="ix">{String(i + 1).padStart(2, '0')}</span>
                <span>
                  <span className="lt">{l.title}</span>
                  {l.notes && <span className="ld" style={{ display: 'block' }}>{l.notes}</span>}
                </span>
                <span className="go">
                  {l.duration_minutes ? `${l.duration_minutes} min · ` : ''}Open →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
