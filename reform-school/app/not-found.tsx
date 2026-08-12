import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <span className="label" style={{ fontVariantNumeric: 'tabular-nums' }}>404</span>
          <h1>This page doesn't exist.</h1>
          <p className="hero-lead">
            The path you followed may have moved or never existed. Here are a few good places to start.
          </p>
          <div className="hero-actions">
            <Link href="/" className="btn btn-primary">Go home</Link>
            <Link href="/school" className="btn btn-secondary">Enter the school</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="lesson-list" style={{ maxWidth: 560 }}>
          <Link href="/school/courses" className="lesson-row">
            <span className="ix">→</span>
            <span className="lt">Course library</span>
            <span className="go">Browse</span>
          </Link>
          <Link href="/journal" className="lesson-row">
            <span className="ix">→</span>
            <span className="lt">Reform Journal</span>
            <span className="go">Read</span>
          </Link>
          <Link href="/learn" className="lesson-row">
            <span className="ix">→</span>
            <span className="lt">Learn of God — 28 Beliefs</span>
            <span className="go">Study</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
