'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

/** Brand-wide top navigation (whole re:form site + school). */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [supabase] = useState(() => createClient());
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const is = (p: string) => (p === '/' ? pathname === '/' : pathname.startsWith(p));

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

  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0] ?? user?.email?.split('@')[0];

  const links = (
    <>
      <Link href="/" className={is('/') ? 'active' : undefined}>Home</Link>
      <Link href="/learn" className={is('/learn') ? 'active' : undefined}>Learn of God</Link>
      <Link href="/journal" className={is('/journal') ? 'active' : undefined}>Reform Journal</Link>
      <Link href="/school" className={is('/school') ? 'active' : undefined}>School</Link>
    </>
  );

  return (
    <>
      <a href="#main" className="skip-link">Skip to main content</a>

      <nav className="nav" aria-label="Main navigation">
        <Link className="nav-logo" href="/" aria-label="re:form home">
          <img src="/assets/logo.png" alt="re:form" />
        </Link>

        <div className="nav-links" role="menubar">
          {links}
          {user ? (
            <>
              <Link href="/school/account" className="nav-user" title={user.email ?? undefined}>{firstName}</Link>
              <button className="nav-signout" onClick={signOut}>Sign out</button>
            </>
          ) : (
            <Link href="/school/login" className="nav-cta">Sign in</Link>
          )}
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

      <div className={`mob${open ? ' open' : ''}`} role="menu" onClick={() => setOpen(false)}>
        {links}
        {user ? (
          <>
            <Link href="/school/account">{firstName} — Account</Link>
            <a role="button" tabIndex={0} onClick={signOut}>Sign out</a>
          </>
        ) : (
          <Link href="/school/login" className="active">Sign in</Link>
        )}
      </div>
    </>
  );
}
