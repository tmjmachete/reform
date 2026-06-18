import { createClient } from '@/lib/supabase/server';
import LocalTime from '@/components/LocalTime';
import { setCommentHidden, deleteComment } from '@/app/school/admin/actions';

type CommentRow = {
  id: string;
  body: string;
  is_hidden: boolean;
  author_name: string | null;
  created_at: string;
  lessons: { title: string } | null;
};

export default async function AdminComments() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('comments')
    .select('id, body, is_hidden, author_name, created_at, lessons(title)')
    .order('created_at', { ascending: false })
    .limit(100);
  const comments = (data ?? []) as unknown as CommentRow[];

  return (
    <div className="admin-page">
      <div className="admin-head"><h1>Comments</h1></div>
      {comments.length === 0 ? (
        <p className="admin-muted">No comments yet.</p>
      ) : (
        <div className="mod-list">
          {comments.map((c) => (
            <div className={`mod-row${c.is_hidden ? ' hidden' : ''}`} key={c.id}>
              <div className="mod-main">
                <div className="mod-meta">
                  <span className="cm-name">{c.author_name || 'Member'}</span>
                  <span className="cm-time"><LocalTime iso={c.created_at} /></span>
                  {c.lessons?.title && <span className="mod-lesson">on “{c.lessons.title}”</span>}
                  {c.is_hidden && <span className="admin-pill draft">Hidden</span>}
                </div>
                <p className="mod-body">{c.body}</p>
              </div>
              <div className="mod-actions">
                <form action={setCommentHidden}>
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="hidden" value={c.is_hidden ? '0' : '1'} />
                  <button className="admin-delete sm" type="submit">{c.is_hidden ? 'Unhide' : 'Hide'}</button>
                </form>
                <form action={deleteComment}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="admin-delete sm" type="submit">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
