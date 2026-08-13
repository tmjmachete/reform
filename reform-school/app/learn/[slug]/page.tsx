import { notFound } from 'next/navigation';

export function generateStaticParams() { return []; }

export async function generateMetadata() {
  return { title: 'Not found' };
}

export default async function BeliefPage() {
  notFound();
}
