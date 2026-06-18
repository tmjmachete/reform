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
  const { data } = await supabase
    .from('courses')
    .select('id, slug, title, summary, access, sort_order, lessons(count)')
    .eq('is_published', true)
    .order('sort_order');

  const courses = (data ?? []) as unknown as CourseCard[];

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <span className="label">The library</span>
          <h1>Courses</h1>
          <p className="hero-lead">
            Ordered studies you can work through at your own pace. Free courses are open to all;
            members-only courses just need a (free) account.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        {courses.length === 0 ? (
          <div className="empty-state">No courses are published yet. Check back soon.</div>
        ) : (
          <div className="course-grid">
            {courses.map((c, i) => (
              <Link href={`/courses/${c.slug}`} className="course-card" key={c.id}>
                <div className={`course-cover c${i % 3}`}>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="course-body">
                  <div className="course-meta">
                    <span className={`badge ${c.access === 'free' ? 'badge-free' : 'badge-gated'}`}>
                      {c.access === 'free' ? 'Free' : 'Members'}
                    </span>
                  </div>
                  <h3>{c.title}</h3>
                  <p>{c.summary}</p>
                  <span className="foot">{c.lessons?.[0]?.count ?? 0} lessons</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
