import { notFound } from 'next/navigation';
import Link from 'next/link';
import beliefs from '@/content/learn/index.json';

export const metadata = {
  title: 'Learn of God — the 28 Fundamental Beliefs',
  description:
    'Study notes through the 28 Fundamental Beliefs of the Seventh-day Adventist Church — Scripture, context, and reflection.',
  openGraph: {
    title: 'Learn of God — the 28 Fundamental Beliefs',
    description:
      'A study journey through the beliefs of the Seventh-day Adventist Church — Scripture, context, and reflection for every one.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Learn of God' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn of God — the 28 Fundamental Beliefs',
    description: 'Study notes through the 28 SDA Fundamental Beliefs — Scripture, context, and reflection.',
    images: ['/opengraph-image'],
  },
};

type Belief = {
  id: number;
  slug: string;
  title: string;
  category: string;
  status: 'available' | 'soon';
};

export default function LearnPage() {
  notFound();
  const list = beliefs as Belief[];
  // preserve first-seen category order
  const categories: string[] = [];
  for (const b of list) if (!categories.includes(b.category)) categories.push(b.category);

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
        {categories.map((cat) => (
          <div className="belief-group" key={cat}>
            <h2>{cat}</h2>
            <div className="lesson-list">
              {list.filter((b) => b.category === cat).map((b) =>
                b.status === 'soon' ? (
                  <div className="lesson-row" key={b.id} style={{ opacity: 0.5 }}>
                    <span className="ix">{String(b.id).padStart(2, '0')}</span>
                    <span className="lt">{b.title}</span>
                    <span className="go">Coming soon</span>
                  </div>
                ) : (
                  <Link href={`/learn/${b.slug}`} className="lesson-row" key={b.id}>
                    <span className="ix">{String(b.id).padStart(2, '0')}</span>
                    <span className="lt">{b.title}</span>
                    <span className="go">Read →</span>
                  </Link>
                ),
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
