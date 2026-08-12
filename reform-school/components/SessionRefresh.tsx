'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

// Calls getUser() on mount so the browser Supabase client can silently
// exchange a stale access token for a fresh one. Compensates for removing
// the middleware session-refresh that was incompatible with Vercel's Edge runtime.
export default function SessionRefresh() {
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser();
  }, []);
  return null;
}
