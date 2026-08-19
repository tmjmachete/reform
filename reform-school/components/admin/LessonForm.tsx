'use client';

import { useState } from 'react';
import { saveLesson } from '@/app/school/admin/actions';
import RichTextEditor from './RichTextEditor';

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

export default function LessonForm({ lesson }: { lesson: Lesson }) {
  const [notes, setNotes] = useState(lesson.notes ?? '');

  return (
    <form action={saveLesson} className="admin-form">
      <input type="hidden" name="id" value={lesson.id} />
      <input type="hidden" name="course_id" value={lesson.course_id} />
      <label className="fld">
        <span>Title</span>
        <input name="title" defaultValue={lesson.title} required />
      </label>
      <label className="fld">
        <span>Slug <em>(URL segment)</em></span>
        <input name="slug" defaultValue={lesson.slug} pattern="[a-z0-9-]+" required />
      </label>
      <label className="fld">
        <span>YouTube link <em>(paste any YouTube URL — leave blank for "coming soon")</em></span>
        <input name="video_url" defaultValue={lesson.video_url ?? ''} placeholder="https://youtu.be/…" />
      </label>

      <div className="fld">
        <span>Study notes</span>
        <RichTextEditor
          initialContent={lesson.notes ?? ''}
          lessonId={lesson.id}
          onChange={setNotes}
        />
        <input type="hidden" name="notes" value={notes} />
      </div>

      <div className="fld-row">
        <label className="fld">
          <span>Duration (minutes)</span>
          <input type="number" name="duration_minutes" defaultValue={lesson.duration_minutes ?? ''} />
        </label>
        <label className="fld">
          <span>Sort order</span>
          <input type="number" name="sort_order" defaultValue={lesson.sort_order} />
        </label>
      </div>
      <label className="chk">
        <input type="checkbox" name="is_published" defaultChecked={lesson.is_published} />
        <span>Published</span>
      </label>
      <div className="admin-form-actions">
        <button className="btn btn-primary" type="submit">Save lesson</button>
      </div>
    </form>
  );
}
