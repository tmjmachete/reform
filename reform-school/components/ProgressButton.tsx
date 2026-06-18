'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { TablesInsert } from '@/lib/database.types';

export default function ProgressButton({
  lessonId,
  initialCompleted,
  signedIn,
}: {
  lessonId: string;
  initialCompleted: boolean;
  signedIn: boolean;
}) {
  const [done, setDone] = useState(initialCompleted);
  const [busy, setBusy] = useState(false);
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  const toggle = async () => {
    if (!signedIn) {
      router.push('/school/login');
      return;
    }
    setBusy(true);
    if (done) {
      await supabase.from('progress').delete().eq('lesson_id', lessonId);
      setDone(false);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const row: TablesInsert<'progress'> = {
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        };
        await supabase.from('progress').upsert(row as never, { onConflict: 'user_id,lesson_id' });
        setDone(true);
      }
    }
    setBusy(false);
    router.refresh();
  };

  return (
    <button className={`progress-btn${done ? ' done' : ''}`} onClick={toggle} disabled={busy}>
      {done ? '✓ Completed' : 'Mark complete'}
    </button>
  );
}
