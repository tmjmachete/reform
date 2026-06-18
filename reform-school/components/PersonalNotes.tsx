'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { TablesInsert } from '@/lib/database.types';

type SaveState = 'idle' | 'saving' | 'saved';

export default function PersonalNotes({
  lessonId,
  signedIn,
  initialContent,
}: {
  lessonId: string;
  signedIn: boolean;
  initialContent: string;
}) {
  const [supabase] = useState(() => createClient());
  const [value, setValue] = useState(initialContent);
  const [state, setState] = useState<SaveState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    async (content: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setState('saving');
      const row: TablesInsert<'notes'> = { user_id: user.id, lesson_id: lessonId, content };
      await supabase.from('notes').upsert(row as never, { onConflict: 'user_id,lesson_id' });
      setState('saved');
    },
    [supabase, lessonId],
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onChange = (next: string) => {
    setValue(next);
    setState('idle');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => save(next), 800);
  };

  if (!signedIn) {
    return (
      <div className="panel-prompt">
        <p>Sign in to keep your own private notes on this lesson.</p>
        <Link href="/login" className="btn btn-secondary">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="notes-box">
      <div className="notes-head">
        <span>Private to you</span>
        <span className="save-state">{state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved' : ''}</span>
      </div>
      <textarea
        className="notes-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => value !== initialContent && save(value)}
        placeholder="Write your reflections, questions, and things to remember…"
        rows={6}
      />
    </div>
  );
}
