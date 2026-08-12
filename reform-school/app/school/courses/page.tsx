import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Courses — re:form School',
  description: 'Guided Bible studies — free and members-only — from re:form School.',
};

type CourseCard = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  access: string;
  lessons: { count: number }[];
};

export default async function CoursesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from('courses')
    .select('id, slug, title, summary, access, sort_order, lessons(count)')
    .eq('is_published', true)
    .order('sort_order');

  const courses = (data ?? []) as unknown as CourseCard[];

  const enrolledCourseIds = new Set<string>();
  if (user) {
    const { data: progData } = await supabase
      .from('progress')
      .select('lessons!inner(course_id)');
    if (progData) {
      for (const row of progData as unknown as { lessons: { course_id: string } }[]) {
        if (row.lessons?.course_id) enrolledCourseIds.add(row.lessons.course_id);
      }
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <span className="label">The library</span>
          <h1>Courses</h1>
          <p className="hero-lead">
            Ordered studies you can work through at your own pace. Free courses are open to all;
            enrolled courses just need a (free) account.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        {courses.length === 0 ? (
          <div className="empty-state">No courses are published yet. Check back soon.</div>
        ) : (
          <div className="course-grid">
            {courses.map((c, i) => {
              const enrolled = enrolledCourseIds.has(c.id);
              return (
                <Link href={`/school/courses/${c.slug}`} className="course-card" key={c.id}>
                  <div className={`course-cover c${i % 3}`}>
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="course-body">
                    <div className="course-meta">
                      <span className={`badge ${enrolled ? 'badge-enrolled' : c.access === 'free' ? 'badge-free' : 'badge-gated'}`}>
                        {enrolled ? 'Enrolled' : c.access === 'free' ? 'Enrol' : 'Members'}
                      </span>
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.summary}</p>
                    <span className="foot">{c.lessons?.[0]?.count ?? 0} lessons</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
