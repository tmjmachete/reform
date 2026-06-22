import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Node.js runtime required — @supabase/ssr uses Node-only modules.
// Pair with experimental.nodeMiddleware: true in next.config.mjs.
export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
