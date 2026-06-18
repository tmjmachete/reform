import { saveCourse } from '@/app/school/admin/actions';

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

export default function CourseForm({ course }: { course?: Course }) {
  return (
    <form action={saveCourse} className="admin-form">
      {course && <input type="hidden" name="id" value={course.id} />}
      <label className="fld">
        <span>Title</span>
        <input name="title" defaultValue={course?.title ?? ''} required />
      </label>
      <label className="fld">
        <span>Slug <em>(URL: /courses/&lt;slug&gt;)</em></span>
        <input name="slug" defaultValue={course?.slug ?? ''} pattern="[a-z0-9-]+" required />
      </label>
      <label className="fld">
        <span>Summary <em>(short, shown on cards)</em></span>
        <textarea name="summary" defaultValue={course?.summary ?? ''} rows={2} />
      </label>
      <label className="fld">
        <span>Description <em>(full, shown on course page)</em></span>
        <textarea name="description" defaultValue={course?.description ?? ''} rows={4} />
      </label>
      <div className="fld-row">
        <label className="fld">
          <span>Access</span>
          <select name="access" defaultValue={course?.access ?? 'free'}>
            <option value="free">Free — public</option>
            <option value="auth">Members — signed-in only</option>
          </select>
        </label>
        <label className="fld">
          <span>Sort order</span>
          <input type="number" name="sort_order" defaultValue={course?.sort_order ?? 0} />
        </label>
      </div>
      <label className="chk">
        <input type="checkbox" name="is_published" defaultChecked={course?.is_published ?? false} />
        <span>Published <em>(visible on the site)</em></span>
      </label>
      <div className="admin-form-actions">
        <button className="btn btn-primary" type="submit">Save course</button>
      </div>
    </form>
  );
}
