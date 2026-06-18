import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SessionForm from '@/components/admin/SessionForm';

type CourseOpt = { id: string; title: string };

export default async function NewSessionPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('courses').select('id, title').order('sort_order');
  const courses = (data ?? []) as unknown as CourseOpt[];

  return (
    <div className="admin-page admin-narrow">
      <div className="admin-crumb"><Link href="/school/admin/sessions">Live sessions</Link> / New</div>
      <h1>New session</h1>
      <SessionForm courses={courses} />
    </div>
  );
}
