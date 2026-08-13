'use server';

import { createClient } from '@/lib/supabase/server';

export async function submitSessionRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const topic = String(formData.get('topic') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim() || null;

  if (!name || !email || !topic) return { error: 'Please fill in all required fields.' };

  const { error } = await supabase.from('session_requests').insert({
    user_id: user?.id ?? null,
    name,
    email,
    topic,
    message,
  } as never);

  if (error) return { error: 'Something went wrong. Please try again.' };
  return { success: true };
}
