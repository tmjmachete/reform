import { saveSession } from '@/app/school/admin/actions';

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

/** Convert an ISO string to the value a datetime-local input expects (local time). */
function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

export default function SessionForm({ session, courses }: { session?: Session; courses: CourseOpt[] }) {
  return (
    <form action={saveSession} className="admin-form">
      {session && <input type="hidden" name="id" value={session.id} />}
      <label className="fld">
        <span>Title</span>
        <input name="title" defaultValue={session?.title ?? ''} required />
      </label>
      <label className="fld">
        <span>Description</span>
        <textarea name="description" defaultValue={session?.description ?? ''} rows={3} />
      </label>
      <div className="fld-row">
        <label className="fld">
          <span>Starts</span>
          <input type="datetime-local" name="starts_at" defaultValue={toLocalInput(session?.starts_at ?? null)} required />
        </label>
        <label className="fld">
          <span>Ends <em>(optional)</em></span>
          <input type="datetime-local" name="ends_at" defaultValue={toLocalInput(session?.ends_at ?? null)} />
        </label>
      </div>
      <label className="fld">
        <span>Join link <em>(YouTube live, Meet, Zoom…)</em></span>
        <input name="join_url" defaultValue={session?.join_url ?? ''} placeholder="https://…" />
      </label>
      <label className="fld">
        <span>Related course <em>(optional)</em></span>
        <select name="course_id" defaultValue={session?.course_id ?? ''}>
          <option value="">— none —</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </label>
      <label className="chk">
        <input type="checkbox" name="is_published" defaultChecked={session?.is_published ?? true} />
        <span>Published</span>
      </label>
      <div className="admin-form-actions">
        <button className="btn btn-primary" type="submit">Save session</button>
      </div>
    </form>
  );
}
