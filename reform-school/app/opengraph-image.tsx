import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#181d26',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: 80,
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          color: '#aa2d00',
          fontSize: 18,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}
      >
        re:form
      </div>
      <div
        style={{
          color: '#ffffff',
          fontSize: 56,
          fontWeight: 600,
          lineHeight: 1.15,
          maxWidth: 860,
        }}
      >
        An honest conversation about faith, life, and finding our way back to God.
      </div>
      <div
        style={{
          color: '#9297a0',
          fontSize: 22,
          marginTop: 28,
        }}
      >
        reformpod.vercel.app
      </div>
    </div>,
    { width: 1200, height: 630 },
  );
}
