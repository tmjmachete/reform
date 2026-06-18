import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SessionForm from '@/components/admin/SessionForm';
import { deleteSession } from '@/app/school/admin/actions';

type Session = {
  id: string;
  title: string;
  description: string | null;
  course_id: string | null;
  starts_at: string;
  ends_at: string | null;
  join_url: string | null;
  is_published: boolean;
};
type CourseOpt = { id: string; title: string };

export default async function EditSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sessionData } = await supabase
    .from('live_sessions')
    .select('id, title, description, course_id, starts_at, ends_at, join_url, is_published')
    .eq('id', id)
    .maybeSingle();
  const session = sessionData as Session | null;
  if (!session) notFound();

  const { data: courseData } = await supabase.from('courses').select('id, title').order('sort_order');
  const courses = (courseData ?? []) as unknown as CourseOpt[];

  return (
    <div className="admin-page admin-narrow">
      <div className="admin-crumb"><Link href="/school/admin/sessions">Live sessions</Link> / {session.title}</div>
      <h1>Edit session</h1>
      <SessionForm session={session} courses={courses} />

      <hr className="admin-hr" />

      <form action={deleteSession} className="admin-danger">
        <input type="hidden" name="id" value={id} />
        <button className="admin-delete" type="submit">Delete session</button>
      </form>
    </div>
  );
}
