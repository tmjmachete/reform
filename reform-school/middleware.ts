import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Run on the Node.js runtime — the Supabase client pulls in Node-only
  // modules that the default Edge runtime rejects.
  runtime: 'nodejs',
  matcher: [
    /*
     * Match all request paths except static assets and image files, so the
     * session is refreshed on every page/route navigation.
     */
    '/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
