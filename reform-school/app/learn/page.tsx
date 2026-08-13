import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Not found',
};

export default function LearnPage() {
  notFound();
}
