import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import beliefsData from '@/content/learn/index.json';

type Belief = {
  id: number;
  slug: string;
  title: string;
  category: string;
  status: 'available' | 'soon';
};

const beliefs = beliefsData as Belief[];

export function generateStaticParams() {
  return beliefs.filter((b) => b.status !== 'soon').map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const b = beliefs.find((x) => x.slug === slug);
  return b
    ? { title: b.title, description: `Study notes on ${b.title} — Fundamental Belief ${b.id}.` }
    : { title: 'Learn of God' };
}

function readBody(slug: string): string | null {
  try {
    return fs.readFileSync(path.join(process.cwd(), 'content', 'learn', `${slug}.html`), 'utf8');
  } catch {
    return null;
  }
}

export default async function BeliefPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const belief = beliefs.find((b) => b.slug === slug);
  const body = belief ? readBody(slug) : null;
  if (!belief || !body) notFound();

  const idx = beliefs.findIndex((b) => b.id === belief.id);
  const prev = idx > 0 ? beliefs[idx - 1] : null;
  const next = idx < beliefs.length - 1 ? beliefs[idx + 1] : null;

  return (
    <main>
      <section className="post-hero">
        <div className="post-hero-in">
          <div className="pm">Learn of God · {belief.category} · Belief {belief.id} of 28</div>
          <h1>{belief.title}</h1>
        </div>
      </section>

      <article className="post-prose" dangerouslySetInnerHTML={{ __html: body }} />

      <div className="post-foot">
        <hr className="admin-hr" />
        <div className="lesson-actions" style={{ border: 0, paddingTop: 0, marginTop: 0 }}>
          <Link href="/learn" className="btn btn-secondary">← All beliefs</Link>
          <div className="lesson-nav-links">
            {prev && <Link href={`/learn/${prev.slug}`} className="btn btn-secondary">Previous</Link>}
            {next && <Link href={`/learn/${next.slug}`} className="btn btn-primary">Next →</Link>}
          </div>
        </div>
      </div>
    </main>
  );
}
