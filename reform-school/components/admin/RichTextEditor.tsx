'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

type Props = {
  initialContent: string;
  lessonId: string;
  onChange: (html: string) => void;
};

export default function RichTextEditor({ initialContent, lessonId, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ HTMLAttributes: { class: 'lesson-img' } }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Write your lesson notes here…' }),
    ],
    content: initialContent || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  async function handleImageUpload(file: File) {
    if (!editor) return;
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const path = `${lessonId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('lesson-images').upload(path, file, { upsert: false });
    if (error) { alert('Upload failed: ' + error.message); return; }
    const { data } = supabase.storage.from('lesson-images').getPublicUrl(path);
    editor.chain().focus().setImage({ src: data.publicUrl }).run();
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
    e.target.value = '';
  }

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL', prev ?? 'https://');
    if (url === null) return;
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }

  if (!editor) return null;

  return (
    <div className="rte-wrap">
      <div className="rte-toolbar" role="toolbar" aria-label="Editor toolbar">
        <button type="button" className={`rte-btn${editor.isActive('bold') ? ' is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
          <strong>B</strong>
        </button>
        <button type="button" className={`rte-btn${editor.isActive('italic') ? ' is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
          <em>I</em>
        </button>
        <span className="rte-sep" />
        <button type="button" className={`rte-btn${editor.isActive('heading', { level: 2 }) ? ' is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
          H2
        </button>
        <button type="button" className={`rte-btn${editor.isActive('heading', { level: 3 }) ? ' is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
          H3
        </button>
        <span className="rte-sep" />
        <button type="button" className={`rte-btn${editor.isActive('bulletList') ? ' is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
          •—
        </button>
        <button type="button" className={`rte-btn${editor.isActive('orderedList') ? ' is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
          1.
        </button>
        <button type="button" className={`rte-btn${editor.isActive('blockquote') ? ' is-active' : ''}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">
          ❝
        </button>
        <span className="rte-sep" />
        <button type="button" className="rte-btn"
          onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          —
        </button>
        <button type="button" className={`rte-btn${editor.isActive('link') ? ' is-active' : ''}`}
          onClick={setLink} title="Link">
          🔗
        </button>
        <button type="button" className="rte-btn rte-img-btn"
          onClick={() => fileRef.current?.click()} title="Insert image">
          Insert image
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />
      </div>
      <EditorContent editor={editor} className="rte-content" />
    </div>
  );
}
