'use client';

import { useEffect, useState } from 'react';

/** Renders an ISO timestamp in the visitor's local timezone (avoids server-UTC skew). */
export default function LocalTime({ iso, withTime = true }: { iso: string; withTime?: boolean }) {
  const [text, setText] = useState('');
  useEffect(() => {
    const d = new Date(iso);
    setText(
      d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) +
        (withTime
          ? `, ${d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
          : ''),
    );
  }, [iso, withTime]);
  // SSR fallback: a stable UTC date so markup matches before hydration fills local time.
  return <time dateTime={iso} suppressHydrationWarning>{text || new Date(iso).toISOString().slice(0, 10)}</time>;
}
