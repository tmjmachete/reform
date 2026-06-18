import Link from 'next/link';

const pillars = [
  {
    href: '/journal',
    label: 'The Journal',
    title: 'Reform Journal',
    body: 'Weekly reflections on faith and life — honest writing tied to the podcast, issue by issue.',
    cls: 'sig-coral',
  },
  {
    href: '/learn',
    label: 'The Beliefs',
    title: 'Learn of God',
    body: 'Study notes through the 28 Fundamental Beliefs — Scripture, context, and reflection for each.',
    cls: 'sig-forest',
  },
  {
    href: '/school',
    label: 'The School',
    title: 're:form School',
    body: 'Guided Bible courses with video, notes, downloads, and live sessions. Free to begin.',
    cls: 'sig-dark',
  },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <span className="label">re:form</span>
          <h1>An honest conversation about faith, life, and finding our way back to God.</h1>
          <p className="hero-lead">
            A Seventh-day Adventist ministry — a podcast, a journal, study notes through the
            beliefs, and a Bible school. Wherever you are on the road, there’s a place to begin.
          </p>
          <div className="hero-actions">
            <Link href="/school" className="btn btn-primary">Enter the school</Link>
            <a href="https://youtube.com/@ReformPodcast" target="_blank" rel="noopener" className="btn btn-secondary">
              Listen on YouTube
            </a>
          </div>
        </div>
      </section>

      <section className="scripture">
        <div className="scripture-in">
          <span className="ref">Jeremiah 6:16</span>
          <blockquote>
            “Stand ye in the ways, and see, and ask for the old paths, where is the good way, and
            walk therein, and ye shall find rest for your souls.”
          </blockquote>
        </div>
      </section>

      <section className="signature" style={{ paddingTop: 'var(--section)' }}>
        <div className="section-head" style={{ paddingInline: 0 }}>
          <h2>Three ways in.</h2>
          <p>Read, study, or enrol — every path leads back to the Word.</p>
        </div>
      </section>

      {pillars.map((p) => (
        <section className="signature" key={p.href}>
          <Link href={p.href} className={`signature-card ${p.cls}`} style={{ display: 'block' }}>
            <span className="label">{p.label}</span>
            <h2>{p.title}</h2>
            <p>{p.body}</p>
            <span className="btn btn-on-dark">Open {p.title} →</span>
          </Link>
        </section>
      ))}

      <section className="cta-dark" style={{ paddingTop: 'var(--section)' }}>
        <div className="cta-dark-card">
          <span className="label">The podcast</span>
          <h2>Listen to the conversation.</h2>
          <p>New episodes on faith, doubt, and the journey home — on the re:form YouTube channel.</p>
          <a href="https://youtube.com/@ReformPodcast" target="_blank" rel="noopener" className="btn btn-on-dark">
            Watch on YouTube
          </a>
        </div>
      </section>

      <section className="cta-light">
        <div className="cta-light-card">
          <h2>Begin a study today.</h2>
          <Link href="/school/courses" className="btn btn-primary">Browse courses</Link>
        </div>
      </section>
    </main>
  );
}
