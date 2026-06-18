import Link from 'next/link';

export const metadata = {
  title: 'Learn of God — the 28 Fundamental Beliefs',
  description:
    'Study notes through the 28 Fundamental Beliefs of the Seventh-day Adventist Church — Scripture, context, and reflection.',
};

export default function LearnPage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <span className="label">Learn of God</span>
          <h1>The 28 Fundamental Beliefs.</h1>
          <p className="hero-lead">
            A study journey through the beliefs of the Seventh-day Adventist Church — Scripture,
            context, and reflection for every one.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="empty-state">
          The full set of study notes is being migrated into the new site. In the meantime, the
          related courses are live in the school.
          <div style={{ marginTop: 'var(--lg)' }}>
            <Link href="/school/courses" className="btn btn-primary">Browse courses</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
