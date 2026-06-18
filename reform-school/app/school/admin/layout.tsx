import Link from 'next/link';
import { requireAdmin } from '@/lib/admin';

export const metadata = { title: 'Admin — re:form School' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin">
      <div className="admin-bar">
        <span className="admin-brand">re:form School · Admin</span>
        <nav className="admin-nav">
          <Link href="/school/admin">Courses</Link>
          <Link href="/school/admin/sessions">Live sessions</Link>
          <Link href="/school/admin/comments">Comments</Link>
          <Link href="/">← Back to site</Link>
        </nav>
      </div>
      <div className="admin-body">{children}</div>
    </div>
  );
}
