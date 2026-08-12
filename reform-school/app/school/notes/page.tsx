import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'My notes — re:form School' };

type NoteRow = {
  id: string;
  content: string;
  updated_at: string;
  lessons: {
    id: string;
    slug: string;
    title: string;
    courses: { slug: string; title: string };
  } | null;
};

export default async function NotesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/school/login');

  const { data } = await supabase
    .from('notes')
    .select('id, content, updated_at, lessons!inner(id, slug, title, courses!inner(slug, title))')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  const notes = (data ?? []) as unknown as NoteRow[];

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <span className="label">re:form School</span>
          <h1>My notes</h1>
          <p className="hero-lead">
            Your personal study journal — notes written across every lesson, saved to your account.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        {notes.length === 0 ? (
          <div className="empty-state">
            No notes yet. Open a lesson and start writing.
          </div>
        ) : (
          <div className="notes-list">
            {notes.map((n) => (
              <div className="note-card" key={n.id}>
                <div className="note-meta">
                  {n.lessons ? (
                    <Link
                      href={`/school/courses/${n.lessons.courses.slug}/${n.lessons.slug}`}
                      className="note-lesson"
                    >
                      {n.lessons.courses.title} — {n.lessons.title}
                    </Link>
                  ) : (
                    <span className="note-lesson">Unknown lesson</span>
                  )}
                  <span className="note-date">
                    {new Date(n.updated_at).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="note-body">{n.content}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
