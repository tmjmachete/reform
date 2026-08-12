import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Profile — re:form School' };

type ProgRow = {
  lesson_id: string;
  completed: boolean;
  lessons: { course_id: string; courses: { id: string; slug: string; title: string } };
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/school/login');

  const { data: profileData } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url, created_at')
    .eq('id', user.id)
    .single();

  const profile = profileData as {
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
    created_at: string;
  } | null;

  const { data: progData } = await supabase
    .from('progress')
    .select('lesson_id, completed, lessons!inner(course_id, courses!inner(id, slug, title))');

  const rows = (progData ?? []) as unknown as ProgRow[];

  const courseMap = new Map<string, { id: string; slug: string; title: string; completed: number }>();
  for (const r of rows) {
    const c = r.lessons.courses;
    if (!courseMap.has(c.id)) {
      courseMap.set(c.id, { id: c.id, slug: c.slug, title: c.title, completed: 0 });
    }
    if (r.completed) courseMap.get(c.id)!.completed += 1;
  }

  const enrolledIds = [...courseMap.keys()];
  const totalMap = new Map<string, number>();
  if (enrolledIds.length > 0) {
    const { data: allLessons } = await supabase
      .from('lessons')
      .select('course_id')
      .in('course_id', enrolledIds)
      .eq('is_published', true);
    for (const l of (allLessons ?? []) as { course_id: string }[]) {
      totalMap.set(l.course_id, (totalMap.get(l.course_id) ?? 0) + 1);
    }
  }

  const courses = [...courseMap.entries()].map(([id, entry]) => ({
    ...entry,
    total: totalMap.get(id) ?? 0,
  }));

  const name =
    profile?.full_name ??
    (user.user_metadata?.full_name as string | undefined) ??
    'Student';

  const joined = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })
    : null;

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <span className="label">Your profile</span>
          <h1>{name}</h1>
          <p className="hero-lead">
            {profile?.email ?? user.email}
            {joined ? ` · Member since ${joined}` : ''}
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        {courses.length === 0 ? (
          <div className="empty-state">
            No courses started yet.{' '}
            <Link href="/school/courses" className="btn btn-primary" style={{ display: 'inline-block', marginTop: 'var(--md)' }}>
              Browse courses
            </Link>
          </div>
        ) : (
          <>
            <div className="section-head">
              <h2>Enrolled courses</h2>
              <p>{courses.length} course{courses.length !== 1 ? 's' : ''} in progress</p>
            </div>
            <div className="profile-course-list">
              {courses.map((c) => {
                const pct = c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0;
                return (
                  <Link href={`/school/courses/${c.slug}`} className="profile-course-row" key={c.id}>
                    <div className="pcr-title">{c.title}</div>
                    <div className="pcr-progress">
                      <div className="pcr-bar">
                        <div className="pcr-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="pcr-label">
                        {c.completed} of {c.total} lessons complete
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        <div style={{ marginTop: 'var(--xl)', display: 'flex', gap: 'var(--md)', flexWrap: 'wrap' }}>
          <Link href="/school/notes" className="btn btn-secondary">My notes</Link>
          <Link href="/school/account" className="btn btn-secondary">Account</Link>
        </div>
      </section>
    </main>
  );
}
