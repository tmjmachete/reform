import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Minimal Edge-compatible middleware — session refresh is handled in
// app/school/layout.tsx via the server Supabase client instead.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|assets/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
