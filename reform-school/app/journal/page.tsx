import Link from 'next/link';

export const metadata = {
  title: 'Reform Journal',
  description: 'Weekly reflections on faith and life from re:form — tied to the podcast.',
};

export default function JournalPage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <span className="label">Reform Journal</span>
          <h1>Reflections on the road home.</h1>
          <p className="hero-lead">
            Weekly writing on faith, doubt, and life — honest reflections tied to the re:form
            podcast, issue by issue.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="empty-state">
          The journal archive is being migrated into the new site and will appear here shortly.
          <div style={{ marginTop: 'var(--lg)' }}>
            <a href="https://youtube.com/@ReformPodcast" target="_blank" rel="noopener" className="btn btn-primary">
              Listen on YouTube
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
