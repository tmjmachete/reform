'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';

function str(fd: FormData, k: string): string {
  return String(fd.get(k) ?? '').trim();
}
function nullable(fd: FormData, k: string): string | null {
  const v = str(fd, k);
  return v === '' ? null : v;
}
function num(fd: FormData, k: string): number {
  const n = Number(fd.get(k));
  return Number.isFinite(n) ? n : 0;
}

/* ── courses ── */
export async function saveCourse(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = nullable(formData, 'id');
  const payload = {
    title: str(formData, 'title'),
    slug: str(formData, 'slug'),
    summary: nullable(formData, 'summary'),
    description: nullable(formData, 'description'),
    access: str(formData, 'access') || 'free',
    sort_order: num(formData, 'sort_order'),
    is_published: formData.get('is_published') != null,
  };

  let courseId = id;
  if (id) {
    await supabase.from('courses').update(payload as never).eq('id', id);
  } else {
    const { data, error } = await supabase.from('courses').insert(payload as never).select('id').single();
    if (error) throw new Error(error.message);
    courseId = (data as { id: string }).id;
  }
  revalidatePath('/admin');
  redirect(`/admin/courses/${courseId}`);
}

export async function deleteCourse(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('courses').delete().eq('id', str(formData, 'id'));
  revalidatePath('/admin');
  redirect('/admin');
}

/* ── lessons ── */
export async function createLesson(formData: FormData) {
  const { supabase } = await requireAdmin();
  const courseId = str(formData, 'course_id');
  const payload = {
    course_id: courseId,
    title: str(formData, 'title'),
    slug: str(formData, 'slug'),
    sort_order: num(formData, 'sort_order'),
    is_published: false,
  };
  const { data, error } = await supabase.from('lessons').insert(payload as never).select('id').single();
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}/lessons/${(data as { id: string }).id}`);
}

export async function saveLesson(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = str(formData, 'id');
  const courseId = str(formData, 'course_id');
  const payload = {
    title: str(formData, 'title'),
    slug: str(formData, 'slug'),
    video_url: nullable(formData, 'video_url'),
    notes: nullable(formData, 'notes'),
    duration_minutes: formData.get('duration_minutes') ? num(formData, 'duration_minutes') : null,
    sort_order: num(formData, 'sort_order'),
    is_published: formData.get('is_published') != null,
  };
  await supabase.from('lessons').update(payload as never).eq('id', id);
  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}/lessons/${id}`);
}

export async function deleteLesson(formData: FormData) {
  const { supabase } = await requireAdmin();
  const courseId = str(formData, 'course_id');
  await supabase.from('lessons').delete().eq('id', str(formData, 'id'));
  revalidatePath(`/admin/courses/${courseId}`);
  redirect(`/admin/courses/${courseId}`);
}

/* ── resources (downloads) ── */
export async function addResource(formData: FormData) {
  const { supabase } = await requireAdmin();
  const courseId = str(formData, 'course_id');
  const lessonId = str(formData, 'lesson_id');
  const payload = {
    course_id: courseId,
    lesson_id: lessonId,
    title: str(formData, 'title'),
    file_url: str(formData, 'file_url'),
    sort_order: num(formData, 'sort_order'),
  };
  await supabase.from('resources').insert(payload as never);
  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
  redirect(`/admin/courses/${courseId}/lessons/${lessonId}`);
}

export async function deleteResource(formData: FormData) {
  const { supabase } = await requireAdmin();
  const courseId = str(formData, 'course_id');
  const lessonId = str(formData, 'lesson_id');
  await supabase.from('resources').delete().eq('id', str(formData, 'id'));
  revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`);
  redirect(`/admin/courses/${courseId}/lessons/${lessonId}`);
}

/* ── live sessions ── */
export async function saveSession(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = nullable(formData, 'id');
  const startsLocal = str(formData, 'starts_at');
  const endsLocal = str(formData, 'ends_at');
  const payload = {
    title: str(formData, 'title'),
    description: nullable(formData, 'description'),
    course_id: nullable(formData, 'course_id'),
    starts_at: startsLocal ? new Date(startsLocal).toISOString() : new Date().toISOString(),
    ends_at: endsLocal ? new Date(endsLocal).toISOString() : null,
    join_url: nullable(formData, 'join_url'),
    is_published: formData.get('is_published') != null,
  };
  if (id) {
    await supabase.from('live_sessions').update(payload as never).eq('id', id);
  } else {
    await supabase.from('live_sessions').insert(payload as never);
  }
  revalidatePath('/admin/sessions');
  revalidatePath('/sessions');
  redirect('/admin/sessions');
}

export async function deleteSession(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('live_sessions').delete().eq('id', str(formData, 'id'));
  revalidatePath('/admin/sessions');
  revalidatePath('/sessions');
  redirect('/admin/sessions');
}

/* ── comment moderation ── */
export async function setCommentHidden(formData: FormData) {
  const { supabase } = await requireAdmin();
  const hidden = str(formData, 'hidden') === '1';
  await supabase.from('comments').update({ is_hidden: hidden } as never).eq('id', str(formData, 'id'));
  revalidatePath('/admin/comments');
}

export async function deleteComment(formData: FormData) {
  const { supabase } = await requireAdmin();
  await supabase.from('comments').delete().eq('id', str(formData, 'id'));
  revalidatePath('/admin/comments');
}
