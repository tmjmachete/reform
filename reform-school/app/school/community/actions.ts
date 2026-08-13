'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

async function getAuthorInfo(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', userId)
    .maybeSingle();
  const p = profile as { full_name: string | null; avatar_url: string | null } | null;
  return { authorName: p?.full_name ?? null, authorAvatar: p?.avatar_url ?? null };
}

export async function createForumPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/school/login');

  const title = String(formData.get('title') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  const type = String(formData.get('type') ?? 'discussion');
  if (!title || !body) return;

  const { authorName, authorAvatar } = await getAuthorInfo(supabase, user.id);

  const { data, error } = await supabase
    .from('forum_posts')
    .insert({
      user_id: user.id,
      author_name: authorName,
      author_avatar: authorAvatar,
      type: type === 'question' ? 'question' : 'discussion',
      title,
      body,
    } as never)
    .select('id')
    .single();

  if (error || !data) redirect('/school/community');

  revalidatePath('/school/community');
  revalidatePath('/school/community/ask');
  redirect(`/school/community/post/${(data as { id: string }).id}`);
}

export async function createForumReply(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/school/login');

  const postId = String(formData.get('post_id') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  if (!postId || !body) return;

  const { authorName, authorAvatar } = await getAuthorInfo(supabase, user.id);

  await supabase.from('forum_replies').insert({
    post_id: postId,
    user_id: user.id,
    body,
    author_name: authorName,
    author_avatar: authorAvatar,
  } as never);

  revalidatePath(`/school/community/post/${postId}`);
  redirect(`/school/community/post/${postId}`);
}

export async function deleteOwnForumPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/school/login');

  await supabase.from('forum_posts').delete().eq('id', String(formData.get('id'))).eq('user_id', user.id);
  revalidatePath('/school/community');
  redirect('/school/community');
}

export async function deleteOwnForumReply(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/school/login');

  const postId = String(formData.get('post_id') ?? '');
  await supabase.from('forum_replies').delete().eq('id', String(formData.get('id'))).eq('user_id', user.id);
  revalidatePath(`/school/community/post/${postId}`);
  redirect(`/school/community/post/${postId}`);
}
