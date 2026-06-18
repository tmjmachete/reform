'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

/**
 * Top navigation for the /school zone.
 *
 * Links to the main static site (Home, Learn, Journal) are plain <a> because
 * they leave the Next.js zone — basePath must NOT be prepended. Links that stay
 * inside /school use next/link, which auto-prepends basePath.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname(); // already stripped of basePath
  const router = useRouter();
  const coursesActive = pathname === '/' || pathname.startsWith('/courses');
  const sessionsActive = pathname.startsWith('/sessions');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0]
    ?? user?.email?.split('@')[0];

  const mainLinks = (
    <>
      <a href="/">Home</a>
      <a href="/learn">Learn of God</a>
      <a href="/journal">Reform Journal</a>
      <Link href="/courses" className={coursesActive ? 'active' : undefined}>Courses</Link>
      <Link href="/sessions" className={sessionsActive ? 'active' : undefined}>Live</Link>
    </>
  );

  const authControl = user ? (
    <>
      <Link href="/account" className="nav-user" title={user.email ?? undefined}>{firstName}</Link>
      <button className="nav-signout" onClick={signOut}>Sign out</button>
    </>
  ) : (
    <Link href="/login" className="nav-cta">Sign in</Link>
  );

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>

      <nav className="nav" aria-label="Main navigation">
        <Link className="nav-logo" href="/" aria-label="re:form School home">
          <img src="/school/assets/logo.png" alt="re:form" />
        </Link>

        <div className="nav-links" role="menubar">
          {mainLinks}
          {authControl}
        </div>

        <button
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </nav>

      <div className={`mob${open ? ' open' : ''}`} role="menu">
        {mainLinks}
        {user ? (
          <>
            <Link href="/account" onClick={() => setOpen(false)}>{firstName} — Account</Link>
            <a role="button" tabIndex={0} onClick={signOut}>Sign out</a>
          </>
        ) : (
          <Link href="/login" className="active" onClick={() => setOpen(false)}>Sign in</Link>
        )}
      </div>
    </>
  );
}
