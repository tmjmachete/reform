import { createClient } from '@/lib/supabase/server';
import LocalTime from '@/components/LocalTime';

export const metadata = {
  title: 'Live sessions — re:form School',
  description: 'Upcoming live Bible studies and Q&A from re:form School.',
};

type SessionRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string;
  ends_at: string | null;
  join_url: string | null;
};

export const revalidate = 60;

export default async function SessionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('live_sessions')
    .select('id, title, description, starts_at, ends_at, join_url')
    .eq('is_published', true)
    .order('starts_at', { ascending: true });
  const sessions = (data ?? []) as unknown as SessionRow[];

  const now = Date.now();
  const upcoming = sessions.filter((s) => new Date(s.starts_at).getTime() >= now);
  const past = sessions
    .filter((s) => new Date(s.starts_at).getTime() < now)
    .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime());

  return (
    <main>
      <section className="hero">
        <div className="hero-in">
          <span className="label">Live sessions</span>
          <h1>Study together, live.</h1>
          <p className="hero-lead">
            Scheduled live studies and Q&amp;A. Join from anywhere — sessions are listed in your
            local time.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-head"><h2>Upcoming</h2></div>
        {upcoming.length === 0 ? (
          <div className="empty-state">No sessions scheduled right now — check back soon.</div>
        ) : (
          <div className="session-list">
            {upcoming.map((s) => (
              <div className="session-card" key={s.id}>
                <div className="session-when"><LocalTime iso={s.starts_at} /></div>
                <div className="session-main">
                  <h3>{s.title}</h3>
                  {s.description && <p>{s.description}</p>}
                </div>
                {s.join_url && (
                  <a className="btn btn-primary" href={s.join_url} target="_blank" rel="noopener">Join</a>
                )}
              </div>
            ))}
          </div>
        )}

        {past.length > 0 && (
          <>
            <div className="section-head" style={{ marginTop: 'var(--xxl)' }}><h2>Past sessions</h2></div>
            <div className="session-list">
              {past.map((s) => (
                <div className="session-card past" key={s.id}>
                  <div className="session-when"><LocalTime iso={s.starts_at} withTime={false} /></div>
                  <div className="session-main">
                    <h3>{s.title}</h3>
                    {s.description && <p>{s.description}</p>}
                  </div>
                  {s.join_url && (
                    <a className="btn btn-secondary" href={s.join_url} target="_blank" rel="noopener">Watch</a>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
