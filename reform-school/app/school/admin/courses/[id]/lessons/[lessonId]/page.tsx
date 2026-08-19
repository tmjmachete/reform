import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import LessonForm from '@/components/admin/LessonForm';
import { addResource, deleteLesson, deleteResource } from '@/app/school/admin/actions';

type Lesson = {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  video_url: string | null;
  notes: string | null;
  duration_minutes: number | null;
  sort_order: number;
  is_published: boolean;
};
type Resource = { id: string; title: string; file_url: string; sort_order: number };

export default async function EditLessonPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;
  const supabase = await createClient();

  const { data: lessonData } = await supabase
    .from('lessons')
    .select('id, course_id, slug, title, video_url, notes, duration_minutes, sort_order, is_published')
    .eq('id', lessonId)
    .maybeSingle();
  const lesson = lessonData as Lesson | null;
  if (!lesson) notFound();

  const { data: resData } = await supabase
    .from('resources')
    .select('id, title, file_url, sort_order')
    .eq('lesson_id', lessonId)
    .order('sort_order');
  const resources = (resData ?? []) as unknown as Resource[];

  const nextOrder = resources.length ? Math.max(...resources.map((r) => r.sort_order)) + 1 : 1;

  return (
    <div className="admin-page admin-narrow">
      <div className="admin-crumb">
        <Link href="/school/admin">Courses</Link> / <Link href={`/school/admin/courses/${id}`}>course</Link> / {lesson.title}
      </div>
      <h1>Edit lesson</h1>
      <LessonForm lesson={lesson} />

      <hr className="admin-hr" />

      <h2>Downloads</h2>
      {resources.length === 0 ? (
        <p className="admin-muted">No downloads attached.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>Title</th><th>File</th><th></th></tr></thead>
          <tbody>
            {resources.map((r) => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td><a className="admin-link" href={r.file_url} target="_blank" rel="noopener">{r.file_url}</a></td>
                <td>
                  <form action={deleteResource}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="course_id" value={id} />
                    <input type="hidden" name="lesson_id" value={lessonId} />
                    <button className="admin-delete sm" type="submit">Remove</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form action={addResource} className="admin-inline-form">
        <input type="hidden" name="course_id" value={id} />
        <input type="hidden" name="lesson_id" value={lessonId} />
        <input type="hidden" name="sort_order" value={nextOrder} />
        <input name="title" placeholder="Download title (e.g. Study guide PDF)" required />
        <input name="file_url" placeholder="/school/assets/notes/… or https://…" required />
        <button className="btn btn-secondary" type="submit">Add download</button>
      </form>

      <hr className="admin-hr" />

      <form action={deleteLesson} className="admin-danger">
        <input type="hidden" name="id" value={lessonId} />
        <input type="hidden" name="course_id" value={id} />
        <button className="admin-delete" type="submit">Delete lesson</button>
      </form>
    </div>
  );
}
