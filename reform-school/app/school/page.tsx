import Link from 'next/link';

export const metadata = {
  title: 'School — Study the Word, deeply',
  description:
    'A Bible school from re:form. Guided courses, video lessons, written notes, downloadable studies, and live sessions.',
};

const previewCourses = [
  { n: '01', title: 'The Three Angels’ Messages', blurb: 'A six-lesson journey through Revelation 14 — judgment, worship, and the everlasting gospel.', access: 'free' as const, lessons: 6 },
  { n: '02', title: 'The Sanctuary & the Judgment', blurb: 'How the heavenly courtroom reveals the character of God and the hope of the cross.', access: 'gated' as const, lessons: 8 },
  { n: '03', title: 'Foundations of Faith', blurb: 'A guided study through the core beliefs — Scripture, salvation, and the Sabbath rest.', access: 'free' as const, lessons: 10 },
];

const features = [
  { k: '01', h: 'Course library', p: 'Structured studies, some open to all and some for enrolled students — built lesson by lesson.', s: 's-canvas' },
  { k: '02', h: 'Lesson player', p: 'The teaching video alongside the written notes, scripture, and reflection questions.', s: 's-peach' },
  { k: '03', h: 'Progress tracking', p: 'Pick up exactly where you left off. Every lesson you finish is remembered.', s: 's-mint' },
  { k: '04', h: 'Personal notes', p: 'Keep your own private notes against any lesson — your study journal, saved as you go.', s: 's-cream' },
  { k: '05', h: 'Community', p: 'Discuss each lesson with fellow students in threaded, moderated comments.', s: 's-soft' },
  { k: '06', h: 'Downloads', p: 'Printable PDF study guides for Sabbath school or personal devotion.', s: 's-yellow' },
  { k: '07', h: 'Live sessions', p: 'Join scheduled live studies and Q&A — see what’s coming up on the calendar.', s: 's-canvas' },
  { k: '08', h: 'Yours to keep', p: 'Sign in once with Google. Your progress and notes follow you on every device.', s: 's-mustard' },
];

export default function SchoolLanding() {
  return (
    <main>
      {/* ── HERO (white canvas, no gradient) ── */}
      <section className="hero">
        <div className="hero-in">
          <span className="label fu">re:form School</span>
          <h1 className="fu2">Study the Word, deeply.</h1>
          <p className="hero-lead fu3">
            A Bible school for honest seekers and lifelong students alike — guided courses,
            video teaching, written notes, and live sessions, rooted in Scripture and the
            message that brought re:form to life.
          </p>
          <div className="hero-actions fu4">
            <Link href="/school/courses" className="btn btn-primary">Browse courses</Link>
            <Link href="/school/login" className="btn btn-secondary">Sign in with Google</Link>
            <span className="hero-note">Free to start · no cost to enrol</span>
          </div>
        </div>
      </section>

      {/* ── SCRIPTURE ── */}
      <section className="scripture">
        <div className="scripture-in">
          <span className="ref">2 Timothy 2:15</span>
          <blockquote>
            “Study to shew thyself approved unto God, a workman that needeth not to be ashamed,
            rightly dividing the word of truth.”
          </blockquote>
        </div>
      </section>

      {/* ── SIGNATURE CORAL ── */}
      <section className="signature">
        <div className="signature-card sig-coral">
          <span className="label">The mission</span>
          <h2>The whole counsel of God — one lesson at a time.</h2>
          <p>
            Not a feed of clips, but an ordered path: every study moves from the text to the
            heart, with room to wrestle, take notes, and respond.
          </p>
          <Link href="/school/courses" className="btn btn-on-dark">Browse the library</Link>
        </div>
      </section>

      {/* ── FEATURES (pastel demo-grid) ── */}
      <section className="section">
        <div className="section-head">
          <h2>Everything you need to go deeper</h2>
          <p>The teaching, the notes, and the community in one place — built to carry you from your first lesson to your last.</p>
        </div>
        <div className="demo-grid">
          {features.map((f) => (
            <div className={`demo-card ${f.s}`} key={f.k}>
              <div className="k">{f.k}</div>
              <h3>{f.h}</h3>
              <p>{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CREAM CALLOUT ── */}
      <section className="callout">
        <div className="callout-card">
          <div>
            <h3>Take the study with you.</h3>
            <p>Every course ships with printable PDF guides — for the Sabbath table, the small group, or the quiet morning.</p>
          </div>
          <Link href="/school/courses" className="btn btn-secondary">See downloads</Link>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className="section">
        <div className="section-head">
          <h2>Courses to start with</h2>
          <p>A taste of the library. New studies are added as the school grows.</p>
        </div>
        <div className="course-grid">
          {previewCourses.map((c, i) => (
            <Link href="/school/courses" className="course-card" key={c.n}>
              <div className={`course-cover c${i}`}><span className="num">{c.n}</span></div>
              <div className="course-body">
                <div className="course-meta">
                  <span className={`badge ${c.access === 'free' ? 'badge-free' : 'badge-gated'}`}>
                    {c.access === 'free' ? 'Free' : 'Enrolled'}
                  </span>
                </div>
                <h3>{c.title}</h3>
                <p>{c.blurb}</p>
                <span className="foot">{c.lessons} lessons</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS (soft band) ── */}
      <section className="section" style={{ background: 'var(--surface-soft)' }}>
        <div className="section-head">
          <h2>Simple to begin</h2>
        </div>
        <div className="steps">
          <div className="step"><span className="n">STEP 01</span><h3>Sign in with Google</h3><p>One click. No passwords — your account is created the first time you sign in.</p></div>
          <div className="step"><span className="n">STEP 02</span><h3>Choose a course</h3><p>Start with a free study or enrol in a guided course. Work through it at your own pace.</p></div>
          <div className="step"><span className="n">STEP 03</span><h3>Watch, read, reflect</h3><p>Follow each lesson, keep your notes, download the guides, and join the conversation.</p></div>
        </div>
      </section>

      {/* ── DARK CTA ── */}
      <section className="cta-dark">
        <div className="cta-dark-card">
          <span className="label">Open the Word</span>
          <h2>Your first lesson is waiting.</h2>
          <p>Join free and begin a study today — wherever you are on the road back to God.</p>
          <Link href="/school/login" className="btn btn-on-dark">Get started</Link>
        </div>
      </section>

      {/* ── LIGHT CTA ── */}
      <section className="cta-light">
        <div className="cta-light-card">
          <h2>Begin a study today.</h2>
          <Link href="/school/courses" className="btn btn-primary">Browse courses</Link>
        </div>
      </section>
    </main>
  );
}
