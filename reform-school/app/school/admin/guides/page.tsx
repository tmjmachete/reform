export default function GuidesPage() {
  return (
    <div className="admin-page" style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 52px)' }}>
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', padding: '0 24px', display: 'flex', gap: 0 }}>
        <a
          href="/school/admin/guides"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            fontSize: 'var(--caption)',
            fontWeight: 500,
            textDecoration: 'none',
            color: 'var(--ink)',
            borderBottom: '2px solid var(--ink)',
          }}
        >
          Admin Guide
        </a>
        <a
          href="/school/admin/guides/test-pack"
          style={{
            display: 'inline-block',
            padding: '12px 20px',
            fontSize: 'var(--caption)',
            fontWeight: 500,
            textDecoration: 'none',
            color: 'var(--muted)',
            borderBottom: '2px solid transparent',
          }}
        >
          Phase 4 Test Pack
        </a>
      </div>
      <iframe
        src="/school/admin-guides/admin-guide.html"
        style={{ flex: 1, width: '100%', border: 'none' }}
        title="Admin Test Guide"
      />
    </div>
  );
}
