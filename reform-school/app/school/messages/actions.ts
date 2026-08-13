'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/school/login');

  const recipientId = String(formData.get('recipient_id') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  if (!recipientId || !body) return;

  await supabase.from('direct_messages').insert({
    sender_id: user.id,
    recipient_id: recipientId,
    body,
  } as never);

  revalidatePath('/school/messages');
  redirect('/school/messages');
}
