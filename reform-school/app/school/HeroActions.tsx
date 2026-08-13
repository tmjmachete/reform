'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function HeroActions() {
  const [supabase] = useState(() => createClient());
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSignedIn(!!session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  return (
    <div className="hero-actions fu4">
      <Link href="/school/courses" className="btn btn-primary">Browse courses</Link>
      {signedIn === false && (
        <Link href="/school/login" className="btn btn-secondary">Sign in with Google</Link>
      )}
      {signedIn === true && (
        <Link href="/school/profile" className="btn btn-secondary">My progress →</Link>
      )}
    </div>
  );
}
