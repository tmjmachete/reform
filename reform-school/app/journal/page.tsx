import Link from 'next/link';
import posts from '@/content/journal/index.json';

export const metadata = {
  title: 'Reform Journal',
  description: 'Weekly reflections on faith and life from re:form — tied to the podcast.',
};

type Post = {
  issue: string;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  image: string | null;
  badge: string | null;
};

export default function JournalPage() {
  const list = posts as Post[];
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
        <div className="journal-grid">
          {list.map((p) => (
            <Link href={`/journal/${p.slug}`} className="journal-card" key={p.slug}>
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="jc-cover" src={p.image} alt="" />
              ) : (
                <div className="jc-cover-fallback"><span className="iss">{p.issue}</span></div>
              )}
              <div className="jc-body">
                <div className="jc-meta">
                  <span>Issue {p.issue}</span>
                  <span>·</span>
                  <span>{p.date}</span>
                  {p.badge && <span className="badge badge-free" style={{ marginLeft: 'auto' }}>{p.badge}</span>}
                </div>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <span className="jc-more">Read →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
