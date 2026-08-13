'use client';

import { useRef, useState } from 'react';
import { createForumPost } from './actions';

export default function NewPostForm({ type = 'discussion' }: { type?: 'discussion' | 'question' }) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!open) {
    return (
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        {type === 'question' ? '+ Ask a question' : '+ Start a discussion'}
      </button>
    );
  }

  return (
    <form
      className="forum-new-form"
      action={async (fd) => {
        setBusy(true);
        fd.append('type', type);
        await createForumPost(fd);
      }}
    >
      <input
        className="req-input"
        name="title"
        required
        placeholder={type === 'question' ? 'Your question…' : 'Discussion title…'}
        autoFocus
      />
      <textarea
        className="req-input req-textarea"
        name="body"
        rows={4}
        placeholder="Share your thoughts, questions, or reflections…"
      />
      <div className="forum-form-actions">
        <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  );
}
