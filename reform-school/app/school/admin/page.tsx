import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  access: string;
  is_published: boolean;
  sort_order: number;
  lessons: { count: number }[];
};

export default async function AdminHome() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('courses')
    .select('id, title, slug, access, is_published, sort_order, lessons(count)')
    .order('sort_order');
  const courses = (data ?? []) as unknown as CourseRow[];

  return (
    <div className="admin-page">
      <div className="admin-head">
        <h1>Courses</h1>
        <Link href="/school/admin/courses/new" className="btn btn-primary">New course</Link>
      </div>

      {courses.length === 0 ? (
        <p className="admin-muted">No courses yet. Create your first one.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Access</th><th>Lessons</th><th>Status</th></tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td><Link href={`/school/admin/courses/${c.id}`} className="admin-link">{c.title}</Link></td>
                <td>{c.access === 'free' ? 'Free' : 'Members'}</td>
                <td>{c.lessons?.[0]?.count ?? 0}</td>
                <td>
                  <span className={`admin-pill ${c.is_published ? 'pub' : 'draft'}`}>
                    {c.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
