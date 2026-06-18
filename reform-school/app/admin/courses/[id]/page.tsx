import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CourseForm from '@/components/admin/CourseForm';
import { createLesson, deleteCourse } from '@/app/admin/actions';

type Course = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  access: string;
  sort_order: number;
  is_published: boolean;
};
type Lesson = { id: string; slug: string; title: string; sort_order: number; is_published: boolean };

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: courseData } = await supabase
    .from('courses')
    .select('id, slug, title, summary, description, access, sort_order, is_published')
    .eq('id', id)
    .maybeSingle();
  const course = courseData as Course | null;
  if (!course) notFound();

  const { data: lessonData } = await supabase
    .from('lessons')
    .select('id, slug, title, sort_order, is_published')
    .eq('course_id', id)
    .order('sort_order');
  const lessons = (lessonData ?? []) as unknown as Lesson[];

  const nextOrder = lessons.length ? Math.max(...lessons.map((l) => l.sort_order)) + 1 : 1;

  return (
    <div className="admin-page admin-narrow">
      <div className="admin-crumb"><Link href="/admin">Courses</Link> / {course.title}</div>
      <h1>Edit course</h1>
      <CourseForm course={course} />

      <hr className="admin-hr" />

      <div className="admin-head">
        <h2>Lessons</h2>
      </div>
      {lessons.length === 0 ? (
        <p className="admin-muted">No lessons yet.</p>
      ) : (
        <table className="admin-table">
          <thead><tr><th>#</th><th>Title</th><th>Status</th></tr></thead>
          <tbody>
            {lessons.map((l, i) => (
              <tr key={l.id}>
                <td>{i + 1}</td>
                <td><Link href={`/admin/courses/${id}/lessons/${l.id}`} className="admin-link">{l.title}</Link></td>
                <td><span className={`admin-pill ${l.is_published ? 'pub' : 'draft'}`}>{l.is_published ? 'Published' : 'Draft'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form action={createLesson} className="admin-inline-form">
        <input type="hidden" name="course_id" value={id} />
        <input type="hidden" name="sort_order" value={nextOrder} />
        <input name="title" placeholder="New lesson title" required />
        <input name="slug" placeholder="lesson-slug" pattern="[a-z0-9-]+" required />
        <button className="btn btn-secondary" type="submit">Add lesson</button>
      </form>

      <hr className="admin-hr" />

      <form action={deleteCourse} className="admin-danger">
        <input type="hidden" name="id" value={id} />
        <button className="admin-delete" type="submit">Delete course</button>
        <span className="admin-muted">Removes the course and all its lessons.</span>
      </form>
    </div>
  );
}
